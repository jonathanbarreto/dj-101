import type {Metadata} from 'next';
import {Link} from '@astryxdesign/core/Link';
import {List, ListItem} from '@astryxdesign/core/List';
import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {SurfaceView} from '@/components/SurfaceView';
import {PageBreadcrumbs} from '@/components/PageBreadcrumbs';
import {PageFrame} from '@/components/PageFrame';
import {SECTIONS} from '@/content';
import type {SectionId} from '@/content/types';

export const metadata: Metadata = {
  title: 'Pioneer DJ DDJ-1000',
  description: 'Explore every taught section of the DDJ-1000, from both decks and the four-channel mixer to effects, browsing, and connections.',
  alternates: {canonical: '/controller'},
  openGraph: {
    type: 'website',
    siteName: 'Start Djing',
    title: 'Pioneer DJ DDJ-1000',
    description: 'Explore every taught section of the DDJ-1000, from both decks and the four-channel mixer to effects, browsing, and connections.',
    url: '/controller',
  },
};

const sectionCards: Array<{section: SectionId; description: string}> = [
  {section: 'deck-left', description: 'Transport, cues, jog behavior, and deck-level hot cues.'},
  {section: 'deck-right', description: 'Same performance flow for channels 2–4 and alternate deck habits.'},
  {section: 'mixer', description: 'Gain, routing, EQ, and crossfader decisions that shape the room tone.'},
  {section: 'fx', description: 'Beat FX and Sound Color FX behavior in a controlled phrase order.'},
  {section: 'browser', description: 'Load and prepare tracks with minimal context switching.'},
];

export default function ControllerPage() {
  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <PageBreadcrumbs items={[{label: 'Start Djing', href: '/'}, {label: 'Controller'}]} />
        <Text as="h1" type="display-1">Pioneer DJ DDJ-1000</Text>
        <Text type="large" as="p">
          Start with the untouched overhead view, then choose a populated section to
          learn its controls in context.
        </Text>
        <div>
          <Text type="label" color="accent">Quick path</Text>
          <Text as="p" color="secondary" textWrap="pretty">
            Learn these sections in order if you are building habits from the deck out.
          </Text>
          <List hasDividers density="spacious" aria-label="Recommended DDJ-1000 learning path">
            {sectionCards.map(({section, description}, index) => (
              <ListItem
                key={section}
                label={
                  <Text as="span">{`${String(index + 1).padStart(2, '0')} · ${SECTIONS[section].label}`}</Text>
                }
                description={description}
                href={`/controller/${section}`}
              />
            ))
            }
          </List>
          <List hasDividers density="spacious" aria-label="Controller support lessons">
            <ListItem
              href="/controller/rear"
              label="Rear connections"
              description="Build signal path, power, audio sources, and safe dual-computer handoffs."
            />
            <ListItem
              href="/controller/front"
              label="Front headphones"
              description="Understand cue mix routing and why both sockets share one bus."
            />
          </List>
          <Link href="/mixing-tutorials" isStandalone>
            Mix this into a hands-on transition exercise →
          </Link>
        </div>
        <SurfaceView surface="hardware" />
      </Stack>
    </PageFrame>
  );
}
