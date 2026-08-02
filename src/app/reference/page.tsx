import type {Metadata} from 'next';
import {ClickableCard} from '@astryxdesign/core/ClickableCard';
import {Center} from '@astryxdesign/core/Center';
import {Grid} from '@astryxdesign/core/Grid';
import {Heading, Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {PageFrame} from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Reference library',
  description: 'Quick references for DDJ-1000 effects, EQ mixing, and phrase mixing in rekordbox 7.',
  alternates: {canonical: '/reference'},
  openGraph: {type: 'website', siteName: 'Mixed', title: 'Reference library', description: 'Quick references for DDJ-1000 effects, EQ mixing, and phrase mixing in rekordbox 7.', url: '/reference'},
};

const REFERENCES = [
  {href: '/reference/eq-mixing', label: 'EQ mixing', eyebrow: 'Mixing', description: 'Make space between two tracks with low, mid, and high-frequency decisions.'},
  {href: '/reference/phrase-mixing', label: 'Phrase mixing', eyebrow: 'Mixing', description: 'Line up beats, bars, and musical changes for clean house and techno transitions.'},
  {href: '/reference/beat-fx', label: 'Beat FX', eyebrow: 'DDJ-1000', description: 'Scan the effects selector, beat values, and LEVEL/DEPTH behavior.'},
  {href: '/reference/sound-color-fx', label: 'Sound Color FX', eyebrow: 'DDJ-1000', description: 'Learn what each COLOR knob direction does before you reach for it.'},
] as const;

export default function ReferenceIndexPage() {
  return (
    <PageFrame>
      <Center axis="horizontal">
        <VStack gap={8} style={{maxWidth: 1200, width: '100%', paddingInline: 'var(--spacing-6)', paddingBlock: 'var(--spacing-8)'}}>
          <VStack gap={3} maxWidth="760px">
            <Text type="label" color="accent">03 · Quick reference</Text>
            <Heading level={1} type="display-1">Reference library</Heading>
            <Text type="large" color="secondary">Short answers for the moments when you are at the controller and need the next move, not a manual.</Text>
          </VStack>
          <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
            {REFERENCES.map((reference) => (
              <ClickableCard key={reference.href} href={reference.href} label={reference.label}>
                <VStack gap={2} padding={5}>
                  <Text type="label" color="accent">{reference.eyebrow}</Text>
                  <Heading level={2}>{reference.label}</Heading>
                  <Text as="p" color="secondary">{reference.description}</Text>
                  <Text type="label" color="accent">Open reference →</Text>
                </VStack>
              </ClickableCard>
            ))}
          </Grid>
        </VStack>
      </Center>
    </PageFrame>
  );
}
