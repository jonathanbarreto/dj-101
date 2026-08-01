import Link from 'next/link';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';

export default function Home() {
  return (
    <main>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Text as="h1" type="display-1">dj-101</Text>
        <Text>
          An interactive guide to the Pioneer DDJ-1000 and rekordbox 7 — what every control does, and when to reach for it.
        </Text>
        <Stack direction="horizontal" gap={3} xstyle={undefined}>
          <Link href="/controller">The controller →</Link>
          <Link href="/rekordbox">rekordbox 7 →</Link>
        </Stack>
      </Stack>
    </main>
  );
}
