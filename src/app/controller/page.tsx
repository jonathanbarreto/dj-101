import type {Metadata} from 'next';
import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {SurfaceView} from '@/components/SurfaceView';

export const metadata: Metadata = {title: 'Pioneer DJ DDJ-1000 — dj-101'};

export default function ControllerPage() {
  return (
    <main>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Text as="h1" type="display-1">Pioneer DJ DDJ-1000</Text>
        <SurfaceView surface="hardware" />
      </Stack>
    </main>
  );
}
