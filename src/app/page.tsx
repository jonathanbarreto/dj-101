import {List, ListItem} from '@astryxdesign/core/List';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading, Text} from '@astryxdesign/core/Text';
import {PageFrame} from '@/components/PageFrame';

export default function Home() {
  return (
    <PageFrame>
      <Stack direction="vertical" gap={6} xstyle={undefined}>
        <Stack direction="vertical" gap={3} xstyle={undefined}>
          <Text type="label" color="accent">Learn the instrument, not a parts list</Text>
          <Heading level={1} type="display-1">dj-101</Heading>
          <Text type="large" as="p" textWrap="pretty">
            An interactive guide to the Pioneer DDJ-1000 and rekordbox 7 — what every control does, and when to reach for it.
          </Text>
        </Stack>
        <List hasDividers density="spacious" header={<Text type="label">Start learning</Text>}>
          <ListItem
            href="/controller"
            label="Learn the controller"
            description="Explore the decks, four-channel mixer, effects, browser, and every connection."
          />
          <ListItem
            href="/rekordbox"
            label="Learn rekordbox 7"
            description="Connect the physical controls to the player deck you see in Performance mode."
          />
          <ListItem
            href="/reference/beat-fx"
            label="Open the reference library"
            description="Compare all Beat FX, Sound Color FX directions, and the DDJ-1000 specifications."
          />
        </List>
      </Stack>
    </PageFrame>
  );
}
