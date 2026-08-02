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
          Learn the controls where they live, then connect each move to what you hear and see. Mixed is your launch point for learning the gear, building your mix, and finding the right reference when you get stuck.
        </Text>
      </Stack>

      <Stack direction="vertical" gap={2}>
        <Heading level={2}>Choose a path</Heading>
        <Text as="p" color="secondary" textWrap="pretty">
          Start with the outcome you want. Each path stays focused, then points you to the next useful step.
        </Text>
      </Stack>

      <Grid columns={{minWidth: 260, repeat: 'fit'}} gap={4} align="start" className={styles.learningGrid}>
        <ClickableCard
          href="/controller"
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
            <Text type="label" color="accent">Start with the controller →</Text>
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

        <ClickableCard
          href="/reference/beat-fx"
          label="Open the reference library"
          padding={5}
          className={styles.referenceCard}
        >
          <Stack direction="vertical" gap={2}>
            <Text type="label" color="accent">03 · Look it up</Text>
            <Heading level={2}>Reference</Heading>
            <Text as="p" color="secondary" textWrap="pretty">
              Compare Beat FX, Sound Color FX, and DDJ-1000 specifications without leaving the guide.
            </Text>
            <Text type="label" color="accent">Browse the references →</Text>
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
        <ListItem href="/reference/specs" label="DDJ-1000 specifications" />
      </List>

      <List
        density="spacious"
        hasDividers
        aria-label="Continue learning"
        header={<Heading level={2}>Continue learning</Heading>}
      >
        <ListItem href="/rekordbox" label="Open rekordbox 7" description="Start in Performance mode if the software is your first stop." />
      </List>
    </Stack>
  );
}
