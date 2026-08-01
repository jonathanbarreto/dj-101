import {notFound} from 'next/navigation';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import type {Metadata} from 'next';
import {SurfaceView} from '@/components/SurfaceView';
import {ConnectionLessons} from '@/components/ConnectionLessons';
import {PageBreadcrumbs} from '@/components/PageBreadcrumbs';
import {PageFrame} from '@/components/PageFrame';
import {CONNECTION_PANELS, SECTIONS} from '@/content';
import type {ConnectionPanel} from '@/content/hardware/connections';
import type {SectionId} from '@/content/types';

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
      siteName: 'dj-101',
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

  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        {connectionPanel ? (
          <>
            <PageBreadcrumbs items={[
              {label: 'dj-101', href: '/'},
              {label: 'Controller', href: '/controller'},
              {label: connectionPanel.label},
            ]} />
            <ConnectionLessons panel={connectionPanel.id} />
          </>
        ) : (
          <>
            <Text as="h1" type="display-1">{section!.label}</Text>
            <SurfaceView surface="hardware" sectionId={section!.id} />
          </>
        )}
      </Stack>
    </PageFrame>
  );
}
