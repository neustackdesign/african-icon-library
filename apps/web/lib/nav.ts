/**
 * Navigation and repository links. Kept free of library data so client
 * components can import it without bundling canonical metadata.
 */
export const REPOSITORY_URL = 'https://github.com/neustackdesign/african-icon-library';

export const NAV = [
  { href: '/#browse', label: 'Icons' },
  { href: '/#maps', label: 'Maps' },
  { href: '/downloads', label: 'Downloads' },
  { href: '/spec', label: 'Spec' },
  { href: '/changelog', label: 'Releases' },
] as const;
