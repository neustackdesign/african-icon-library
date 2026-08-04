/**
 * Minimal, dependency-free SVG path geometry.
 *
 * The validator needs *tight* bounds for every drawing so it can prove that a
 * glyph sits inside the 24-unit canvas and inside the 2-unit live area. Sampling
 * is not good enough for that (it under-reports extrema on shallow curves), so
 * curves are solved analytically and arcs are converted to cubics first.
 */

export interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const EMPTY_BOX: Box = {
  minX: Number.POSITIVE_INFINITY,
  minY: Number.POSITIVE_INFINITY,
  maxX: Number.NEGATIVE_INFINITY,
  maxY: Number.NEGATIVE_INFINITY,
};

export function isEmptyBox(box: Box): boolean {
  return !Number.isFinite(box.minX) || !Number.isFinite(box.maxX);
}

export function mergeBoxes(a: Box, b: Box): Box {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

export function expandBox(box: Box, amount: number): Box {
  if (isEmptyBox(box)) return box;
  return {
    minX: box.minX - amount,
    minY: box.minY - amount,
    maxX: box.maxX + amount,
    maxY: box.maxY + amount,
  };
}

function boxOfPoints(points: Array<[number, number]>): Box {
  return points.reduce<Box>(
    (box, [x, y]) => ({
      minX: Math.min(box.minX, x),
      minY: Math.min(box.minY, y),
      maxX: Math.max(box.maxX, x),
      maxY: Math.max(box.maxY, y),
    }),
    EMPTY_BOX,
  );
}

/* ------------------------------------------------------------------ *
 * Path data tokenising
 * ------------------------------------------------------------------ */

export interface PathCommand {
  code: string;
  args: number[];
}

const COMMAND_ARITY: Record<string, number> = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7,
  z: 0,
};

const NUMBER_PATTERN = /-?\d*\.?\d+(?:[eE][+-]?\d+)?/g;

export class PathSyntaxError extends Error {}

/**
 * Splits a `d` attribute into commands. Throws on anything malformed so the
 * validator surfaces a real error instead of silently under-measuring a glyph.
 */
export function parsePath(d: string): PathCommand[] {
  const commands: PathCommand[] = [];
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:[eE][+-]?\d+)?/g);
  if (!tokens) return commands;

  let index = 0;
  let previousCode: string | null = null;

  while (index < tokens.length) {
    let code: string;
    const token = tokens[index];
    if (/[a-zA-Z]/.test(token)) {
      code = token;
      index += 1;
    } else if (previousCode) {
      // Implicit repetition: `M` repeats as `L`, `m` as `l`, everything else as itself.
      code = previousCode === 'M' ? 'L' : previousCode === 'm' ? 'l' : previousCode;
    } else {
      throw new PathSyntaxError(`path data starts with a number: "${d.slice(0, 32)}"`);
    }

    const arity = COMMAND_ARITY[code.toLowerCase()];
    if (arity === undefined) throw new PathSyntaxError(`unknown path command "${code}"`);

    const args: number[] = [];
    for (let i = 0; i < arity; i += 1) {
      const value = tokens[index];
      if (value === undefined || /[a-zA-Z]/.test(value)) {
        throw new PathSyntaxError(`command "${code}" is missing arguments`);
      }
      args.push(Number(value));
      index += 1;
    }

    commands.push({ code, args });
    previousCode = code;
  }

  return commands;
}

/* ------------------------------------------------------------------ *
 * Curve bounds
 * ------------------------------------------------------------------ */

