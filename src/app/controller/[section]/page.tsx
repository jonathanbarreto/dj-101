import {notFound} from 'next/navigation';
import Link from 'next/link';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {SurfaceView} from '@/components/SurfaceView';
import {ConnectionLessons} from '@/components/ConnectionLessons';
import {SECTIONS} from '@/content';
import type {SectionId} from '@/content/types';

export function generateStaticParams() {
  return Object.values(SECTIONS)
    .filter((section) => section.surface === 'hardware')
    .map((section) => ({section: section.id}));
}

export default async function ControllerSectionPage({
  params,
}: {
  params: Promise<{section: string}>;
}) {
  const {section: requestedSection} = await params;
  const section = SECTIONS[requestedSection as SectionId];

  if (section === undefined || section.surface !== 'hardware') notFound();

  const isConnectionLesson = section.id === 'rear' || section.id === 'front';

  return (
    <main>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Link href="/controller">← The controller</Link>
        {isConnectionLesson ? (
          <ConnectionLessons panel={section.id === 'rear' ? 'rear' : 'front'} />
        ) : (
          <>
            <Text as="h1" type="display-1">{section.label}</Text>
            <SurfaceView surface="hardware" sectionId={section.id} />
          </>
        )}
      </Stack>
    </main>
  );
}
