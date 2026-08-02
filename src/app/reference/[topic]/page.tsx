import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import {Stack} from '@astryxdesign/core/Stack';
import {
  Table,
  pixel,
  proportional,
  type TableColumn,
} from '@astryxdesign/core/Table';
import {beatFx} from '@/content/reference/beat-fx';
import {soundColorFx} from '@/content/reference/sound-color-fx';
import styles from './ReferencePage.module.css';
import {PageBreadcrumbs} from '@/components/PageBreadcrumbs';
import {PageFrame} from '@/components/PageFrame';

const TOPICS = ['beat-fx', 'sound-color-fx', 'eq-mixing', 'phrase-mixing'] as const;
type ReferenceTopic = (typeof TOPICS)[number];
const TOPIC_LABELS: Record<ReferenceTopic, string> = {
  'beat-fx': 'Beat FX',
  'sound-color-fx': 'Sound Color FX',
  'eq-mixing': 'EQ mixing',
  'phrase-mixing': 'Phrase mixing',
};

interface BeatFxRow extends Record<string, unknown> {
  name: string;
  description: string;
  levelDepth: string;
  introduced: string;
}

const beatFxColumns: TableColumn<BeatFxRow>[] = [
  {key: 'name', header: 'Effect', width: pixel(150)},
  {key: 'description', header: 'What it does', width: proportional(3, {minWidth: 320})},
  {key: 'levelDepth', header: 'LEVEL / DEPTH', width: proportional(2, {minWidth: 240})},
  {key: 'introduced', header: 'Introduced on DDJ-1000', width: pixel(170)},
];

interface SoundColorFxRow extends Record<string, unknown> {
  name: string;
  description: string;
  turnLeft: string;
  center: string;
  turnRight: string;
}

const soundColorFxColumns: TableColumn<SoundColorFxRow>[] = [
  {key: 'name', header: 'Effect', width: pixel(120)},
  {key: 'description', header: 'What it does', width: proportional(2, {minWidth: 260})},
  {key: 'turnLeft', header: 'Turn left', width: proportional(1, {minWidth: 210})},
  {key: 'center', header: 'Center', width: proportional(1, {minWidth: 180})},
  {key: 'turnRight', header: 'Turn right', width: proportional(1, {minWidth: 210})},
];

function isReferenceTopic(topic: string): topic is ReferenceTopic {
  return TOPICS.includes(topic as ReferenceTopic);
}

export function generateStaticParams() {
  return TOPICS.map((topic) => ({topic}));
}

export async function generateMetadata({params}: {params: Promise<{topic: string}>}): Promise<Metadata> {
  const {topic} = await params;
  if (!isReferenceTopic(topic)) return {};
  const label = TOPIC_LABELS[topic];
  const title = `${label} reference`;
  const description = `A practical DDJ-1000 ${label} reference for rekordbox 7 Performance mode.`;
  const url = `/reference/${topic}`;
  return {
    title,
    description,
    alternates: {canonical: url},
    openGraph: {type: 'article', siteName: 'Start Djing', title, description, url},
  };
}

function ReferenceNav({topic}: {topic: ReferenceTopic}) {
  return (
    <Stack direction="horizontal" gap={3} wrap="wrap" as="nav">
      <Link
        href="/reference/beat-fx"
        isStandalone
        aria-current={topic === 'beat-fx' ? 'page' : undefined}>
        Beat FX
      </Link>
      <Link
        href="/reference/sound-color-fx"
        isStandalone
        aria-current={topic === 'sound-color-fx' ? 'page' : undefined}>
        Sound Color FX
      </Link>
      <Link href="/reference/eq-mixing" isStandalone aria-current={topic === 'eq-mixing' ? 'page' : undefined}>EQ mixing</Link>
      <Link href="/reference/phrase-mixing" isStandalone aria-current={topic === 'phrase-mixing' ? 'page' : undefined}>Phrase mixing</Link>
    </Stack>
  );
}

function TableScrollHint({id}: {id: string}) {
  return (
    <Text id={id} role="note" type="supporting" className={styles.scrollHint}>
      Swipe the table sideways to compare every column.
    </Text>
  );
}

function ReferenceIntro({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Stack direction="vertical" gap={3} className={styles.intro}>
      <Text type="label" weight="semibold" color="accent">
        DDJ-1000 field reference
      </Text>
      <Heading level={1} type="display-2">{title}</Heading>
      <Text type="large" as="p" textWrap="pretty">{children}</Text>
    </Stack>
  );
}

function BeatFxReference() {
  const rows: BeatFxRow[] = beatFx.map((effect) => ({
    ...effect,
    introduced: effect.isExclusive ? 'New on this controller' : '—',
  }));

  return (
    <>
      <ReferenceIntro title="Beat FX">
        Choose one effect, assign it to a channel, set its beat value, then use
        LEVEL/DEPTH to shape the result. That last knob does a different job for
        different effects, so scan its column before performing with an effect.
      </ReferenceIntro>
      <section className={styles.tableSection} aria-labelledby="beat-fx-table-heading">
        <Stack direction="vertical" gap={3}>
          <Heading level={2} id="beat-fx-table-heading">Selector order</Heading>
          <Text as="p">
            The rows follow the names printed around the hardware selector. “New
            on this controller” identifies the four effects introduced with the
            DDJ-1000; it is not a claim about later Pioneer DJ hardware.
          </Text>
          <TableScrollHint id="beat-fx-scroll-hint" />
          <Table
            data={rows}
            columns={beatFxColumns}
            idKey="name"
            density="balanced"
            dividers="rows"
            verticalAlign="top"
            textOverflow="wrap"
            isStriped
            aria-describedby="beat-fx-scroll-hint"
          />
        </Stack>
      </section>
    </>
  );
}

