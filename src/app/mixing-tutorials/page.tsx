'use client';

import {useState} from 'react';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Center} from '@astryxdesign/core/Center';
import {Grid} from '@astryxdesign/core/Grid';
import {Section} from '@astryxdesign/core/Section';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Heading, Text} from '@astryxdesign/core/Text';
import {VStack} from '@astryxdesign/core/Layout';
import {PageFrame} from '@/components/PageFrame';
import styles from './page.module.css';

type Filter = 'all' | 'playlist' | 'standalone';

interface MixingVideo {
  id: string;
  title: string;
  description: string;
  category: Exclude<Filter, 'all'>;
}

const MIXING_VIDEOS: MixingVideo[] = [
  {id: 'rpiKaf9DIDI', title: 'Mixing tutorial 01', description: 'A mixing lesson from the supplied YouTube playlist.', category: 'playlist'},
  {id: 'h0VQEEj--_U', title: 'Mixing tutorial 02', description: 'A standalone mixing lesson for the library.', category: 'standalone'},
  {id: 'RlVtyYqga-c', title: 'Mixing tutorial 03', description: 'A standalone mixing lesson for the library.', category: 'standalone'},
  {id: '22XjZKJS69E', title: 'Mixing tutorial 04', description: 'A standalone mixing lesson for the library.', category: 'standalone'},
  {id: 'DRnYmuxv6Gs', title: 'Mixing tutorial 05', description: 'A mixing lesson from the supplied YouTube playlist.', category: 'playlist'},
  {id: 'feH8dwYoRkQ', title: 'Mixing tutorial 06', description: 'A standalone mixing lesson for the library.', category: 'standalone'},
  {id: 'nhrHoaDzmp0', title: 'Mixing tutorial 07', description: 'A standalone mixing lesson for the library.', category: 'standalone'},
];

export default function MixingTutorialsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const videos = filter === 'all'
    ? MIXING_VIDEOS
    : MIXING_VIDEOS.filter((video) => video.category === filter);

  return (
    <PageFrame>
      <div className={styles.page}>
        <Center axis="horizontal">
          <VStack gap={8} style={{maxWidth: 1200, width: '100%', paddingInline: 'var(--spacing-6)', paddingBlock: 'var(--spacing-8)'}}>
            <Center axis="horizontal">
              <Section variant="transparent" maxWidth={680} padding={0}>
                <VStack gap={4} hAlign="center" style={{textAlign: 'center'}}>
                  <VStack gap={2} hAlign="center">
                    <Text type="label" color="accent">DJ-101 video library</Text>
                    <Heading level={1}>Mixing Tutorials</Heading>
                    <Text type="body" color="secondary">
                      A focused watch list for building better transitions. Open a lesson here,
                      then return to the controller and rekordbox maps to apply it.
                    </Text>
                  </VStack>
                  <TabList value={filter} onChange={(value) => setFilter(value as Filter)} aria-label="Filter mixing tutorials">
                    <Tab value="all" label="All" />
                    <Tab value="playlist" label="Playlist lessons" />
                    <Tab value="standalone" label="Standalone lessons" />
                  </TabList>
                </VStack>
              </Section>
            </Center>

            <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
              {videos.map((video) => (
                <article className={styles.videoCard} key={video.id}>
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      className={styles.embed}
                      src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0`}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </AspectRatio>
                  <div className={styles.copy}>
                    <Text className={styles.videoTitle}>{video.title}</Text>
                    <Text type="supporting" color="secondary">{video.description}</Text>
                  </div>
                </article>
              ))}
            </Grid>
          </VStack>
        </Center>
      </div>
    </PageFrame>
  );
}
