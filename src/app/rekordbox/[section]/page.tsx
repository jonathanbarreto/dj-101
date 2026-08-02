import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {SurfaceView} from '@/components/SurfaceView';
import {PageFrame} from '@/components/PageFrame';
import {controlsInSection, SECTIONS} from '@/content';
import type {SectionId} from '@/content/types';

export function generateStaticParams() {
  return Object.values(SECTIONS)
    .filter((section) => section.surface === 'software' && controlsInSection(section.id).length > 0)
    .map((section) => ({section: section.id}));
}

export async function generateMetadata({params}: {params: Promise<{section: string}>}): Promise<Metadata> {
  const {section: requestedSection} = await params;
  const section = Object.hasOwn(SECTIONS, requestedSection)
    ? SECTIONS[requestedSection as SectionId]
    : undefined;
  if (section?.surface !== 'software') return {};
  const title = `${section.label} in rekordbox 7`;
  const description = `Learn the rekordbox 7 ${section.label.toLowerCase()} and its DDJ-1000 hardware counterparts.`;
  const url = `/rekordbox/${requestedSection}`;
  return {
    title,
    description,
    alternates: {canonical: url},
    openGraph: {type: 'article', siteName: 'Start Djing', title, description, url},
  };
}

export default async function RekordboxSectionPage({
  params,
}: {
  params: Promise<{section: string}>;
}) {
  const {section: requestedSection} = await params;
  const section = Object.hasOwn(SECTIONS, requestedSection)
    ? SECTIONS[requestedSection as SectionId]
    : undefined;

  if (
    section === undefined
    || section.surface !== 'software'
    || controlsInSection(section.id).length === 0
  ) notFound();

  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <Text as="h1" type="display-1">{section.label}</Text>
        <SurfaceView surface="software" sectionId={section.id} />
      </Stack>
    </PageFrame>
  );
}