function SoundColorFxReference() {
  return (
    <>
      <ReferenceIntro title="Sound Color FX">
        Select one effect globally, then use each channel’s COLOR knob to apply
        it independently. The center detent is off; direction changes the effect,
        and distance from center increases its action.
      </ReferenceIntro>
      <section className={styles.tableSection} aria-labelledby="color-fx-table-heading">
        <Stack direction="vertical" gap={3}>
          <Heading level={2} id="color-fx-table-heading">COLOR knob directions</Heading>
          <Text as="p">
            Read left, center, and right as a physical sweep across the knob. For
            NOISE, the COLOR knob moves the filter while that channel’s TRIM
            adjusts the generated noise level.
          </Text>
          <TableScrollHint id="sound-color-fx-scroll-hint" />
          <Table
            data={soundColorFx}
            columns={soundColorFxColumns}
            idKey="name"
            density="balanced"
            dividers="rows"
            verticalAlign="top"
            textOverflow="wrap"
            isStriped
            aria-describedby="sound-color-fx-scroll-hint"
          />
        </Stack>
      </section>
    </>
  );
}

function QuickReference({topic}: {topic: 'eq-mixing' | 'phrase-mixing'}) {
  const isEq = topic === 'eq-mixing';
  return (
    <>
      <ReferenceIntro title={isEq ? 'EQ mixing' : 'Phrase mixing'}>
        {isEq
          ? 'Use the three channel EQ knobs to make space, not to make the mix louder. Cut competing frequencies before boosting anything.'
          : 'Line up the musical blocks of two tracks so beats, bars, and phrases change together. This is the fastest route to transitions that feel intentional.'}
      </ReferenceIntro>
      <section className={styles.quickReference} aria-label={isEq ? 'EQ mixing rules' : 'Phrase mixing rules'}>
        <div className={styles.visual} aria-label={isEq ? 'EQ frequency map' : 'Phrase structure timeline'} role="img">
          {isEq ? <>
            <div className={styles.eqAxis}><span>Low</span><span>Mid</span><span>High</span></div>
            <div className={styles.eqBands}><span className={styles.eqLow}>Kick · bass</span><span className={styles.eqMid}>Vocals · chords</span><span className={styles.eqHigh}>Hats · air</span></div>
            <Text type="supporting" color="secondary">Give each track a frequency home before you raise anything.</Text>
          </> : <>
            <div className={styles.phraseTrack}><span>Beat 1</span><span>4 bars · 16 beats</span><span>8 bars · 32 beats</span><span>Next phrase</span></div>
            <div className={styles.phraseMarkers}><i /><i /><i /><i /></div>
            <Text type="supporting" color="secondary">Launch the incoming track on beat one of a new phrase.</Text>
          </>}
        </div>
        {isEq ? <>
          <Heading level={2}>Three moves to remember</Heading>
          <Text as="p"><strong>Low:</strong> own the kick and bass. During a blend, decide which track carries the sub energy and trim the other.</Text>
          <Text as="p"><strong>Mid:</strong> make room for vocals, snares, and chords. If two parts fight, cut one before raising the other.</Text>
          <Text as="p"><strong>High:</strong> control hats and brightness. Small cuts prevent harshness when both tracks are busy.</Text>
          <Heading level={2}>A clean EQ hand-off</Heading>
          <Text as="p">Start flat, bring in the incoming track quietly, then trade the low end over one or two phrases. Return knobs toward center before the next transition.</Text>
        </> : <>
          <Heading level={2}>Count the structure</Heading>
          <Text as="p">A beat is one tap. Four beats make a bar. Most house and techno phrases are 4 or 8 bars—16 or 32 beats.</Text>
          <Heading level={2}>Core rules</Heading>
          <Text as="p"><strong>Watch the waveform:</strong> use new drums, breakdowns, and drops as visual phrase markers.</Text>
          <Text as="p"><strong>Hit beat one:</strong> launch the incoming track at the start of a new phrase in the playing track.</Text>
          <Text as="p"><strong>Intro to outro:</strong> bring the next intro in as the current track reaches its outro.</Text>
          <Text as="p"><strong>Correct with a loop:</strong> hold an 8-bar loop when an intro or outro ends too early.</Text>
        </>}
      </section>
    </>
  );
}

export default async function ReferencePage({
  params,
}: {
  params: Promise<{topic: string}>;
}) {
  const {topic} = await params;
  if (!isReferenceTopic(topic)) notFound();

  return (
    <PageFrame>
      <Stack direction="vertical" gap={6}>
        <PageBreadcrumbs items={[
          {label: 'Start Djing', href: '/'},
          {label: 'Reference', href: '/reference/beat-fx'},
          {label: TOPIC_LABELS[topic]},
        ]} />
        <ReferenceNav topic={topic} />
        {topic === 'beat-fx' ? <BeatFxReference /> : null}
        {topic === 'sound-color-fx' ? <SoundColorFxReference /> : null}
        {topic === 'eq-mixing' || topic === 'phrase-mixing' ? <QuickReference topic={topic} /> : null}
      </Stack>
    </PageFrame>
  );
}