function cubicAxisBounds(p0: number, p1: number, p2: number, p3: number): [number, number] {
  let min = Math.min(p0, p3);
  let max = Math.max(p0, p3);

  const a = -p0 + 3 * p1 - 3 * p2 + p3;
  const b = 2 * (p0 - 2 * p1 + p2);
  const c = p1 - p0;

  const consider = (t: number) => {
    if (t <= 0 || t >= 1) return;
    const mt = 1 - t;
    const value = mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
    min = Math.min(min, value);
    max = Math.max(max, value);
  };

  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) > 1e-12) consider(-c / b);
  } else {
    const discriminant = b * b - 4 * a * c;
    if (discriminant >= 0) {
      const root = Math.sqrt(discriminant);
      consider((-b + root) / (2 * a));
      consider((-b - root) / (2 * a));
    }
  }

  return [min, max];
}

export function cubicBounds(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
): Box {
  const [minX, maxX] = cubicAxisBounds(x0, x1, x2, x3);
  const [minY, maxY] = cubicAxisBounds(y0, y1, y2, y3);
  return { minX, minY, maxX, maxY };
}

function quadraticToCubic(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
): [number, number, number, number] {
  return [
    x0 + (2 / 3) * (cx - x0),
    y0 + (2 / 3) * (cy - y0),
    x1 + (2 / 3) * (cx - x1),
    y1 + (2 / 3) * (cy - y1),
  ];
}

/* ------------------------------------------------------------------ *
 * Elliptical arc -> cubic segments (SVG 1.1 F.6.5 endpoint parameterisation)
 * ------------------------------------------------------------------ */

export interface CubicSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
}

export function arcToCubics(
  x0: number,
  y0: number,
  rxInput: number,
  ryInput: number,
  xAxisRotationDeg: number,
  largeArcFlag: number,
  sweepFlag: number,
  x1: number,
  y1: number,
): CubicSegment[] {
  if (x0 === x1 && y0 === y1) return [];

  let rx = Math.abs(rxInput);
  let ry = Math.abs(ryInput);
  if (rx === 0 || ry === 0) {
    return [{ x1: x0, y1: y0, x2: x1, y2: y1, x: x1, y: y1 }];
  }

  const phi = (xAxisRotationDeg * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  const dx2 = (x0 - x1) / 2;
  const dy2 = (y0 - y1) / 2;
  const x1p = cosPhi * dx2 + sinPhi * dy2;
  const y1p = -sinPhi * dx2 + cosPhi * dy2;

  // Scale radii up when they are too small to span the endpoints (F.6.6).
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const scale = Math.sqrt(lambda);
    rx *= scale;
    ry *= scale;
  }

  const sign = largeArcFlag === sweepFlag ? -1 : 1;
  const numerator = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const denominator = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const coefficient = sign * Math.sqrt(Math.max(0, numerator / denominator));

  const cxp = (coefficient * rx * y1p) / ry;
  const cyp = (-coefficient * ry * x1p) / rx;
  const cx = cosPhi * cxp - sinPhi * cyp + (x0 + x1) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y0 + y1) / 2;

  const angle = (ux: number, uy: number, vx: number, vy: number) => {
    const dot = ux * vx + uy * vy;
    const len = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    let value = Math.acos(Math.min(1, Math.max(-1, dot / len)));
    if (ux * vy - uy * vx < 0) value = -value;
    return value;
  };

  const theta1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let deltaTheta = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);

  if (sweepFlag === 0 && deltaTheta > 0) deltaTheta -= 2 * Math.PI;
  if (sweepFlag === 1 && deltaTheta < 0) deltaTheta += 2 * Math.PI;

  const segmentCount = Math.max(1, Math.ceil(Math.abs(deltaTheta) / (Math.PI / 2)));
  const delta = deltaTheta / segmentCount;
  const alpha = (4 / 3) * Math.tan(delta / 4);

  const segments: CubicSegment[] = [];
  let theta = theta1;
  let currentX = x0;
  let currentY = y0;

  for (let i = 0; i < segmentCount; i += 1) {
    const thetaNext = theta + delta;

    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const cosNext = Math.cos(thetaNext);
    const sinNext = Math.sin(thetaNext);

    const dxTheta = -rx * sinTheta;
    const dyTheta = ry * cosTheta;
    const dxNext = -rx * sinNext;
    const dyNext = ry * cosNext;

    const endX = cx + cosPhi * (rx * cosNext) - sinPhi * (ry * sinNext);
    const endY = cy + sinPhi * (rx * cosNext) + cosPhi * (ry * sinNext);

    segments.push({
      x1: currentX + alpha * (cosPhi * dxTheta - sinPhi * dyTheta),
      y1: currentY + alpha * (sinPhi * dxTheta + cosPhi * dyTheta),
      x2: endX - alpha * (cosPhi * dxNext - sinPhi * dyNext),
      y2: endY - alpha * (sinPhi * dxNext + cosPhi * dyNext),
      x: endX,
      y: endY,
    });

    theta = thetaNext;
    currentX = endX;
    currentY = endY;
  }

  return segments;
}

