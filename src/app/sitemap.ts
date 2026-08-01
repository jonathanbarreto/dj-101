import type {MetadataRoute} from 'next';
import {getSiteUrl} from '@/lib/site-url';

export const PUBLISHED_ROUTES = [
  '/',
  '/controller',
  '/controller/deck-left',
  '/controller/deck-right',
  '/controller/mixer',
  '/controller/fx',
  '/controller/browser',
  '/controller/rear',
  '/controller/front',
  '/rekordbox',
  '/rekordbox/rb-deck',
  '/reference/beat-fx',
  '/reference/sound-color-fx',
  '/reference/specs',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return PUBLISHED_ROUTES.map((route) => ({url: new URL(route, siteUrl).href}));
}
