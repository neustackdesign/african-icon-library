/**
 * A deliberately small SVG reader.
 *
 * Icon-tier assets in this library are a constrained subset of SVG: one root
 * element, presentation attributes only, no entities, no CDATA, no namespaces
 * beyond `xmlns`. Parsing that subset by hand keeps the validator honest — an
 * asset the parser cannot read is an asset that fails validation, rather than
 * one a forgiving DOM library silently repairs.
 */

export interface SvgNode {
  tag: string;
  attributes: Record<string, string>;
  children: SvgNode[];
  /** Text content found directly inside the element, trimmed. */
  text: string;
}

export class SvgParseError extends Error {}

const TAG_PATTERN = /<(\/)?([a-zA-Z][\w:-]*)((?:\s+[\w:-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/)?>/g;
const ATTRIBUTE_PATTERN = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&');
}

function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  ATTRIBUTE_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = ATTRIBUTE_PATTERN.exec(source)) !== null) {
    attributes[match[1]] = decodeEntities(match[2] ?? match[3] ?? '');
  }
  return attributes;
}

/** Parses an SVG source string into a node tree. Throws on malformed markup. */
export function parseSvg(source: string): SvgNode {
  const withoutProlog = source
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  if (/<!\[CDATA\[/.test(withoutProlog)) {
    throw new SvgParseError('CDATA sections are not allowed in icon sources');
  }

  const stack: SvgNode[] = [];
  let root: SvgNode | null = null;
  let cursor = 0;

  TAG_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TAG_PATTERN.exec(withoutProlog)) !== null) {
    const [full, closing, tag, rawAttributes, selfClosing] = match;

    const between = withoutProlog.slice(cursor, match.index).trim();
    if (between && stack.length > 0) {
      stack[stack.length - 1].text += between;
    } else if (between) {
      throw new SvgParseError(
        `unexpected text outside the root element: "${between.slice(0, 40)}"`,
      );
    }
    cursor = match.index + full.length;

    if (closing) {
      const open = stack.pop();
      if (!open) throw new SvgParseError(`closing tag </${tag}> has no matching opening tag`);
      if (open.tag !== tag) {
        throw new SvgParseError(`closing tag </${tag}> does not match <${open.tag}>`);
      }
      continue;
    }

    const node: SvgNode = {
      tag,
      attributes: parseAttributes(rawAttributes ?? ''),
      children: [],
      text: '',
    };

    if (stack.length === 0) {
      if (root) throw new SvgParseError('an SVG file must contain exactly one root element');
      root = node;
    } else {
      stack[stack.length - 1].children.push(node);
    }

    if (!selfClosing) stack.push(node);
  }

  const trailing = withoutProlog.slice(cursor).trim();
  if (trailing) throw new SvgParseError(`unexpected trailing content: "${trailing.slice(0, 40)}"`);
  if (stack.length > 0)
    throw new SvgParseError(`unclosed element <${stack[stack.length - 1].tag}>`);
  if (!root) throw new SvgParseError('no SVG root element found');

  return root;
}

/** Depth-first walk over a node and all of its descendants. */
export function* walk(node: SvgNode): Generator<SvgNode> {
  yield node;
  for (const child of node.children) yield* walk(child);
}

/** Serialises the children of an element back to markup (used for icon bodies). */
export function serializeChildren(node: SvgNode): string {
  return node.children.map(serializeNode).join('');
}

export function serializeNode(node: SvgNode): string {
  const attributes = Object.entries(node.attributes)
    .map(([key, value]) => ` ${key}="${escapeAttribute(value)}"`)
    .join('');
  if (node.children.length === 0 && !node.text) return `<${node.tag}${attributes}/>`;
  return `<${node.tag}${attributes}>${node.text}${serializeChildren(node)}</${node.tag}>`;
}

export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
