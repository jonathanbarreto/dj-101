import type {Metadata} from 'next';
import {SurfaceView} from '@/components/SurfaceView';
import {PageFrame} from '@/components/PageFrame';

export const metadata: Metadata = {
  title: 'Pioneer DJ DDJ-1000',
  description: 'Explore every taught section of the DDJ-1000, from both decks and the four-channel mixer to effects, browsing, and connections.',
  alternates: {canonical: '/controller'},
  openGraph: {
    type: 'website',
    siteName: 'Start Djing',
    title: 'Pioneer DJ DDJ-1000',
    description: 'Explore every taught section of the DDJ-1000, from both decks and the four-channel mixer to effects, browsing, and connections.',
    url: '/controller',
  },
};

export default function ControllerPage() {
  return (
    <PageFrame>
      <SurfaceView surface="hardware" />
    </PageFrame>
  );
}
