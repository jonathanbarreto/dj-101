import type {Metadata} from 'next';
import Image from 'next/image';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Center} from '@astryxdesign/core/Center';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading, Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {SURFACES} from '@/content';
import {PageFrame} from '@/components/PageFrame';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Learn the gear',
  description: 'Choose whether to explore the Pioneer DJ DDJ-1000 controller or get to know rekordbox 7 Performance mode.',
  alternates: {canonical: '/gear'},
  openGraph: {
    type: 'website',
    siteName: 'Mixed',
    title: 'Learn the gear',
    description: 'Choose whether to explore the Pioneer DJ DDJ-1000 controller or get to know rekordbox 7 Performance mode.',
    url: '/gear',
  },
};

export default function GearPage() {
  return (
    <PageFrame>
      <Center axis="horizontal">
        <VStack gap={8} style={{maxWidth: 1200, width: '100%', paddingInline: 'var(--spacing-6)', paddingBlock: 'var(--spacing-8)'}}>
          <VStack gap={3} maxWidth="760px">
            <Text type="label" color="accent">01 · Learn the gear</Text>
            <Heading level={1} type="display-1">Choose your starting point</Heading>
            <Text type="large" color="secondary">
              Learn the physical controls first, or start in rekordbox 7 and connect the software view back to the DDJ-1000.
            </Text>
          </VStack>

          <Grid columns={{minWidth: 320, repeat: 'fit'}} gap={4}>
            <ClickableCard href="/controller" label="Explore the DDJ-1000" padding={0}>
              <Image
                className={styles.image}
                src={SURFACES.hardware.image}
                alt={SURFACES.hardware.label}
                width={SURFACES.hardware.naturalWidth}
                height={SURFACES.hardware.naturalHeight}
                priority
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <VStack gap={2} padding={5}>
                <Text type="label" color="accent">Hardware</Text>
                <Heading level={2}>Explore the DDJ-1000</Heading>
                <Text as="p" color="secondary">Learn the decks, mixer, effects, pads, browser controls, and connections where they live.</Text>
                <Text type="label" color="accent">Explore the controller →</Text>
              </VStack>
            </ClickableCard>

            <ClickableCard href="/rekordbox" label="Get to know rekordbox 7" padding={0}>
              <Image
                className={styles.image}
                src={SURFACES.software.image}
                alt={SURFACES.software.label}
                width={SURFACES.software.naturalWidth}
                height={SURFACES.software.naturalHeight}
                sizes="(max-width: 767px) 100vw, 50vw"
              />
              <VStack gap={2} padding={5}>
                <Text type="label" color="accent">Software</Text>
                <Heading level={2}>Get to know rekordbox 7</Heading>
                <Text as="p" color="secondary">Read Performance mode, the player deck, waveforms, cues, and the browser alongside the hardware.</Text>
                <Text type="label" color="accent">Explore rekordbox 7 →</Text>
              </VStack>
            </ClickableCard>
          </Grid>
        </VStack>
      </Center>
    </PageFrame>
  );
}
