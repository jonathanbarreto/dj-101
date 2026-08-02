import {notFound} from 'next/navigation';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import type {Metadata} from 'next';
import {List, ListItem} from '@astryxdesign/core/List';
import {SurfaceView} from '@/components/SurfaceView';
import {ConnectionLessons} from '@/components/ConnectionLessons';
import {PageBreadcrumbs} from '@/components/PageBreadcrumbs';
import {PageFrame} from '@/components/PageFrame';
import {CONNECTION_PANELS, SECTIONS} from '@/content';
import type {ConnectionPanel} from '@/content/hardware/connections';
import type {SectionId} from '@/content/types';
import {controlsInSection} from '@/content';

const PATH_ORDER: SectionId[] = ['deck-left', 'deck-right', 'mixer', 'fx', 'browser'];

function sectionFlowSuggestions(currentSection: SectionId): SectionId[] {
  const currentIndex = PATH_ORDER.indexOf(currentSection);
  if (currentIndex === -1) return PATH_ORDER;

  const next = PATH_ORDER[(currentIndex + 1) % PATH_ORDER.length];
  const previous = PATH_ORDER[(currentIndex - 1 + PATH_ORDER.length) % PATH_ORDER.length];
  return [next, previous];
}

export function generateStaticParams() {
  const imageSections = Object.values(SECTIONS)
    .filter((section) => section.surface === 'hardware')
    .map((section) => ({section: section.id}));
  const connectionPanels = Object.values(CONNECTION_PANELS)
    .map((panel) => ({section: panel.id}));
  return [...imageSections, ...connectionPanels];
}

export async function generateMetadata({params}: {params: Promise<{section: string}>}): Promise<Metadata> {
  const {section: requestedSection} = await params;
  const connectionPanel = Object.hasOwn(CONNECTION_PANELS, requestedSection)
    ? CONNECTION_PANELS[requestedSection as ConnectionPanel]
    : undefined;
  const section = Object.hasOwn(SECTIONS, requestedSection)
    ? SECTIONS[requestedSection as SectionId]
    : undefined;
  const label = connectionPanel?.label ?? section?.label;
  if (!label) return {};
  const description = `Learn the DDJ-1000 ${label.toLowerCase()} with precise controls, practical use cases, and setup guidance.`;
  const url = `/controller/${requestedSection}`;
  return {
    title: label,
    description,
    alternates: {canonical: url},
    openGraph: {
      type: 'article',
      siteName: 'Start Djing',
      title: `${label} — DDJ-1000`,
      description,
      url,
    },
  };
}

export default async function ControllerSectionPage({
  params,
}: {
  params: Promise<{section: string}>;
}) {
  const {section: requestedSection} = await params;
  const connectionPanel = Object.hasOwn(CONNECTION_PANELS, requestedSection)
    ? CONNECTION_PANELS[requestedSection as ConnectionPanel]
    : undefined;
  const section = Object.hasOwn(SECTIONS, requestedSection)
    ? SECTIONS[requestedSection as SectionId]
    : undefined;

  if (connectionPanel === undefined && (section === undefined || section.surface !== 'hardware')) {
    notFound();
  }

  const sectionSuggestions = section !== undefined
    ? sectionFlowSuggestions(section.id)
      .map((id) => SECTIONS[id])
      .filter((candidate) => controlsInSection(candidate.id).length > 0)
      .map((candidate) => ({
        id: candidate.id,
        label: candidate.label,
        description: candidate.id === section!.id
          ? 'Keep this section and finish one complete transition flow before moving on.'
          : `Move here after ${section.label.toLowerCase()} feels stable.`,
      }))
    : [];

  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        {connectionPanel ? (
          <>
            <PageBreadcrumbs items={[
              {label: 'Start Djing', href: '/'},
              {label: 'Controller', href: '/controller'},
              {label: connectionPanel.label},
            ]} />
            <ConnectionLessons panel={connectionPanel.id} />
            <div>
              <Text type="label" color="accent">Next step</Text>
              <Text as="p" color="secondary">
                Once setup is stable, continue by entering the control flow sections.
              </Text>
            </div>
            <List hasDividers density="spacious" aria-label="Suggested next controller pages">
              <ListItem
                href="/controller/deck-left"
                label="Left deck"
                description="Practice transport, hot cues, and phrase decisions together."
              />
              <ListItem
                href="/controller/mixer"
                label="Mixer"
                description="Build consistent gain, EQ, and routing habits before effects."
              />
            </List>
          </>
        ) : (
          <>
            <PageBreadcrumbs items={[
              {label: 'Start Djing', href: '/'},
              {label: 'Controller', href: '/controller'},
              {label: section!.label},
            ]} />
            <SurfaceView surface="hardware" sectionId={section!.id} />
            <Text as="h1" type="display-1">{section!.label}</Text>
            <div>
              <Text type="label" color="accent">Transition goal</Text>
              <Text as="p" color="secondary">
                Stay here until one short two-bar phrase feels reliable, then move to the next section.
              </Text>
            </div>
            {sectionSuggestions.length > 0 && (
              <List hasDividers density="compact" aria-label="Continue your controller path">
                {sectionSuggestions.map((candidate) => (
                  <ListItem
                    key={candidate.id}
                    href={`/controller/${candidate.id}`}
                    label={candidate.label}
                    description={candidate.description}
                  />
                ))}
              </List>
            )}
          </>
        )}
      </Stack>
    </PageFrame>
  );
}
