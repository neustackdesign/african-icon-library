'use client';

import type { ReactNode } from 'react';

import { useBrowser } from './LibraryProvider';

/**
 * A link to the browser that also filters it to one category.
 *
 * Without JavaScript it is still a working link to `#browse`.
 */
export function CategoryLink({
  categoryId,
  className,
  label,
  children,
}: {
  categoryId: string;
  className?: string;
  label: string;
  children: ReactNode;
}) {
  const { showCategory } = useBrowser();
  return (
    <a
      href="#browse"
      className={className}
      aria-label={label}
      onClick={(event) => {
        event.preventDefault();
        showCategory(categoryId);
      }}
    >
      {children}
    </a>
  );
}
