/** A non-canonical detail view used to clarify a control group.
 *
 * Detail assets never replace a surface master image. They are deliberately
 * keyed by lesson area so a learner can inspect the physical layout without
 * changing the coordinate space used by hotspots.
 */
export interface SupplementalAsset {
  id: string;
  src: `/images/details/${string}`;
  alt: string;
  label: string;
  caption: string;
  width: number;
  height: number;
}

export const DETAIL_ASSETS: Record<string, SupplementalAsset[]> = {
  'deck-left': [{
    id: 'deck-left-detail',
    src: '/images/details/deck-left-detail.png',
    alt: 'Close view of the DDJ-1000 left deck, jog display, transport, pad modes, pads, and tempo slider',
    label: 'Left deck at a glance',
    caption: 'Use the jog display for state, the transport buttons to move audio, and the pad row for performance actions.',
    width: 932,
    height: 1336,
  }],
  'deck-right': [{
    id: 'ddj1000-overview',
    src: '/images/details/ddj1000-overview.png',
    alt: 'DDJ-1000 top view with both decks and the central mixer visible',
    label: 'Two decks, one mixer',
    caption: 'The mirrored deck layout makes techniques portable: the right side uses the same controls as the left.',
    width: 2034,
    height: 1072,
  }],
  mixer: [
    {
      id: 'mixer-detail',
      src: '/images/details/mixer-detail.png',
      alt: 'DDJ-1000 mixer close-up showing four channel strips, meters, faders, and crossfader assign',
      label: 'Four-channel mixer',
      caption: 'Channels 1–4 share the same trim, EQ, color, cue, fader, and crossfader-assign pattern.',
      width: 828,
      height: 1334,
    },
    {
      id: 'channel-strip-detail',
      src: '/images/details/channel-strip-detail.png',
      alt: 'One DDJ-1000 channel strip showing input selector, trim, EQ, color, cue, volume fader, and crossfader assign',
      label: 'One channel, repeated four times',
      caption: 'Learn one strip deeply, then apply the same signal path to channels 1, 2, 3, and 4.',
      width: 194,
      height: 1608,
    },
  ],
  fx: [{
    id: 'beat-fx-detail',
    src: '/images/details/beat-fx-detail.png',
    alt: 'DDJ-1000 Beat FX section showing effect selector, channel selector, level depth, and on off button',
    label: 'Beat FX signal path',
    caption: 'Choose the effect, route it to a channel, set the beat timing, then raise LEVEL/DEPTH and switch it on.',
    width: 278,
    height: 1444,
  }],
  rear: [{
    id: 'rear-panel',
    src: '/images/details/rear-panel.png',
    alt: 'DDJ-1000 rear panel showing master, booth, channel, USB, microphone, and power connections',
    label: 'Rear-panel connections',
    caption: 'Trace each socket to the mixer control that governs its signal before powering up.',
    width: 2096,
    height: 312,
  }],
  front: [{
    id: 'front-panel',
    src: '/images/details/front-panel.png',
    alt: 'DDJ-1000 front edge showing the 1/4 inch and 3.5 millimeter headphone sockets',
    label: 'Two headphone sockets, one cue bus',
    caption: 'The two plug sizes feed the same headphone mix and level controls.',
    width: 2098,
    height: 824,
  }],
  'rb-deck': [{
    id: 'rekordbox-performance',
    src: '/images/details/rekordbox-performance.png',
    alt: 'rekordbox 7 Performance mode showing waveforms, dual player decks, mixer, browser, and performance controls',
    label: 'rekordbox 7 Performance mode',
    caption: 'This screen is the software counterpart to the controller: learn where deck state, waveforms, mixer levels, and browser actions meet.',
    width: 2940,
    height: 1842,
  }],
};

export function detailAssetsForLesson(lessonId: string): SupplementalAsset[] {
  return DETAIL_ASSETS[lessonId] ?? [];
}
