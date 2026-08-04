import { describe, expect, it } from 'vitest';

import { PATHS, listSvgAssets, loadCategories, loadIcons } from '../scripts/lib/repo.ts';
import { summarise, validateAsset, validateCollection } from '../scripts/lib/validate.ts';
import type { Category, Icon, Weight } from '../packages/metadata/src/schema.ts';

const ROOT_ATTRS =
  'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
  'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

function svg(body: string, attributes = ROOT_ATTRS): { file: string; source: string } {
  return { file: '/tmp/fixture.svg', source: `<svg ${attributes}>${body}</svg>` };
}

function rules(body: string, attributes?: string): string[] {
  return [...new Set(validateAsset(svg(body, attributes)).map((finding) => finding.rule))].sort();
}

const VALID_BODY = '<rect x="4" y="4" width="16" height="16" rx="2"/>';

describe('validateAsset', () => {
  it('accepts a spec-compliant asset', () => {
    expect(validateAsset(svg(VALID_BODY))).toEqual([]);
  });

  it('reports unparseable markup instead of guessing', () => {
    expect(validateAsset({ file: 'x.svg', source: '<svg><g></svg>' })[0].rule).toBe('svg-parse');
  });

  it('rejects a non-svg root', () => {
    expect(validateAsset({ file: 'x.svg', source: '<div/>' })[0].rule).toBe('svg-parse');
  });

  describe('viewBox', () => {
    it('rejects a wrong viewBox', () => {
      const attributes = ROOT_ATTRS.replace('0 0 24 24', '0 0 48 48');
      expect(rules(VALID_BODY, attributes)).toContain('viewbox');
    });

    it('rejects a missing viewBox', () => {
      const attributes = ROOT_ATTRS.replace(' viewBox="0 0 24 24"', '');
      expect(rules(VALID_BODY, attributes)).toContain('viewbox');
    });

    it('rejects a malformed viewBox', () => {
      const attributes = ROOT_ATTRS.replace('0 0 24 24', 'not numbers');
      expect(rules(VALID_BODY, attributes)).toContain('viewbox');
    });
  });

  describe('bounds', () => {
    it('rejects geometry that leaves the canvas', () => {
      expect(rules('<rect x="0" y="0" width="24" height="24"/>')).toContain('bounds-canvas');
    });

    it('rejects geometry that leaves the live area', () => {
      expect(rules('<rect x="1" y="4" width="16" height="16"/>')).toContain('bounds-live-area');
    });

    it('measures curves, not just endpoints', () => {
      // Endpoints sit inside the live area; the cubic's apex does not.
      expect(rules('<path d="M4 4C4 -6 20 -6 20 4"/>')).toContain('bounds-live-area');
    });

    it('accounts for stroke width at the canvas edge', () => {
      // Centreline at 23.5 is inside the canvas; the 0.75 stroke halo is not.
      expect(rules('<path d="M4 23.5H20"/>')).toContain('bounds-canvas');
    });
  });

  describe('prohibited text', () => {
    it('rejects text elements', () => {
      expect(rules('<text x="4" y="4">NOLLYWOOD</text>')).toContain('prohibited-text');
    });

    it('rejects tspan and textPath', () => {
      expect(rules('<tspan>a</tspan>')).toContain('prohibited-text');
      expect(rules('<textPath>a</textPath>')).toContain('prohibited-text');
    });

    it('rejects stray text content inside a shape', () => {
      expect(rules('<g>NGN 10</g>')).toContain('prohibited-text');
    });
  });

  describe('hard-coded colour', () => {
    it('rejects a hex fill', () => {
      expect(rules('<rect x="4" y="4" width="16" height="16" fill="#2E7D4F"/>')).toContain(
        'hard-coded-colour',
      );
    });

    it('rejects a named colour on stroke', () => {
      expect(rules('<rect x="4" y="4" width="16" height="16" stroke="black"/>')).toContain(
        'hard-coded-colour',
      );
    });

    it('rejects rgb() and url() paints', () => {
      expect(rules('<rect x="4" y="4" width="16" height="16" fill="rgb(1,2,3)"/>')).toContain(
        'hard-coded-colour',
      );
      expect(rules('<rect x="4" y="4" width="16" height="16" fill="url(#g)"/>')).toContain(
        'hard-coded-colour',
      );
    });

    it('accepts currentColor and none', () => {
      expect(
        validateAsset(
          svg('<rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor"/>'),
        ),
      ).toEqual([]);
    });
  });

  describe('unsupported elements and attributes', () => {
    it('rejects script', () => {
      expect(rules('<script/>')).toContain('unsupported-element');
    });

    it('rejects embedded images and use references', () => {
      expect(rules('<image href="x.png"/>')).toContain('unsupported-element');
      expect(rules('<use href="#x"/>')).toContain('unsupported-element');
    });

    it('rejects unknown elements', () => {
      expect(rules('<blob d="M0 0"/>')).toContain('unsupported-element');
    });

    it('rejects ids, classes, styles and event handlers', () => {
      expect(rules('<rect id="a" x="4" y="4" width="16" height="16"/>')).toContain(
        'prohibited-attribute',
      );
      expect(rules('<rect class="a" x="4" y="4" width="16" height="16"/>')).toContain(
        'prohibited-attribute',
      );
      expect(rules('<rect style="fill:red" x="4" y="4" width="16" height="16"/>')).toContain(
        'prohibited-attribute',
      );
      expect(rules('<rect onclick="x()" x="4" y="4" width="16" height="16"/>')).toContain(
        'prohibited-attribute',
      );
    });

    it('rejects transforms, which would hide the real coordinates', () => {
      expect(
        rules('<rect transform="translate(4 4)" x="4" y="4" width="16" height="16"/>'),
      ).toContain('prohibited-attribute');
    });

    it('rejects attributes that are not valid on the element', () => {
      expect(rules('<circle cx="12" cy="12" r="6" width="4"/>')).toContain('unsupported-attribute');
    });
  });

  describe('root attributes', () => {
    it('rejects a missing currentColor stroke', () => {
      const attributes = ROOT_ATTRS.replace('stroke="currentColor"', 'stroke="#000"');
      expect(rules(VALID_BODY, attributes)).toContain('root-attributes');
    });

    it('rejects extra root attributes', () => {
      expect(rules(VALID_BODY, `${ROOT_ATTRS} data-generated="yes"`)).toContain('root-attributes');
    });
  });

  it('rejects an asset with no shapes', () => {
    expect(rules('')).toContain('empty-drawing');
  });
});

