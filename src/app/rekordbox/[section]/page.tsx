import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import {SurfaceView} from '@/components/SurfaceView';
import {PageBreadcrumbs} from '@/components/PageBreadcrumbs';
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
  const section = SECTIONS[requestedSection as SectionId];
  return section?.surface === 'software'
    ? {
        title: `${section.label} in rekordbox 7`,
        description: `Learn the rekordbox 7 ${section.label.toLowerCase()} and its DDJ-1000 hardware counterparts.`,
        alternates: {canonical: `/rekordbox/${requestedSection}`},
      }
    : {};
}

export default async function RekordboxSectionPage({
  params,
}: {
  params: Promise<{section: string}>;
}) {
  const {section: requestedSection} = await params;
  const section = SECTIONS[requestedSection as SectionId];

  if (
    section === undefined
    || section.surface !== 'software'
    || controlsInSection(section.id).length === 0
  ) notFound();

  return (
    <PageFrame>
      <Stack direction="vertical" gap={4} xstyle={undefined}>
        <PageBreadcrumbs items={[
          {label: 'dj-101', href: '/'},
          {label: 'rekordbox 7', href: '/rekordbox'},
          {label: section.label},
        ]} />
        <Text as="h1" type="display-1">{section.label}</Text>
        <SurfaceView surface="software" sectionId={section.id} />
      </Stack>
    </PageFrame>
  );
}
