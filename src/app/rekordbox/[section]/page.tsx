import {notFound} from 'next/navigation';
import Link from 'next/link';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {SurfaceView} from '@/components/SurfaceView';
import {SECTIONS} from '@/content';
import type {SectionId} from '@/content/types';

export function generateStaticParams() {
  return Object.values(SECTIONS)
    .filter((section) => section.surface === 'software')
    .map((section) => ({section: section.id}));
}

export default async function RekordboxSectionPage({
  params,
}: {
  params: Promise<{section: string}>;
}) {
  const {section: requestedSection} = await params;
  const section = SECTIONS[requestedSection as SectionId];

  if (section === undefined || section.surface !== 'software') notFound();

  return (
    <main>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Link href="/rekordbox">← rekordbox 7</Link>
        <Text as="h1" type="display-1">{section.label}</Text>
        <SurfaceView surface="software" sectionId={section.id} />
      </Stack>
    </main>
  );
}
