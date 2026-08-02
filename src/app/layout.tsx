import type { Metadata } from 'next';

import './globals.css';
import { SiteShell } from '@/components/SiteShell';
import { Providers } from './providers';
import {getSiteUrl} from '@/lib/site-url';

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: 'Start Djing — DDJ-1000 & rekordbox 7',
    template: '%s — Start Djing',
  },
  applicationName: 'Start Djing',
  description:
    'An interactive guide to the Pioneer DDJ-1000 and rekordbox 7 — what every control does and when to reach for it.',
  alternates: {canonical: '/'},
  icons: {icon: '/icon.svg'},
  openGraph: {
    type: 'website',
    siteName: 'Start Djing',
    title: 'Start Djing — DDJ-1000 & rekordbox 7',
    description: 'Learn what every DDJ-1000 and rekordbox 7 Performance mode control does, when to use it, and why.',
    url: '/',
  },
  twitter: {
    card: 'summary',
    title: 'Start Djing — DDJ-1000 & rekordbox 7',
    description: 'A practical, interactive guide to the DDJ-1000 and rekordbox 7 Performance mode.',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers><SiteShell>{children}</SiteShell></Providers>
      </body>
    </html>
  );
}
