import type {Behavior, Control} from '../types';

const manual = (
  summary: string,
  detail: string,
  why: string,
  extras: Partial<Behavior> = {},
): Behavior => ({summary, detail, why, source: 'manual', ...extras});

export const browserSectionIntro =
  'The same Browser cluster appears beside each deck. Use the cluster on the side whose operated deck should receive the track, and confirm that deck number before loading.';

export const browserControls: Control[] = [
  {
    id: 'browser-rotary-selector',
    ref: 53,
    surface: 'hardware',
    section: 'browser',
    label: 'ROTARY SELECTOR',
    kind: 'knob',
    at: {x: 0.3070, y: 0.0935},
    primary: manual(
      'Browses the library, enters lists, and loads the chosen track',
      'Turn the selector to move the cursor. Press with a track selected to load it to the deck operated by that side. Press with a folder or playlist selected to move focus from the tree to the track list, or to the Playlist Palette when it is visible. Double-press to use Instant Doubles: rekordbox loads the track from the non-operated layer deck into the operated deck with its playback position unchanged.',
      'Browse and load from the controller when you need to keep your eyes and cueing hand near the decks. Instant Doubles is useful when a track already playing on the other layer must be copied at the same moment so you can hand its original channel to another source or build a controlled two-deck effect.',
      {
        gotcha:
          'There is no separate LOAD button. Before a single or double-press, verify the jog-display deck number so the selection does not replace the wrong prepared track.',
      },
    ),
    shift: manual(
      'Changes the enlarged waveform zoom',
      'Hold SHIFT and turn right to enlarge the rekordbox enlarged waveform; turn left to reduce it. This changes how much time the waveform shows around the playhead.',
      'Zoom in when aligning a transient or checking a tight loop boundary, then zoom out when you need to see the next phrase approaching. It changes the view only, so your track position and beat grid stay untouched.',
      {gotcha: 'Waveform zoom is not jog movement or beat-grid adjustment.'},
    ),
  },
  {
    id: 'browser-back',
    ref: 54,
    surface: 'hardware',
    section: 'browser',
    label: 'BACK',
    shiftLegend: 'PLAYLIST PALETTE',
    kind: 'button',
    at: {x: 0.2905, y: 0.1515},
    primary: manual(
      'Moves browser focus back toward the collection tree',
      'Press BACK to move focus between the collection tree and the track list, including the Playlist Palette when it is shown. When the cursor is on a folder in the tree, BACK closes that folder.',
      'Use it after scanning tracks in a playlist to return to Sources and choose a different crate without touching the laptop. Closing an expanded folder also shortens a crowded tree before the next search.',
      {gotcha: 'BACK is not browser history and it does not unload the track already on a deck.'},
    ),
    shift: manual(
      'Shows or hides the Playlist Palette',
      'Hold SHIFT and press BACK to show or hide the Playlist Palette in rekordbox.',
      'Open the palette when comparing several prepared playlists during a request-heavy set; hide it when you want the track list to reclaim the screen width for titles, keys, and comments.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'browser-view',
    ref: 55,
    surface: 'hardware',
    section: 'browser',
    label: 'VIEW',
    shiftLegend: 'RELATED TRACKS',
    kind: 'button',
    at: {x: 0.3160, y: 0.1515},
    primary: manual(
      'Trades deck space for browsing and manages the Tag List',
      'A short press reduces the deck display and expands the browser; repeat the short press to restore the deck display. Press and hold VIEW to add the selected track to the Tag List, or remove it when it is already there.',
      'Expand the browser when similar titles or long remix names are hard to distinguish. Hold to collect promising tracks in the temporary Tag List while auditioning, so you can compare them before committing one to the next deck.',
      {gotcha: 'The Tag List is a temporary working list, not a track metadata tag editor.'},
    ),
    shift: manual(
      'Moves the browser cursor to Related Tracks',
      'Hold SHIFT and press VIEW to move the cursor to the Related Tracks list in rekordbox.',
      'Use Related Tracks when the current record suggests a direction but the next choice is not prepared. Treat the results as candidates to audition in headphones, not as a decision made for you.',
      {
        source: 'rekordbox7',
        gotcha:
          'Related Tracks does not automatically load a track or guarantee a harmonic match; its active criteria determine what rekordbox suggests.',
      },
    ),
  },
];
