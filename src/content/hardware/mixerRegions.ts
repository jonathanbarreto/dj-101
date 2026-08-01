import type {Rect} from '../types';
import {mixerControls, MIXER_CHANNEL_ORDER} from './mixer';
import {hardwareFxControls} from './fx';

export type MixerRegionId =
  | 'signal' | 'channel-3' | 'channel-1' | 'channel-2' | 'channel-4'
  | 'color-fx' | 'outputs' | 'monitoring' | 'mic';

export interface MixerRegion {
  id: MixerRegionId;
  label: string;
  controlIds: string[];
  rect: Rect;
  narrowRect: Rect;
}

const channelRegion = (channel: number): MixerRegion => ({
  id: `channel-${channel}` as MixerRegionId,
  label: `CH${channel}`,
  controlIds: mixerControls
    .filter((control) => control.id.startsWith(`mixer-ch${channel}-`))
    .map(({id}) => id),
  rect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
  narrowRect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
});

const mixerLessonControls = [
  ...mixerControls,
  ...hardwareFxControls.filter(({section}) => section === 'mixer'),
];

const ids = (...refs: number[]) => mixerLessonControls
  .filter((control) => refs.includes(control.ref ?? -1))
  .map(({id}) => id);

export const MIXER_REGIONS: MixerRegion[] = [
  {
    id: 'signal', label: 'Signal path', controlIds: [],
    rect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
    narrowRect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
  },
  ...MIXER_CHANNEL_ORDER.map(channelRegion),
  {
    id: 'color-fx', label: 'Color FX', controlIds: ids(20),
    rect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
    narrowRect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
  },
  {
    id: 'outputs', label: 'Outputs', controlIds: ids(1, 12, 13, 14, 15),
    rect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
    narrowRect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
  },
  {
    id: 'monitoring', label: 'Headphones + sampler', controlIds: ids(16, 17, 18, 19),
    rect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
    narrowRect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
  },
  {
    id: 'mic', label: 'Mic', controlIds: [
      'mixer-mic-mode', 'mixer-mic1-level', 'mixer-mic2-level',
      'mixer-mic-high', 'mixer-mic-low',
    ],
    rect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
    narrowRect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956},
  },
];

export function getMixerRegion(id: MixerRegionId): MixerRegion {
  const region = MIXER_REGIONS.find((candidate) => candidate.id === id);
  if (!region) throw new Error(`Unknown mixer region: ${id}`);
  return region;
}

export function getMixerRegionForControl(controlId: string): MixerRegion | undefined {
  return MIXER_REGIONS.find((region) => region.controlIds.includes(controlId));
}

export function getMixerVisualRect(id: MixerRegionId, narrow: boolean): Rect {
  const region = getMixerRegion(id);
  return narrow ? region.narrowRect : region.rect;
}
