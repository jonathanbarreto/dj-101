import {List, ListItem} from '@astryxdesign/core/List';
import {Stack} from '@astryxdesign/core/Stack';
import {Table, pixel, proportional, type TableColumn} from '@astryxdesign/core/Table';
import {Heading, Text} from '@astryxdesign/core/Text';
import {
  connectionsForPanel,
  connectionSafetyWarning,
  dualUsbChangeoverSteps,
  dualUsbSignalFlow,
  setupRecipes,
  shutdownOrder,
  type ConnectionLesson,
  type ConnectionPanel,
} from '@/content/hardware/connections';
import styles from './ConnectionLessons.module.css';

interface ConnectionRow extends Record<string, unknown> {
  id: string;
  reference: string;
  connection: string;
  format: string;
  control: string;
  use: string;
  setupAndRecovery: string;
  safety: string;
}

const connectionColumns: TableColumn<ConnectionRow>[] = [
  {key: 'reference', header: 'Ref', width: pixel(64)},
  {key: 'connection', header: 'Connection', width: proportional(1, {minWidth: 190})},
  {key: 'format', header: 'Connector / signal', width: proportional(2, {minWidth: 260})},
  {key: 'control', header: 'What governs it', width: proportional(2, {minWidth: 260})},
  {key: 'use', header: 'Why you use it', width: proportional(3, {minWidth: 320})},
  {key: 'setupAndRecovery', header: 'Set up / if it sounds wrong', width: proportional(3, {minWidth: 360})},
  {key: 'safety', header: 'Safety', width: proportional(2, {minWidth: 280})},
];

function lessonRows(lessons: ConnectionLesson[]): ConnectionRow[] {
  return lessons.map((lesson) => ({
    id: lesson.id,
    reference: lesson.ref === undefined ? '—' : String(lesson.ref),
    connection: lesson.label,
    format: `${lesson.connector}. ${lesson.balance}.`,
    control: lesson.governedBy,
    use: lesson.why,
    setupAndRecovery: `${lesson.setup} If it sounds wrong: ${lesson.failure}`,
    safety: lesson.safety,
  }));
}

function ConnectionInventory({panel}: {panel: ConnectionPanel}) {
  const lessons = connectionsForPanel(panel);
  const title = panel === 'rear' ? 'Rear connection inventory' : 'Front connection inventory';

  return (
    <section aria-labelledby={`${panel}-inventory-heading`}>
      <Stack direction="vertical" gap={3}>
        <Heading level={2} id={`${panel}-inventory-heading`}>{title}</Heading>
        <Text as="p">
          Read each row from the physical socket to the top-panel control that
          governs it. “Ref” follows the structural numbering used by this guide;
          the Kensington slot and cord hook are real parts but are unnumbered.
        </Text>
        <div className={styles.desktopInventory}>
          <Table
            aria-label={title}
            data={lessonRows(lessons)}
            columns={connectionColumns}
            idKey="id"
            density="balanced"
            dividers="rows"
            verticalAlign="top"
            textOverflow="wrap"
            isStriped
          />
        </div>
        <div className={styles.mobileInventory}>
          <List hasDividers density="spacious" header={<Text type="label">{title}</Text>}>
            {lessons.map((lesson) => (
              <ListItem
                key={lesson.id}
                label={`${lesson.ref === undefined ? 'Unnumbered' : `Ref ${lesson.ref}`} · ${lesson.label}`}
                description={(
                  <Stack direction="vertical" gap={2} className={styles.lessonDetail}>
                    <Text as="p"><strong>Connector:</strong> {lesson.connector}. {lesson.balance}.</Text>
                    <Text as="p"><strong>Controlled by:</strong> {lesson.governedBy}.</Text>
                    <Text as="p"><strong>Why:</strong> {lesson.why}</Text>
                    <Text as="p"><strong>Set up:</strong> {lesson.setup}</Text>
                    <Text as="p"><strong>If it sounds wrong:</strong> {lesson.failure}</Text>
                    <Text as="p"><strong>Safety:</strong> {lesson.safety}</Text>
                  </Stack>
                )}
              />
            ))}
          </List>
        </div>
      </Stack>
    </section>
  );
}

