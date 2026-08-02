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
        <Heading level={1} type="display-1">Start Djing</Heading>
        <Text type="large" as="p" color="secondary" textWrap="pretty">
          Practical lessons for the DDJ-1000, rekordbox 7, and the moves that make a mix flow.
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
            <Text as="p" color="secondary" textWrap="pretty">Explore the DDJ-1000 and rekordbox 7 together.</Text>
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
            <Text as="p" color="secondary" textWrap="pretty">Practice EQ, phrasing, loops, and transitions.</Text>
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
        <ListItem href="/reference" label="Browse all references" description="Effects, EQ, and phrase-mixing quick guides." />
      </List>
    </Stack>
  );
}
