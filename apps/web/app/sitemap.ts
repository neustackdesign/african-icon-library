import type { MetadataRoute } from 'next';

import { icons } from '@african-icon-library/metadata';

import { SITE } from '@/lib/site';

const STATIC_ROUTES = [
  '',
  '/spec',
  '/downloads',
  '/status',
  '/changelog',
  '/contributing',
  '/licence',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE.url}${route}`,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));

  const iconPages: MetadataRoute.Sitemap = icons.map((icon) => ({
    url: `${SITE.url}/icons/${icon.id}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...pages, ...iconPages];
}
