import { describe, expect, it } from 'vitest';

import {
  PathSyntaxError,
  arcToCubics,
  parsePath,
  pathBounds,
  roundBox,
  shapeBounds,
} from '../scripts/lib/path-geometry.ts';

describe('parsePath', () => {
  it('splits commands and arguments', () => {
    expect(parsePath('M1 2L3 4')).toEqual([
      { code: 'M', args: [1, 2] },
      { code: 'L', args: [3, 4] },
    ]);
  });

  it('treats repeated coordinate pairs after M as implicit L', () => {
    expect(parsePath('M1 2 3 4')).toEqual([
      { code: 'M', args: [1, 2] },
      { code: 'L', args: [3, 4] },
    ]);
  });

  it('repeats non-move commands implicitly', () => {
    expect(parsePath('M0 0c1 1 2 2 3 3 4 4 5 5 6 6')).toHaveLength(3);
  });

  it('rejects a command with missing arguments', () => {
    expect(() => parsePath('M1 2L3')).toThrow(PathSyntaxError);
  });

  it('rejects an unknown command', () => {
    expect(() => parsePath('M0 0X1 1')).toThrow(PathSyntaxError);
  });
});

describe('pathBounds', () => {
  it('measures straight segments', () => {
    expect(roundBox(pathBounds('M2 4H20V18H2Z'))).toEqual({ minX: 2, minY: 4, maxX: 20, maxY: 18 });
  });

  it('finds the extremum of a cubic that overshoots its endpoints', () => {
    // Control points at y = 0 pull the curve above both endpoints (y = 10).
    const box = roundBox(pathBounds('M0 10C0 0 20 0 20 10'));
    expect(box.minY).toBeCloseTo(2.5, 3);
    expect(box.maxY).toBe(10);
  });

  it('handles smooth cubic reflection', () => {
    const explicit = roundBox(pathBounds('M0 0C5 10 15 10 20 0C25 -10 35 -10 40 0'));
    const smooth = roundBox(pathBounds('M0 0C5 10 15 10 20 0S35 -10 40 0'));
    expect(smooth).toEqual(explicit);
  });

  it('measures a half-circle arc through its apex, not just its endpoints', () => {
    const box = roundBox(pathBounds('M2 12A10 10 0 0 1 22 12'));
    expect(box).toEqual({ minX: 2, minY: 2, maxX: 22, maxY: 12 });
  });

  it('follows the sweep flag around the other side', () => {
    const box = roundBox(pathBounds('M2 12A10 10 0 0 0 22 12'));
    expect(box.minY).toBeCloseTo(12, 3);
    expect(box.maxY).toBeCloseTo(22, 3);
  });

  it('distinguishes the large arc from the small arc', () => {
    const small = roundBox(pathBounds('M6 12A10 10 0 0 1 18 12'));
    const large = roundBox(pathBounds('M6 12A10 10 0 1 1 18 12'));
    expect(large.maxY - large.minY).toBeGreaterThan(small.maxY - small.minY);
  });

  it('scales up radii that are too small to span the endpoints', () => {
    const box = roundBox(pathBounds('M0 0A1 1 0 0 1 20 0'));
    expect(box.maxX).toBeCloseTo(20, 3);
  });

  it('measures quadratics and their smooth continuation', () => {
    const box = roundBox(pathBounds('M0 10Q10 -10 20 10T40 10'));
    expect(box.minY).toBeLessThan(10);
    expect(box.maxX).toBe(40);
  });

  it('returns to the subpath start on Z', () => {
    const box = roundBox(pathBounds('M5 5H15V15Zm0 0'));
    expect(box).toEqual({ minX: 5, minY: 5, maxX: 15, maxY: 15 });
  });
});

describe('arcToCubics', () => {
  it('produces no segments for a zero-length arc', () => {
    expect(arcToCubics(5, 5, 10, 10, 0, 0, 1, 5, 5)).toEqual([]);
  });

  it('degrades to a straight line when a radius is zero', () => {
    const segments = arcToCubics(0, 0, 0, 10, 0, 0, 1, 10, 0);
    expect(segments).toHaveLength(1);
    expect(segments[0].x).toBe(10);
  });

  it('splits a full-ish sweep into quarter segments', () => {
    expect(arcToCubics(2, 12, 10, 10, 0, 1, 1, 22, 12).length).toBeGreaterThan(1);
  });
});

describe('shapeBounds', () => {
  it('measures a rect', () => {
    expect(shapeBounds('rect', { x: '2', y: '3', width: '10', height: '4' })).toEqual({
      minX: 2,
      minY: 3,
      maxX: 12,
      maxY: 7,
    });
  });

  it('measures a circle', () => {
    expect(shapeBounds('circle', { cx: '12', cy: '12', r: '5' })).toEqual({
      minX: 7,
      minY: 7,
      maxX: 17,
      maxY: 17,
    });
  });

  it('measures an ellipse', () => {
    expect(shapeBounds('ellipse', { cx: '12', cy: '6', rx: '5.5', ry: '1.75' })).toEqual({
      minX: 6.5,
      minY: 4.25,
      maxX: 17.5,
      maxY: 7.75,
    });
  });

  it('measures polylines and polygons', () => {
    expect(shapeBounds('polyline', { points: '1,2 5,9 3,1' })).toEqual({
      minX: 1,
      minY: 1,
      maxX: 5,
      maxY: 9,
    });
  });

  it('returns null for elements it cannot measure', () => {
    expect(shapeBounds('g', {})).toBeNull();
    expect(shapeBounds('path', {})).toBeNull();
  });
});
