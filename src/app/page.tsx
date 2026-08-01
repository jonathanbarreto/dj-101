import { Stack } from '@astryxdesign/core/Stack';
import { Text } from '@astryxdesign/core/Text';

export default function Home() {
  return (
    <Stack direction="vertical" gap={4} xstyle={undefined}>
      <Text as="h1" type="display-1">
        dj-101
      </Text>
      <Text>DDJ-1000 and rekordbox 7, explained.</Text>
    </Stack>
  );
}
