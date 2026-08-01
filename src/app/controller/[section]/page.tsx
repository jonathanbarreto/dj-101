import {notFound} from 'next/navigation';
import {Link} from '@astryxdesign/core/Link';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {SurfaceView} from '@/components/SurfaceView';
import {ConnectionLessons} from '@/components/ConnectionLessons';
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

export default async function ControllerSectionPage({
  params,
}: {
  params: Promise<{section: string}>;
}) {
  const {section: requestedSection} = await params;
  const connectionPanel = CONNECTION_PANELS[requestedSection as ConnectionPanel];
  const section = SECTIONS[requestedSection as SectionId];

  if (connectionPanel === undefined && (section === undefined || section.surface !== 'hardware')) {
    notFound();
  }

  return (
    <main>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Link href="/controller" isStandalone>← The controller</Link>
        {connectionPanel ? (
          <ConnectionLessons panel={connectionPanel.id} />
        ) : (
          <>
            <Text as="h1" type="display-1">{section!.label}</Text>
            <SurfaceView surface="hardware" sectionId={section!.id} />
          </>
        )}
      </Stack>
    </main>
  );
}
