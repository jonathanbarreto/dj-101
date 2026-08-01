import {notFound} from 'next/navigation';
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
import {
  specifications,
  specificationGroups,
  type IoPort,
  type SpecificationRow,
} from '@/content/reference/specs';
import styles from './ReferencePage.module.css';

const TOPICS = ['beat-fx', 'sound-color-fx', 'specs'] as const;
type ReferenceTopic = (typeof TOPICS)[number];

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

const specificationColumns: TableColumn<SpecificationRow>[] = [
  {key: 'specification', header: 'Specification', width: proportional(1, {minWidth: 190})},
  {key: 'value', header: 'Value', width: proportional(2, {minWidth: 280})},
  {key: 'note', header: 'What it means', width: proportional(2, {minWidth: 260})},
];

const ioColumns: TableColumn<IoPort>[] = [
  {key: 'name', header: 'Connection', width: proportional(2, {minWidth: 260})},
  {key: 'count', header: 'Sets', width: pixel(80)},
  {key: 'location', header: 'Panel', width: pixel(100)},
  {key: 'note', header: 'Use', width: proportional(2, {minWidth: 260})},
];

function isReferenceTopic(topic: string): topic is ReferenceTopic {
  return TOPICS.includes(topic as ReferenceTopic);
}

export function generateStaticParams() {
  return TOPICS.map((topic) => ({topic}));
}

function ReferenceNav() {
  return (
    <Stack direction="horizontal" gap={3} wrap="wrap" as="nav">
      <Link href="/">Home</Link>
      <Link href="/reference/beat-fx">Beat FX</Link>
      <Link href="/reference/sound-color-fx">Sound Color FX</Link>
      <Link href="/reference/specs">Specifications</Link>
    </Stack>
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
          <Table
            data={rows}
            columns={beatFxColumns}
            idKey="name"
            density="balanced"
            dividers="rows"
            verticalAlign="top"
            textOverflow="wrap"
            isStriped
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
            NOISE, the COLOR knob moves the filter while PARAMETER controls the
            generated noise level.
          </Text>
          <Table
            data={soundColorFx}
            columns={soundColorFxColumns}
            idKey="name"
            density="balanced"
            dividers="rows"
            verticalAlign="top"
            textOverflow="wrap"
            isStriped
          />
        </Stack>
      </section>
    </>
  );
}

function SpecificationsReference() {
  return (
    <>
      <ReferenceIntro title="DDJ-1000 specifications">
        The practical hardware limits, audio figures, level ranges, and every
        physical audio or computer connection in one place.
      </ReferenceIntro>
      <aside className={styles.callout} aria-label="Bit-depth clarification">
        <Stack direction="vertical" gap={1}>
          <Heading level={2}>What “32-bit” means here</Heading>
          <Text as="p">{specifications.bitDepthCorrection}</Text>
        </Stack>
      </aside>
      {specificationGroups.map((group) => (
        <section
          key={group.title}
          className={styles.tableSection}
          aria-labelledby={`spec-${group.title.toLowerCase().replaceAll(' ', '-')}`}>
          <Stack direction="vertical" gap={3}>
            <Heading
              level={2}
              id={`spec-${group.title.toLowerCase().replaceAll(' ', '-')}`}>
              {group.title}
            </Heading>
            <Table
              data={group.rows}
              columns={specificationColumns}
              idKey="specification"
              density="balanced"
              dividers="rows"
              verticalAlign="top"
              textOverflow="wrap"
            />
          </Stack>
        </section>
      ))}
      <section className={styles.tableSection} aria-labelledby="spec-connections">
        <Stack direction="vertical" gap={3}>
          <Heading level={2} id="spec-connections">Inputs and outputs</Heading>
          <Text as="p">
            “Sets” follows the manual: one stereo RCA pair counts as one set.
            USB A/B labels on the panel are two USB-B computer terminals.
          </Text>
          <Table
            data={[...specifications.io]}
            columns={ioColumns}
            idKey="name"
            density="balanced"
            dividers="rows"
            verticalAlign="top"
            textOverflow="wrap"
          />
        </Stack>
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
    <main className={styles.page}>
      <Stack direction="vertical" gap={6}>
        <ReferenceNav />
        {topic === 'beat-fx' ? <BeatFxReference /> : null}
        {topic === 'sound-color-fx' ? <SoundColorFxReference /> : null}
        {topic === 'specs' ? <SpecificationsReference /> : null}
      </Stack>
    </main>
  );
}
