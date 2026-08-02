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
        <Text type="label" color="accent">DDJ-1000 + rekordbox 7 learning hub</Text>
        <Heading level={1} type="display-1">Mixed</Heading>
        <Text type="large" as="p" textWrap="pretty">
          Learn the controls where they live, then connect each move to what you hear and see. Mixed gives you two focused ways in: learn the gear, or start practicing your mix.
        </Text>
      </Stack>

      <Stack direction="vertical" gap={2}>
        <Heading level={2}>Start here</Heading>
        <Text as="p" color="secondary" textWrap="pretty">
          Begin with the controller and rekordbox 7, or jump straight into mixing lessons.
        </Text>
      </Stack>

      <Grid columns={{minWidth: 260, repeat: 'fit'}} gap={4} align="start" className={styles.learningGrid}>
        <ClickableCard
          href="/gear"
          label="Learn the gear"
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
            sizes="(max-width: 767px) 100vw, 60vw"
          />
          <Stack direction="vertical" gap={2} padding={5}>
            <Text type="label" color="accent">01 · Hardware + software</Text>
            <Heading level={2}>Learn the gear</Heading>
            <Text as="p" color="secondary" textWrap="pretty">
              Build muscle memory across the DDJ-1000, then connect each control to rekordbox 7 Performance mode.
            </Text>
            <Text type="label" color="accent">Choose a gear lesson →</Text>
          </Stack>
        </ClickableCard>

        <ClickableCard
          href="/mixing-tutorials"
          label="Mixing Tutorials"
          padding={0}
          className={styles.learningCard}
        >
          <Image
            className={styles.masterImage}
            src={SURFACES.software.image}
            alt={SURFACES.software.label}
            width={SURFACES.software.naturalWidth}
            height={SURFACES.software.naturalHeight}
            sizes="(max-width: 767px) 100vw, 40vw"
          />
          <Stack direction="vertical" gap={2} padding={5}>
            <Text type="label" color="accent">02 · Listen + practice</Text>
            <Heading level={2}>Mixing tutorials</Heading>
            <Text as="p" color="secondary" textWrap="pretty">
              Watch focused lessons, then bring the technique back to your own decks and transitions.
            </Text>
            <Text type="label" color="accent">Open the video library →</Text>
          </Stack>
        </ClickableCard>

      </Grid>

      <List
        density="spacious"
        hasDividers
        aria-label="Reference library"
        header={<Heading level={2}>Reference library</Heading>}
      >
        <ListItem href="/reference/beat-fx" label="Beat FX" />
        <ListItem href="/reference/sound-color-fx" label="Sound Color FX" />
        <ListItem href="/reference/eq-mixing" label="EQ mixing" description="Quickly make space between two tracks." />
        <ListItem href="/reference/phrase-mixing" label="Phrase mixing" description="Line up beats, bars, and musical changes." />
      </List>
    </Stack>
  );
}
