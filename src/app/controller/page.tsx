import type {Metadata} from 'next';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {SurfaceView} from '@/components/SurfaceView';
import {PageFrame} from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Pioneer DJ DDJ-1000',
  description: 'Explore every taught section of the DDJ-1000, from both decks and the four-channel mixer to effects, browsing, and connections.',
  alternates: {canonical: '/controller'},
  openGraph: {
    type: 'website',
    siteName: 'Start Djing',
    title: 'Pioneer DJ DDJ-1000',
    description: 'Explore every taught section of the DDJ-1000, from both decks and the four-channel mixer to effects, browsing, and connections.',
    url: '/controller',
  },
};

export default function ControllerPage() {
  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Stack direction="vertical" gap={2} xstyle={undefined}>
          <Text as="h1" type="display-1">DDJ-1000</Text>
          <Text as="p" type="large">
            Learn the decks, mixer, effects, pads, browser controls, and connections where they live.
          </Text>
        </Stack>
        <SurfaceView surface="hardware" />
      </Stack>
    </PageFrame>
  );
}