/* ------------------------------------------------------------------ */

const CATEGORY: Category = {
  id: 'food-drink',
  label: 'Food & Drink',
  description: 'Dishes.',
  auditKey: 'food',
};

function icon(overrides: Partial<Icon> = {}): Icon {
  return {
    id: 'suya',
    name: 'Suya',
    description: 'A skewer.',
    category: 'food-drink',
    tier: 'icon',
    regions: ['NG'],
    weights: ['regular'],
    keywords: [],
    localNames: [],
    status: 'released',
    addedIn: '0.1.0',
    culturalReview: { required: false, status: 'not-required' },
    provenance: {
      auditSourceFile: 'Suya Line.png',
      auditVerdict: 'redraw',
      referentConfirmed: true,
    },
    ...overrides,
  };
}

function asset(id: string, weight: Weight = 'regular') {
  return {
    id,
    weight,
    file: `/svg/${weight}/${id}.svg`,
    source: `<svg ${ROOT_ATTRS}>${VALID_BODY}</svg>`,
  };
}

describe('validateCollection', () => {
  const base = { categories: [CATEGORY], stagingAssets: [] };

  it('accepts a consistent set', () => {
    expect(validateCollection({ ...base, icons: [icon()], assets: [asset('suya')] })).toEqual([]);
  });

  it('reports an asset with no metadata record', () => {
    const findings = validateCollection({ ...base, icons: [], assets: [asset('suya')] });
    expect(findings.map((finding) => finding.rule)).toContain('missing-metadata');
  });

  it('reports metadata with no asset', () => {
    const findings = validateCollection({ ...base, icons: [icon()], assets: [] });
    expect(findings.map((finding) => finding.rule)).toContain('missing-asset');
  });

  it('reports a declared weight with no file', () => {
    const findings = validateCollection({
      ...base,
      icons: [icon({ weights: ['regular', 'bold'] })],
      assets: [asset('suya')],
    });
    expect(findings.map((finding) => finding.rule)).toContain('missing-weight-variant');
  });

  it('reports a file whose weight metadata does not declare', () => {
    const findings = validateCollection({
      ...base,
      icons: [icon()],
      assets: [asset('suya'), asset('suya', 'bold')],
    });
    expect(findings.map((finding) => finding.rule)).toContain('undeclared-weight-variant');
  });

  it('refuses a weight shipped for only part of the set', () => {
    const findings = validateCollection({
      ...base,
      icons: [icon({ weights: ['regular', 'bold'] }), icon({ id: 'jollof-rice' })],
      assets: [asset('suya'), asset('suya', 'bold'), asset('jollof-rice')],
    });
    const missing = findings.filter((finding) => finding.rule === 'missing-weight-variant');
    expect(missing.some((finding) => finding.target === 'jollof-rice')).toBe(true);
  });

  it('reports duplicate icon ids in metadata', () => {
    const findings = validateCollection({
      ...base,
      icons: [icon(), icon()],
      assets: [asset('suya')],
    });
    expect(findings.map((finding) => finding.rule)).toContain('duplicate-icon-id');
  });

  it('reports an unknown category reference', () => {
    const findings = validateCollection({
      ...base,
      icons: [icon({ category: 'nowhere' })],
      assets: [asset('suya')],
    });
    expect(findings.map((finding) => finding.rule)).toContain('unknown-category');
  });

  it('reports an icon without the baseline weight', () => {
    const findings = validateCollection({
      ...base,
      icons: [icon({ weights: ['bold'] })],
      assets: [asset('suya', 'bold')],
    });
    expect(findings.map((finding) => finding.rule)).toContain('missing-baseline-weight');
  });

  it('reports a file name that does not match its icon id', () => {
    const findings = validateCollection({
      ...base,
      icons: [icon()],
      assets: [{ ...asset('suya'), file: '/svg/regular/Suya Line.svg' }],
    });
    expect(findings.map((finding) => finding.rule)).toContain('asset-filename');
  });

  it('refuses to let a held drawing appear in the released set', () => {
    const findings = validateCollection({
      categories: [CATEGORY],
      icons: [icon()],
      assets: [asset('suya')],
      stagingAssets: [asset('suya')],
    });
    expect(findings.map((finding) => finding.rule)).toContain('staged-and-released');
  });
});

/* ------------------------------------------------------------------ */

describe('the repository as shipped', () => {
  it('has zero validation errors in the released set', async () => {
    const [categories, icons, assets, stagingAssets] = await Promise.all([
      loadCategories(),
      loadIcons(),
      listSvgAssets(PATHS.iconsSvgRoot),
      listSvgAssets(PATHS.iconsStagingRoot),
    ]);

    const findings = [
      ...assets.flatMap((entry) => validateAsset(entry)),
      ...validateCollection({ icons, categories, assets, stagingAssets }),
    ];

    expect(findings.filter((finding) => finding.severity === 'error')).toEqual([]);
    expect(summarise(findings).errors).toBe(0);
  });
});
