import Image from 'next/image';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Grid} from '@astryxdesign/core/Grid';
import {List, ListItem} from '@astryxdesign/core/List';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading, Text} from '@astryxdesign/core/Text';
import {SURFACES} from '@/content';
import styles from './LearningDashboard.module.css';

export function LearningDashboard() {
  return (
    <Stack direction="vertical" gap={8} className={styles.dashboard}>
      <Stack direction="vertical" gap={3} maxWidth="760px">
        <Text type="label" color="accent">Pioneer DDJ-1000 + rekordbox 7</Text>
        <Heading level={1} type="display-1">dj-101</Heading>
        <Text type="large" as="p" textWrap="pretty">
          Learn the controls where they live, then connect each move to what you hear and see.
        </Text>
      </Stack>

      <Grid columns={2} gap={4} className={styles.learningGrid}>
        <ClickableCard
          href="/controller"
          label="Learn the controller"
          padding={0}
          className={styles.learningCard}
        >
          <Image
            className={styles.masterImage}
            src={SURFACES.hardware.image}
            alt={SURFACES.hardware.label}
            width={SURFACES.hardware.naturalWidth}
            height={SURFACES.hardware.naturalHeight}
            priority
            unoptimized
            sizes="(max-width: 767px) 100vw, 60vw"
          />
          <Stack direction="vertical" gap={2} padding={5}>
            <Heading level={2}>Learn the controller</Heading>
            <Text as="p" color="secondary" textWrap="pretty">
              Build muscle memory across the decks, mixer, effects, browser, and connections.
            </Text>
            <Text type="label" color="accent">Explore the controller</Text>
          </Stack>
        </ClickableCard>

        <ClickableCard
          href="/rekordbox"
          label="Learn rekordbox 7"
          padding={0}
          className={styles.learningCard}
        >
          <Image
            className={styles.masterImage}
            src={SURFACES.software.image}
            alt={SURFACES.software.label}
            width={SURFACES.software.naturalWidth}
            height={SURFACES.software.naturalHeight}
            unoptimized
            sizes="(max-width: 767px) 100vw, 40vw"
          />
          <Stack direction="vertical" gap={2} padding={5}>
            <Heading level={2}>Learn rekordbox 7</Heading>
            <Text as="p" color="secondary" textWrap="pretty">
              Read the player deck in Performance mode and connect software feedback to each move.
            </Text>
            <Text type="label" color="accent">Explore rekordbox</Text>
          </Stack>
        </ClickableCard>
      </Grid>

      <List
        density="spacious"
        hasDividers
        header={<Heading level={2}>Reference library</Heading>}
      >
        <ListItem href="/reference/beat-fx" label="Beat FX" />
        <ListItem href="/reference/sound-color-fx" label="Sound Color FX" />
        <ListItem href="/reference/specs" label="DDJ-1000 specifications" />
      </List>
    </Stack>
  );
}