/* ------------------------------------------------------------------ *
 * Whole-path bounds
 * ------------------------------------------------------------------ */

export function pathBounds(d: string): Box {
  const commands = parsePath(d);
  let box = EMPTY_BOX;

  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  let lastControlX: number | null = null;
  let lastControlY: number | null = null;
  let lastQuadX: number | null = null;
  let lastQuadY: number | null = null;

  const includePoint = (px: number, py: number) => {
    box = mergeBoxes(box, { minX: px, minY: py, maxX: px, maxY: py });
  };

  const includeCubic = (x1: number, y1: number, x2: number, y2: number, ex: number, ey: number) => {
    box = mergeBoxes(box, cubicBounds(x, y, x1, y1, x2, y2, ex, ey));
  };

  for (const { code, args } of commands) {
    const relative = code === code.toLowerCase() && code !== 'Z' && code !== 'z';
    const upper = code.toUpperCase();
    const originX = relative ? x : 0;
    const originY = relative ? y : 0;

    switch (upper) {
      case 'M': {
        x = originX + args[0];
        y = originY + args[1];
        startX = x;
        startY = y;
        includePoint(x, y);
        lastControlX = lastControlY = lastQuadX = lastQuadY = null;
        break;
      }
      case 'L': {
        x = originX + args[0];
        y = originY + args[1];
        includePoint(x, y);
        lastControlX = lastControlY = lastQuadX = lastQuadY = null;
        break;
      }
      case 'H': {
        x = originX + args[0];
        includePoint(x, y);
        lastControlX = lastControlY = lastQuadX = lastQuadY = null;
        break;
      }
      case 'V': {
        y = originY + args[0];
        includePoint(x, y);
        lastControlX = lastControlY = lastQuadX = lastQuadY = null;
        break;
      }
      case 'C': {
        const x1 = originX + args[0];
        const y1 = originY + args[1];
        const x2 = originX + args[2];
        const y2 = originY + args[3];
        const ex = originX + args[4];
        const ey = originY + args[5];
        includeCubic(x1, y1, x2, y2, ex, ey);
        lastControlX = x2;
        lastControlY = y2;
        lastQuadX = lastQuadY = null;
        x = ex;
        y = ey;
        break;
      }
      case 'S': {
        // Read the reflection state before the write below, for the same
        // reason as the T case.
        const previousX: number | null = lastControlX;
        const previousY: number | null = lastControlY;
        const x1: number = previousX === null ? x : 2 * x - previousX;
        const y1: number = previousY === null ? y : 2 * y - previousY;
        const x2 = originX + args[0];
        const y2 = originY + args[1];
        const ex = originX + args[2];
        const ey = originY + args[3];
        includeCubic(x1, y1, x2, y2, ex, ey);
        lastControlX = x2;
        lastControlY = y2;
        lastQuadX = lastQuadY = null;
        x = ex;
        y = ey;
        break;
      }
      case 'Q': {
        const cx = originX + args[0];
        const cy = originY + args[1];
        const ex = originX + args[2];
        const ey = originY + args[3];
        const [x1, y1, x2, y2] = quadraticToCubic(x, y, cx, cy, ex, ey);
        includeCubic(x1, y1, x2, y2, ex, ey);
        lastQuadX = cx;
        lastQuadY = cy;
        lastControlX = lastControlY = null;
        x = ex;
        y = ey;
        break;
      }
      case 'T': {
        // Annotated, and read before the write below: the reflected control
        // point feeds straight back into `lastQuadX`, which would otherwise
        // make the narrowed type of that `let` circular.
        const previousX: number | null = lastQuadX;
        const previousY: number | null = lastQuadY;
        const cx: number = previousX === null ? x : 2 * x - previousX;
        const cy: number = previousY === null ? y : 2 * y - previousY;
        const ex = originX + args[0];
        const ey = originY + args[1];
        const [x1, y1, x2, y2] = quadraticToCubic(x, y, cx, cy, ex, ey);
        includeCubic(x1, y1, x2, y2, ex, ey);
        lastQuadX = cx;
        lastQuadY = cy;
        lastControlX = lastControlY = null;
        x = ex;
        y = ey;
        break;
      }
      case 'A': {
        const ex = originX + args[5];
        const ey = originY + args[6];
        const segments = arcToCubics(x, y, args[0], args[1], args[2], args[3], args[4], ex, ey);
        for (const segment of segments) {
          includeCubic(segment.x1, segment.y1, segment.x2, segment.y2, segment.x, segment.y);
          x = segment.x;
          y = segment.y;
        }
        x = ex;
        y = ey;
        includePoint(x, y);
        lastControlX = lastControlY = lastQuadX = lastQuadY = null;
        break;
      }
      case 'Z': {
        x = startX;
        y = startY;
        lastControlX = lastControlY = lastQuadX = lastQuadY = null;
        break;
      }
      default:
        throw new PathSyntaxError(`unhandled path command "${code}"`);
    }
  }

  return box;
}

