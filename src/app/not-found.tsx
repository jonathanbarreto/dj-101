import {Link} from '@astryxdesign/core/Link';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading, Text} from '@astryxdesign/core/Text';
import {PageFrame} from '@/components/PageFrame';

export default function NotFound() {
  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Text type="label" color="accent">404 · Track not found</Text>
        <Heading level={1} type="display-2">We lost the beat</Heading>
        <Text type="large" as="p">
          This lesson does not exist, or its control has moved. Return to the
          guide and choose a controller or rekordbox surface.
        </Text>
        <Link href="/" isStandalone>Return to Mixed →</Link>
      </Stack>
    </PageFrame>
  );
}
