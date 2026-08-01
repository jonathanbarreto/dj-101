import type {Metadata} from 'next';
import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {SurfaceView} from '@/components/SurfaceView';

export const metadata: Metadata = {title: 'rekordbox 7 — dj-101'};

export default function RekordboxPage() {
  return (
    <main>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Text as="h1" type="display-1">rekordbox 7</Text>
        <SurfaceView surface="software" />
      </Stack>
    </main>
  );
}
