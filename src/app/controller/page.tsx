import type {Metadata} from 'next';
import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {SurfaceView} from '@/components/SurfaceView';
import {PageFrame} from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Pioneer DJ DDJ-1000',
  description: 'Explore every taught section of the DDJ-1000, from both decks and the four-channel mixer to effects, browsing, and connections.',
  alternates: {canonical: '/controller'},
  openGraph: {
    type: 'website',
    siteName: 'dj-101',
    title: 'Pioneer DJ DDJ-1000',
    description: 'Explore every taught section of the DDJ-1000, from both decks and the four-channel mixer to effects, browsing, and connections.',
    url: '/controller',
  },
};

export default function ControllerPage() {
  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Text as="h1" type="display-1">Pioneer DJ DDJ-1000</Text>
        <Text type="large" as="p">
          Start with the untouched overhead view, then choose a populated section to learn its controls in context.
        </Text>
        <SurfaceView surface="hardware" />
      </Stack>
    </PageFrame>
  );
}
