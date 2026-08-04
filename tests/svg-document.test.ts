import { describe, expect, it } from 'vitest';

import { SvgParseError, parseSvg, serializeChildren, walk } from '../scripts/lib/svg-document.ts';

const MINIMAL = '<svg viewBox="0 0 24 24"><g><path d="M0 0"/></g></svg>';

describe('parseSvg', () => {
  it('builds a node tree', () => {
    const root = parseSvg(MINIMAL);
    expect(root.tag).toBe('svg');
    expect(root.attributes.viewBox).toBe('0 0 24 24');
    expect(root.children[0].tag).toBe('g');
    expect(root.children[0].children[0].attributes.d).toBe('M0 0');
  });

  it('walks depth first', () => {
    expect([...walk(parseSvg(MINIMAL))].map((node) => node.tag)).toEqual(['svg', 'g', 'path']);
  });

  it('strips prologs, doctypes and comments', () => {
    const root = parseSvg(
      `<?xml version="1.0"?><!DOCTYPE svg><!-- note --><svg viewBox="0 0 24 24"><path d="M0 0"/></svg>`,
    );
    expect(root.tag).toBe('svg');
    expect(root.children).toHaveLength(1);
  });

  it('decodes entities in attribute values', () => {
    const root = parseSvg('<svg data-x="a &amp; b &lt;c&gt;"><path d="M0 0"/></svg>');
    expect(root.attributes['data-x']).toBe('a & b <c>');
  });

  it('captures text content so the validator can reject it', () => {
    const root = parseSvg('<svg><text>NOLLYWOOD</text></svg>');
    expect(root.children[0].text).toBe('NOLLYWOOD');
  });

  it('rejects mismatched tags', () => {
    expect(() => parseSvg('<svg><g></path></svg>')).toThrow(SvgParseError);
  });

  it('rejects unclosed elements', () => {
    expect(() => parseSvg('<svg><g></svg>')).toThrow(SvgParseError);
  });

  it('rejects two root elements', () => {
    expect(() => parseSvg('<svg/><svg/>')).toThrow(SvgParseError);
  });

  it('rejects CDATA', () => {
    expect(() => parseSvg('<svg><![CDATA[x]]></svg>')).toThrow(SvgParseError);
  });

  it('rejects trailing content', () => {
    expect(() => parseSvg('<svg><path d="M0 0"/></svg>trailing')).toThrow(SvgParseError);
  });
});

describe('serializeChildren', () => {
  it('round-trips the drawing body', () => {
    const source = '<svg><ellipse cx="12" cy="5.5" rx="5.5"/><path d="M1 2"/></svg>';
    expect(serializeChildren(parseSvg(source))).toBe(
      '<ellipse cx="12" cy="5.5" rx="5.5"/><path d="M1 2"/>',
    );
  });

  it('escapes attribute values on the way out', () => {
    expect(serializeChildren(parseSvg('<svg><path d="a &amp; b"/></svg>'))).toBe(
      '<path d="a &amp; b"/>',
    );
  });
});