/* ------------------------------------------------------------------ *
 * Primitive shape bounds
 * ------------------------------------------------------------------ */

function num(value: string | undefined, fallback = 0): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function shapeBounds(tag: string, attributes: Record<string, string>): Box | null {
  switch (tag) {
    case 'path':
      return attributes.d ? pathBounds(attributes.d) : null;
    case 'rect': {
      const x = num(attributes.x);
      const y = num(attributes.y);
      return {
        minX: x,
        minY: y,
        maxX: x + num(attributes.width),
        maxY: y + num(attributes.height),
      };
    }
    case 'circle': {
      const cx = num(attributes.cx);
      const cy = num(attributes.cy);
      const r = num(attributes.r);
      return { minX: cx - r, minY: cy - r, maxX: cx + r, maxY: cy + r };
    }
    case 'ellipse': {
      const cx = num(attributes.cx);
      const cy = num(attributes.cy);
      const rx = num(attributes.rx);
      const ry = num(attributes.ry);
      return { minX: cx - rx, minY: cy - ry, maxX: cx + rx, maxY: cy + ry };
    }
    case 'line':
      return boxOfPoints([
        [num(attributes.x1), num(attributes.y1)],
        [num(attributes.x2), num(attributes.y2)],
      ]);
    case 'polyline':
    case 'polygon': {
      const numbers = attributes.points?.match(NUMBER_PATTERN)?.map(Number) ?? [];
      const points: Array<[number, number]> = [];
      for (let i = 0; i + 1 < numbers.length; i += 2) points.push([numbers[i], numbers[i + 1]]);
      return points.length ? boxOfPoints(points) : null;
    }
    default:
      return null;
  }
}

export function roundBox(box: Box, precision = 3): Box {
  const factor = 10 ** precision;
  return {
    minX: Math.round(box.minX * factor) / factor,
    minY: Math.round(box.minY * factor) / factor,
    maxX: Math.round(box.maxX * factor) / factor,
    maxY: Math.round(box.maxY * factor) / factor,
  };
}
