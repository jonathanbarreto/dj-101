import type { Metadata } from 'next';

import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'dj-101 — DDJ-1000 & rekordbox 7',
  description:
    'An interactive guide to the Pioneer DDJ-1000 and rekordbox 7 — what every control does and when to reach for it.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
