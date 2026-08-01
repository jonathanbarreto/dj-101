type SiteEnvironment = Readonly<Record<string, string | undefined>>;

export function getSiteUrl(environment: SiteEnvironment = process.env): URL {
  const configured = environment.NEXT_PUBLIC_SITE_URL?.trim()
    || environment.VERCEL_PROJECT_PRODUCTION_URL?.trim()
    || environment.VERCEL_URL?.trim();

  if (!configured) return new URL('http://localhost:3000');

  const url = new URL(configured.includes('://') ? configured : `https://${configured}`);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('The site URL must be an HTTP(S) origin.');
  }
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('The site URL must be an origin without credentials, path, query, or hash.');
  }
  if (url.protocol === 'http:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    throw new Error('The public site URL must use HTTPS.');
  }
  return url;
}
