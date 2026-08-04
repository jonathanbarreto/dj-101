import type {Metadata} from 'next';
import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {SurfaceView} from '@/components/SurfaceView';
import {PageFrame} from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'rekordbox 7',
  description: 'Learn rekordbox 7 through its player deck, browser, library, waveforms, mixer, effects, sampler, and recording controls.',
  alternates: {canonical: '/rekordbox'},
  openGraph: {
    type: 'website',
    siteName: 'Start Djing',
    title: 'rekordbox 7',
    description: 'Learn rekordbox 7 through its player deck, browser, library, waveforms, mixer, effects, sampler, and recording controls.',
    url: '/rekordbox',
  },
};

export default function RekordboxPage() {
  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Text as="h1" type="display-1">rekordbox 7</Text>
        <Text type="large" as="p">
          Learn the player deck, browser, library, waveforms, mixer, effects, sampler, and recording controls where they live.
        </Text>
        <SurfaceView surface="software" />
      </Stack>
    </PageFrame>
  );
}
