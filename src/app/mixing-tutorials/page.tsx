'use client';

import {useMemo, useState} from 'react';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {Center} from '@astryxdesign/core/Center';
import {DropdownMenu} from '@astryxdesign/core/DropdownMenu';
import {Grid} from '@astryxdesign/core/Grid';
import {Section} from '@astryxdesign/core/Section';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Heading, Text} from '@astryxdesign/core/Text';
import {ToggleButton, ToggleButtonGroup} from '@astryxdesign/core/ToggleButton';
import {VStack} from '@astryxdesign/core/Layout';
import {HStack} from '@astryxdesign/core/Stack';
import {PageFrame} from '@/components/PageFrame';
import styles from './page.module.css';

type Filter = 'all' | 'basics' | 'transitions' | 'performance';

interface MixingVideo {
  id: string;
  title: string;
  description: string;
  category: Exclude<Filter, 'all'>;
  categoryLabel: string;
  duration: string;
}

const MIXING_VIDEOS: MixingVideo[] = [
  {id: 'rpiKaf9DIDI', title: '5 Ways to Mix Between Genres', description: 'Learn advanced transitions that help you move between styles while protecting phrasing and energy.', category: 'transitions', categoryLabel: 'Transitions', duration: '9:09'},
  {id: 'h0VQEEj--_U', title: 'The 5 Levels of House Mixing', description: 'Progress from beginner blends to pro house transitions by controlling phrase length, EQ, and momentum.', category: 'basics', categoryLabel: 'Mixing basics', duration: '9:26'},
  {id: 'RlVtyYqga-c', title: 'How to Mix Techno Like a Pro', description: 'Build a techno blend in real time and learn how to manage long phrases, low end, and tension.', category: 'transitions', categoryLabel: 'Transitions', duration: '21:32'},
  {id: '22XjZKJS69E', title: '3 Ways to Mix Techno', description: 'Compare three practical techno transitions and when each one makes sense in a set.', category: 'transitions', categoryLabel: 'Transitions', duration: '11:25'},
  {id: 'DRnYmuxv6Gs', title: 'Tech House Set Mixing Techniques', description: 'Follow a complete tech-house performance and see how transitions are chosen and shaped.', category: 'transitions', categoryLabel: 'Transitions', duration: '14:11'},
  {id: 'feH8dwYoRkQ', title: 'Transitions for Techno, Trance & Hard House', description: 'Collect reliable transition patterns for driving, high-energy genres without losing the beat.', category: 'transitions', categoryLabel: 'Transitions', duration: '14:17'},
  {id: 'nhrHoaDzmp0', title: 'DJ EQ Explained Simply', description: 'Learn what the high, mid, and low EQ knobs actually change and how to use them during a blend.', category: 'basics', categoryLabel: 'Mixing basics · EQing', duration: '23:46'},
  {id: '23Xcgc_9eZQ', title: '5 Ways to Mix in Key', description: 'Learn same-key, adjacent-key, power-block, mashup, and energy-lift ideas for more musical transitions.', category: 'basics', categoryLabel: 'Mixing basics', duration: '22:14'},
  {id: 'j9Ky8zpsqvY', title: 'Looping Techniques That Change Your Mixes', description: 'Use loops with intention to extend phrases, create tension, and make transitions feel more controlled.', category: 'basics', categoryLabel: 'Mixing basics · Looping', duration: '7:36'},
  {id: 'znNKYw0nKII', title: 'Creative DJ Sets on the DDJ-1000', description: 'Explore performance techniques that turn the DDJ-1000 into a more expressive instrument.', category: 'performance', categoryLabel: 'Performance', duration: '10:33'},
  {id: 'Kn_1BSsz4Vw', title: 'Phrasing Can Make or Break a DJ Set', description: 'Learn how musical phrases are structured and where to bring in, blend, and exit a track so transitions feel natural.', category: 'basics', categoryLabel: 'Mixing basics · Phrasing', duration: '9:24'},
];

export default function MixingTutorialsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Newest'>('Newest');
  const videos = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = MIXING_VIDEOS.filter((video) => {
      const matchesFilter = filter === 'all' || video.category === filter;
      const matchesSearch = !query || `${video.title} ${video.description}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
    return [...filtered].sort((a, b) => sortOrder === 'A-Z'
      ? a.title.localeCompare(b.title)
      : MIXING_VIDEOS.indexOf(a) - MIXING_VIDEOS.indexOf(b));
  }, [filter, search, sortOrder]);

  return (
    <PageFrame>
      <div className={styles.page}>
        <Center axis="horizontal">
          <VStack gap={8} style={{maxWidth: 1200, width: '100%', paddingInline: 'var(--spacing-6)', paddingBlock: 'var(--spacing-8)'}}>
            <Center axis="horizontal">
              <Section variant="transparent" maxWidth={680} padding={0}>
                <VStack gap={4} hAlign="center" style={{textAlign: 'center'}}>
                  <VStack gap={2} hAlign="center">
                    <Text type="label" color="accent">Mixed · video library</Text>
                    <Heading level={1}>Mixing Tutorials</Heading>
                    <Text type="body" color="secondary">
                      Search by technique, filter by collection, and build a watch path that fits your next practice session.
                    </Text>
                  </VStack>
                </VStack>
              </Section>
            </Center>

            <VStack gap={4}>
              <TextInput
                label="Search tutorials"
                isLabelHidden
                placeholder="Search by technique or genre..."
                value={search}
                onChange={setSearch}
                hasClear
                size="lg"
              />
              <HStack vAlign="center" gap={4} className={styles.filterRow}>
                <ToggleButtonGroup
                  label="Filter mixing tutorials"
                  value={filter}
                  onChange={(value) => setFilter((value ?? 'all') as Filter)}
                  size="lg"
                >
                  <ToggleButton value="all" label="All" />
                  <ToggleButton value="basics" label="Mixing basics" />
                  <ToggleButton value="transitions" label="Transitions" />
                  <ToggleButton value="performance" label="Performance" />
                </ToggleButtonGroup>
                <DropdownMenu
                  button={{label: sortOrder, size: 'lg'}}
                  items={[
                    {label: 'Newest', onClick: () => setSortOrder('Newest')},
                    {label: 'A–Z', onClick: () => setSortOrder('A-Z')},
                  ]}
                />
              </HStack>
              <Text type="supporting" color="secondary">{videos.length} {videos.length === 1 ? 'lesson' : 'lessons'}</Text>
            </VStack>

            {videos.length === 0 ? (
              <Center>
                <Text type="supporting" color="secondary">No tutorials match that search. Try a genre, technique, or clear the filters.</Text>
              </Center>
            ) : <Grid columns={{minWidth: 280, repeat: 'fit'}} gap={4}>
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
                    <Text type="label" color="accent">{video.categoryLabel}</Text>
                    <Text className={styles.videoTitle}>{video.title}</Text>
                    <Text type="supporting" color="secondary">{video.description}</Text>
                    <Text type="supporting" color="secondary">{video.duration} · YouTube lesson</Text>
                  </div>
                </article>
              ))}
            </Grid>}
          </VStack>
        </Center>
      </div>
    </PageFrame>
  );
}
