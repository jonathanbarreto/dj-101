export interface TutorialVideo {
  id: string;
  src: `/videos/tutorials/${string}`;
  title: string;
  description: string;
  lesson: string;
}

const VIDEO_ROOT = '/videos/tutorials/' as const;

export const TUTORIAL_VIDEOS: TutorialVideo[] = [
  {
    id: 'cue-scope',
    src: `${VIDEO_ROOT}DDJ-1000-Tutorial-Cue-Scope_Media_8UR-hYVESzQ_001_1080p.mp4`,
    title: 'Cue scope',
    description: 'See how cueing lets you preview a track privately before bringing it into the room mix.',
    lesson: 'deck-left',
  },
  {
    id: 'search-and-skip',
    src: `${VIDEO_ROOT}DDJ-1000-Tutorial-Search-and-Skip-Modes_Media_DKm2Hj6RwKw_001_1080p.mp4`,
    title: 'Search and skip modes',
    description: 'A practical look at moving through a track quickly with the search controls and SHIFT layer.',
    lesson: 'deck-left',
  },
  {
    id: 'key-sync-shift',
    src: `${VIDEO_ROOT}DDJ-1000-Tutorial-Key-Sync-Key-Shift-and_Media_pRuuNv-Uu0w_001_1080p.mp4`,
    title: 'Key Sync and Key Shift',
    description: 'Learn when to preserve a track’s musical key and when a small shift makes a blend fit.',
    lesson: 'rb-deck',
  },
  {
    id: 'beat-fx',
    src: `${VIDEO_ROOT}DDJ-1000-Tutorial-New-Beat-FX_Media_mk3WAHdH2n4_001_1080p.mp4`,
    title: 'Beat FX in context',
    description: 'Hear the Beat FX workflow: choose the effect, route it, set timing, then bring in depth deliberately.',
    lesson: 'fx',
  },
  {
    id: 'beat-grids',
    src: `${VIDEO_ROOT}DDJ-1000-Tutorial-Adjusting-Beat-Grids_Media_7Zf9w5ulFc0_001_1080p.mp4`,
    title: 'Adjusting beat grids',
    description: 'See how an accurate grid keeps quantize, loops, and beat-synced effects musically aligned.',
    lesson: 'rb-deck',
  },
];

export function tutorialVideosForLesson(lessonId: string): TutorialVideo[] {
  return TUTORIAL_VIDEOS.filter((video) => video.lesson === lessonId);
}
