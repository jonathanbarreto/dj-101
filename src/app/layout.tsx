import type { Metadata } from 'next';

import './globals.css';
import { SiteShell } from '@/components/SiteShell';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'dj-101 — DDJ-1000 & rekordbox 7',
    template: '%s — dj-101',
  },
  applicationName: 'dj-101',
  description:
    'An interactive guide to the Pioneer DDJ-1000 and rekordbox 7 — what every control does and when to reach for it.',
  openGraph: {
    type: 'website',
    siteName: 'dj-101',
    title: 'dj-101 — DDJ-1000 & rekordbox 7',
    description: 'Learn what every DDJ-1000 and rekordbox 7 Performance mode control does, when to use it, and why.',
  },
  twitter: {
    card: 'summary',
    title: 'dj-101 — DDJ-1000 & rekordbox 7',
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
