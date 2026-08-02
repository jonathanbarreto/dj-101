import {describe, expect, it} from 'vitest';
import {TUTORIAL_VIDEOS, tutorialVideosForLesson} from '../videos';

describe('tutorial videos', () => {
  it('keeps every shipped tutorial local and accessible', () => {
    expect(TUTORIAL_VIDEOS).toHaveLength(5);
    for (const video of TUTORIAL_VIDEOS) {
      expect(video.src).toMatch(/^\/videos\/tutorials\/.*\.mp4$/);
      expect(video.title.length).toBeGreaterThan(4);
      expect(video.description.length).toBeGreaterThan(40);
    }
  });

  it('maps videos to the section where a learner needs them', () => {
    expect(tutorialVideosForLesson('fx').map((video) => video.id)).toEqual(['beat-fx']);
    expect(tutorialVideosForLesson('rb-deck').map((video) => video.id)).toEqual(['key-sync-shift', 'beat-grids']);
    expect(tutorialVideosForLesson('mixer')).toEqual([]);
  });
});
