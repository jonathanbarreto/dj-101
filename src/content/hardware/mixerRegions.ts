import type {Rect} from '../types';
import {mixerControls, MIXER_CHANNEL_ORDER} from './mixer';

export type MixerRegionId =
  | 'signal' | 'channel-3' | 'channel-1' | 'channel-2' | 'channel-4'
  | 'outputs' | 'monitoring' | 'mic';

export interface MixerRegion {
  id: MixerRegionId;
  label: string;
  controlIds: string[];
  rect: Rect;
  narrowRect: Rect;
}

const channelRegion = (channel: number, x: number): MixerRegion => ({
  id: `channel-${channel}` as MixerRegionId,
  label: `CH${channel}`,
  controlIds: mixerControls
    .filter((control) => control.id.startsWith(`mixer-ch${channel}-`))
    .map(({id}) => id),
  rect: {x: x - 0.029, y: 0.045, w: 0.061, h: 0.835},
  narrowRect: {x: x - 0.031, y: 0.045, w: 0.065, h: 0.835},
});

const ids = (...refs: number[]) => mixerControls
  .filter((control) => refs.includes(control.ref ?? -1))
  .map(({id}) => id);

export const MIXER_REGIONS: MixerRegion[] = [
  {
    id: 'signal', label: 'Signal path', controlIds: [],
    rect: {x: 0.332, y: 0.022, w: 0.296, h: 0.956},
    narrowRect: {x: 0.350, y: 0.040, w: 0.258, h: 0.900},
  },
  ...MIXER_CHANNEL_ORDER.map((channel) => {
    const x = mixerControls.find((control) => control.id === `mixer-ch${channel}-trim`)!.at.x;
    return channelRegion(channel, x);
  }),
  {
    id: 'outputs', label: 'Outputs', controlIds: ids(1, 12, 13, 14, 15),
    rect: {x: 0.465, y: 0.045, w: 0.179, h: 0.918},
    narrowRect: {x: 0.465, y: 0.045, w: 0.179, h: 0.918},
  },
  {
    id: 'monitoring', label: 'Headphones + sampler', controlIds: ids(16, 17, 18, 19),
    rect: {x: 0.343, y: 0.545, w: 0.058, h: 0.335},
    narrowRect: {x: 0.341, y: 0.545, w: 0.063, h: 0.335},
  },
  {
    id: 'mic', label: 'Mic', controlIds: ids(21, 22, 23, 24, 25),
    rect: {x: 0.343, y: 0.045, w: 0.058, h: 0.390},
    narrowRect: {x: 0.341, y: 0.045, w: 0.063, h: 0.390},
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
