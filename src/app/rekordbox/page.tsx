import type {Metadata} from 'next';
import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {SurfaceView} from '@/components/SurfaceView';
import {PageBreadcrumbs} from '@/components/PageBreadcrumbs';
import {PageFrame} from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'rekordbox 7',
  description: 'Learn the rekordbox 7 Performance mode player deck and how it corresponds to the DDJ-1000 hardware.',
  alternates: {canonical: '/rekordbox'},
  openGraph: {
    type: 'website',
    siteName: 'dj-101',
    title: 'rekordbox 7',
    description: 'Learn the rekordbox 7 Performance mode player deck and how it corresponds to the DDJ-1000 hardware.',
    url: '/rekordbox',
  },
};

export default function RekordboxPage() {
  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <PageBreadcrumbs items={[{label: 'dj-101', href: '/'}, {label: 'rekordbox 7'}]} />
        <Text as="h1" type="display-1">rekordbox 7</Text>
        <Text type="large" as="p">
          Orient yourself in Performance mode, then open the populated player deck lesson.
        </Text>
        <SurfaceView surface="software" />
      </Stack>
    </PageFrame>
  );
}