function RearLessons() {
  return (
    <>
      <ConnectionInventory panel="rear" />
      <section aria-labelledby="dual-usb-heading">
        <Stack direction="vertical" gap={3}>
          <Heading level={2} id="dual-usb-heading">Dual-computer changeover</Heading>
          <aside className={styles.callout} aria-label="Dual USB learner model">
            <Stack direction="vertical" gap={1}>
              <Heading level={3}>What dual USB actually changes</Heading>
              <Text as="p">
                This is a learner model of signal routing, not a promise that
                tracks, deck state, cue points, or a rekordbox session transfer
                between computers. Each channel selector simply chooses which
                connected computer feeds that hardware strip.
              </Text>
            </Stack>
          </aside>
          <List
            listStyle="decimal"
            hasDividers
            header={<Text type="label">Signal flow learner model</Text>}
          >
            {dualUsbSignalFlow.map((step) => (
              <ListItem key={step.label} label={step.label} description={step.description} />
            ))}
          </List>
          <List
            listStyle="decimal"
            hasDividers
            aria-label="Safe seven-step handoff"
            header={<Text type="label">Safe seven-step handoff</Text>}
          >
            {dualUsbChangeoverSteps.map((step, index) => (
              <ListItem key={step} label={`Step ${index + 1}`} description={step} />
            ))}
          </List>
        </Stack>
      </section>
      <section aria-labelledby="recipes-heading">
        <Stack direction="vertical" gap={3}>
          <Heading level={2} id="recipes-heading">Beginner setup recipes</Heading>
          <Text as="p">
            Pick the smallest recipe that matches the equipment in front of you,
            then keep every downstream level low until the signal path is verified.
          </Text>
          <List hasDividers density="spacious">
            {setupRecipes.map((recipe) => (
              <ListItem
                key={recipe.name}
                label={<Heading level={3}>{recipe.name}</Heading>}
                description={(
                  <Stack direction="vertical" gap={2}>
                    <Text as="p">{recipe.goal}</Text>
                    <List listStyle="decimal">
                      {recipe.steps.map((step) => <ListItem key={step} label={step} />)}
                    </List>
                  </Stack>
                )}
              />
            ))}
          </List>
        </Stack>
      </section>
      <section aria-labelledby="shutdown-heading">
        <Stack direction="vertical" gap={3}>
          <Heading level={2} id="shutdown-heading">Speaker-safe shutdown order</Heading>
          <List listStyle="decimal" hasDividers>
            {shutdownOrder.map((step) => <ListItem key={step} label={step} />)}
          </List>
        </Stack>
      </section>
    </>
  );
}

function FrontLessons() {
  return (
    <>
      <aside className={styles.callout} aria-label="One headphone bus">
        <Stack direction="vertical" gap={1}>
          <Heading level={2}>One cue mix, two plug sizes</Heading>
          <Text as="p">
            Both sockets carry the same cue mix from the same headphone bus.
            They are two physical ways to hear one HEADPHONES MIXING and LEVEL
            setting—not independent outputs for two DJs.
          </Text>
        </Stack>
      </aside>
      <ConnectionInventory panel="front" />
    </>
  );
}

export function ConnectionLessons({panel}: {panel: ConnectionPanel}) {
  const isRear = panel === 'rear';
  return (
    <Stack direction="vertical" gap={5}>
      <div className={styles.intro}>
        <Stack direction="vertical" gap={2}>
          <Text type="label" color="accent">DDJ-1000 connection lesson</Text>
          <Heading level={1} type="display-2">
            {isRear ? 'Rear connections' : 'Front headphones'}
          </Heading>
          <Text type="large" as="p" textWrap="pretty">
            {isRear
              ? 'Build the signal path from each cable inward: match the source level, select the right channel path, then gain-stage toward the outputs.'
              : 'Choose the socket that fits your headphones, then build a safe cue mix before raising its level.'}
          </Text>
        </Stack>
      </div>
      <aside className={styles.callout} role="note" aria-label="Connection safety">
        <Stack direction="vertical" gap={1}>
          <Heading level={2}>Power down before recabling</Heading>
          <Text as="p">{connectionSafetyWarning}</Text>
        </Stack>
      </aside>
      {isRear ? <RearLessons /> : <FrontLessons />}
    </Stack>
  );
}
