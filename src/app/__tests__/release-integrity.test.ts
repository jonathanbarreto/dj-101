import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';
import {metadata} from '../layout';
import robots from '../robots';
import sitemap, {PUBLISHED_ROUTES} from '../sitemap';
import {getSiteUrl} from '@/lib/site-url';
import {metadata as controllerMetadata} from '../controller/page';
import {generateMetadata as controllerSectionMetadata} from '../controller/[section]/page';
import {metadata as rekordboxMetadata} from '../rekordbox/page';
import {generateMetadata as rekordboxSectionMetadata} from '../rekordbox/[section]/page';
import {generateMetadata as referenceMetadata} from '../reference/[topic]/page';
import {generateStaticParams as controllerParams} from '../controller/[section]/page';
import {generateStaticParams as rekordboxParams} from '../rekordbox/[section]/page';
import {ALL_CONTROLS, SURFACES} from '@/content';

const root = resolve(import.meta.dirname, '../../..');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [readFileSync(path, 'utf8')] : [];
  });
}

describe('production release integrity', () => {
  it('provides crawl and identity surfaces', () => {
    expect(existsSync(resolve(root, 'src/lib/site-url.ts'))).toBe(true);
    expect(existsSync(resolve(root, 'src/app/robots.ts'))).toBe(true);
    expect(existsSync(resolve(root, 'src/app/sitemap.ts'))).toBe(true);
    expect(existsSync(resolve(root, 'src/app/icon.svg'))).toBe(true);
  });

  it('pins the package manager and supported Node range and exposes release checks', () => {
    const packageJson = JSON.parse(read('package.json')) as {
      packageManager?: string;
      engines?: {node?: string};
      scripts?: Record<string, string>;
    };

    expect(packageJson.packageManager).toBe('pnpm@10.28.2');
    expect(packageJson.engines?.node).toBe('>=20.9.0 <26');
    expect(packageJson.scripts?.typecheck).toBe('tsc --noEmit');
    expect(packageJson.scripts?.check).toBe('pnpm test && pnpm typecheck && pnpm build');
  });

  it('keeps the exact required legal attribution', () => {
    expect(read('src/components/SiteFooter.tsx')).toContain(
      'Product images © AlphaTheta Corporation / Pioneer DJ, used for educational\n' +
      '            identification. Pioneer DJ and DDJ-1000 are trademarks of AlphaTheta Corporation.\n' +
      '            This site is not affiliated with or endorsed by AlphaTheta.',
    );
  });

  it('contains no competitor names in shipped content', () => {
    expect(sourceFiles(resolve(root, 'src/content')).join('\n'))
      .not.toMatch(/virtualdj|serato/i);
  });

  it('normalizes deployment origins and uses a local fallback', () => {
    expect(getSiteUrl({NEXT_PUBLIC_SITE_URL: 'https://learn.example.com/'}).href)
      .toBe('https://learn.example.com/');
    expect(getSiteUrl({VERCEL_PROJECT_PRODUCTION_URL: 'dj-101.vercel.app'}).href)
      .toBe('https://dj-101.vercel.app/');
    expect(getSiteUrl({VERCEL_URL: 'preview-dj-101.vercel.app'}).href)
      .toBe('https://preview-dj-101.vercel.app/');
    expect(getSiteUrl({}).href).toBe('http://localhost:3000/');
  });

  it('prefers the public canonical origin and rejects path-bearing site URLs', () => {
    expect(getSiteUrl({
      NEXT_PUBLIC_SITE_URL: 'guide.example.com',
      VERCEL_PROJECT_PRODUCTION_URL: 'production.example.com',
      VERCEL_URL: 'preview.example.com',
    }).href).toBe('https://guide.example.com/');
    expect(() => getSiteUrl({NEXT_PUBLIC_SITE_URL: 'https://example.com/subpath'}))
      .toThrow(/origin/i);
  });

  it('publishes canonical metadata and crawl directives from the same origin', () => {
    expect(metadata.metadataBase?.href).toBe('http://localhost:3000/');
    expect(metadata.alternates).toEqual({canonical: '/'});
    expect(robots()).toEqual({
      rules: {userAgent: '*', allow: '/', disallow: '/dev/'},
      sitemap: 'http://localhost:3000/sitemap.xml',
    });
  });

  it('gives every public route its own canonical path', async () => {
    expect(controllerMetadata.alternates).toEqual({canonical: '/controller'});
    expect(rekordboxMetadata.alternates).toEqual({canonical: '/rekordbox'});
    await expect(controllerSectionMetadata({
      params: Promise.resolve({section: 'deck-left'}),
    })).resolves.toMatchObject({alternates: {canonical: '/controller/deck-left'}});
    await expect(rekordboxSectionMetadata({
      params: Promise.resolve({section: 'rb-deck'}),
    })).resolves.toMatchObject({alternates: {canonical: '/rekordbox/rb-deck'}});
    await expect(referenceMetadata({
      params: Promise.resolve({topic: 'beat-fx'}),
    })).resolves.toMatchObject({alternates: {canonical: '/reference/beat-fx'}});
  });

  it('lists every published route and no development or placeholder route', () => {
    const urls = sitemap().map(({url}) => url);
    expect(urls).toEqual([
      'http://localhost:3000/',
      'http://localhost:3000/controller',
      'http://localhost:3000/controller/deck-left',
      'http://localhost:3000/controller/deck-right',
      'http://localhost:3000/controller/mixer',
      'http://localhost:3000/controller/fx',
      'http://localhost:3000/controller/browser',
      'http://localhost:3000/controller/rear',
      'http://localhost:3000/controller/front',
      'http://localhost:3000/rekordbox',
      'http://localhost:3000/rekordbox/rb-deck',
      'http://localhost:3000/reference/beat-fx',
      'http://localhost:3000/reference/sound-color-fx',
      'http://localhost:3000/reference/specs',
    ]);
    expect(urls.every((url) => !url.includes('/dev/') && !url.includes('undefined'))).toBe(true);
  });

  it('publishes every generated lesson and every curated content link', () => {
    const published = new Set<string>(PUBLISHED_ROUTES);
    for (const {section} of controllerParams()) {
      expect(published.has(`/controller/${section}`), section).toBe(true);
    }
    for (const {section} of rekordboxParams()) {
      expect(published.has(`/rekordbox/${section}`), section).toBe(true);
    }
    for (const control of ALL_CONTROLS) {
      for (const link of control.referenceLinks ?? []) {
        expect(published.has(link.href), `${control.id}: ${link.href}`).toBe(true);
      }
    }
  });

  it('uses one unique master-image path per interactive surface', () => {
    const masters = Object.values(SURFACES).map(({image}) => image);
    expect(masters).toHaveLength(2);
    expect(new Set(masters).size).toBe(masters.length);
    expect(masters.every((image) => /\/[^/]*master\.avif$/.test(image))).toBe(true);
  });
});
