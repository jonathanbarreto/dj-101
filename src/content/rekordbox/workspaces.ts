import type {Behavior, Control} from '../types';

const lesson = (
  summary: string,
  detail: string,
  why: string,
  extras: Partial<Behavior> = {},
): Behavior => ({summary, detail, why, source: 'rekordbox7', ...extras});

export const rbLibraryControls: Control[] = [
  {
    id: 'rb-library-sources', surface: 'software', section: 'rb-sources',
    label: 'COLLECTION & SOURCES', kind: 'panel', at: {x: 0.065, y: 0.865},
    primary: lesson(
      'Chooses the library, playlist, device, or service you want to browse',
      'The source tree is the starting point for rekordbox library navigation. Expand Collection, Playlists, devices, histories, or supported streaming services, then select a source to populate the track list.',
      'Choose the source before searching or sorting. Narrowing the library first keeps results relevant and prevents a similarly named track in the wrong playlist or device from reaching a deck.',
      {gotcha: 'Selecting a source changes what the track list displays; it does not load a track to a deck.'},
    ),
  },
  {
    id: 'rb-library-palette', surface: 'software', section: 'rb-sources',
    label: 'PLAYLIST PALETTE', kind: 'panel', at: {x: 0.42, y: 0.742},
    primary: lesson(
      'Keeps frequently used playlists available while you browse',
      'The Playlist Palette provides quick-access playlist slots above the browser. Open it when you need to move between prepared crates without repeatedly navigating the full source tree.',
      'Use it for the playlists that define the current set: requests, warm-up, peak-time, recovery, or a short holding crate. A stable palette reduces browsing time while a track is running out.',
    ),
  },
  {
    id: 'rb-library-search', surface: 'software', section: 'rb-sources',
    label: 'TRACK SEARCH', kind: 'field', at: {x: 0.895, y: 0.775},
    primary: lesson(
      'Filters the current track list as you type',
      'Search works within the selected source and matches the searchable metadata shown by rekordbox. Clear the field to return to the complete source.',
      'Search after choosing the right playlist or collection branch. That two-step sequence is faster and safer than searching the entire library while preparing an urgent next track.',
      {tips: ['Search distinctive title or artist fragments instead of long exact phrases.']},
    ),
  },
  {
    id: 'rb-library-track-list', surface: 'software', section: 'rb-sources',
    label: 'TRACK LIST', kind: 'panel', at: {x: 0.49, y: 0.86},
    primary: lesson(
      'Shows the candidates available in the selected source',
      'The track list combines sortable metadata such as title, artist, BPM, key, rating, color, comments, and preview waveform. Selecting a row prepares it for preview or deck loading.',
      'Read the row as a decision surface rather than a filename list. BPM, key, comments, and waveform shape help eliminate bad candidates before they consume headphone time.',
      {gotcha: 'A highlighted row is selected in the browser, not necessarily loaded or playing.'},
    ),
  },
  {
    id: 'rb-library-preview', surface: 'software', section: 'rb-sources',
    label: 'PREVIEW WAVEFORM', kind: 'display', at: {x: 0.69, y: 0.86},
    primary: lesson(
      'Previews a track without committing it to a player deck',
      'The Preview column displays a compact waveform that can be auditioned from the browser. It provides a fast scan of energy changes, breaks, and arrangement before loading.',
      'Use preview to reject weak candidates while both decks remain occupied. It protects the current mix and reserves deck loading for tracks that already pass a quick musical check.',
    ),
  },
];

export const rbPerformanceControls: Control[] = [
  {
    id: 'rb-performance-fx', surface: 'software', section: 'rb-mixer',
    label: 'FX PANEL', kind: 'panel', at: {x: 0.16, y: 0.087},
    primary: lesson(
      'Opens and configures rekordbox performance effects',
      'The FX panel exposes effect selection, routing, timing, and wet/dry controls for the active Performance mode layout. Its state complements the physical Beat FX controls on the DDJ-1000.',
      'Prepare routing and depth before enabling an effect. The panel is most useful as confirmation that the intended deck or channel will be processed at the phrase boundary.',
      {gotcha: 'An effect can be configured correctly but routed to the wrong deck or channel.'},
    ),
  },
  {
    id: 'rb-performance-waveforms', surface: 'software', section: 'rb-mixer',
    label: 'STACKED WAVEFORMS', kind: 'display', at: {x: 0.58, y: 0.19},
    primary: lesson(
      'Compares beat alignment and upcoming phrase structure across decks',
      'The stacked enlarged waveforms move past a shared playhead and display beat-grid markers, cue markers, and the detailed audio shape for each loaded track.',
      'Use them to verify alignment and anticipate changes, then confirm the blend by ear. They are especially useful when a break, vocal entrance, or dense transient is approaching.',
      {gotcha: 'Aligned graphics cannot make two tracks phrase-compatible or repair an incorrect beat grid.'},
    ),
  },
  {
    id: 'rb-performance-deck-state', surface: 'software', section: 'rb-mixer',
    label: 'DECK STATE', kind: 'display', at: {x: 0.25, y: 0.29},
    primary: lesson(
      'Keeps timing, key, Sync, and loaded-track state visible together',
      'The player header combines the loaded track identity with original tempo and key, elapsed and remaining time, Key Sync, Beat Sync, and master-deck state.',
      'Check this strip before a transition. It answers the operational questions that matter immediately: what is loaded, how much time remains, and which deck is controlling synchronized playback.',
    ),
  },
  {
    id: 'rb-performance-stems', surface: 'software', section: 'rb-mixer',
    label: 'STEMS', kind: 'button', at: {x: 0.43, y: 0.39},
    primary: lesson(
      'Controls the vocal, instrumental, bass, and drum parts of a track',
      'The STEMS row exposes the active part controls for each deck. Depending on the selected mode, the buttons mute parts or isolate the chosen material.',
      'Use stems to create space deliberately: remove a vocal before layering another, preserve drums through a breakdown, or isolate an instrumental passage for a cleaner handoff.',
      {gotcha: 'Separation quality depends on the source; always audition exposed stems in headphones.'},
    ),
  },
  {
    id: 'rb-performance-mixer', surface: 'software', section: 'rb-mixer',
    label: 'MIXER', kind: 'panel', at: {x: 0.515, y: 0.44},
    primary: lesson(
      'Balances deck levels and routes the software mix',
      'The software mixer mirrors the essential channel path: input gain, EQ, channel level, cueing, and crossfader routing. Its meters expose level relationships even when the controller is the primary surface.',
      'Use it as a visual confirmation of gain structure and routing, not as a replacement for listening. A healthy mix keeps headroom while making the intended channel and cue states obvious.',
      {gotcha: 'Meter activity shows signal level, not whether the musical blend is balanced.'},
    ),
  },
  {
    id: 'rb-performance-sampler', surface: 'software', section: 'rb-mixer',
    label: 'SAMPLER', kind: 'panel', at: {x: 0.5, y: 0.63},
    primary: lesson(
      'Organizes and triggers samples outside the two player decks',
      'The Sampler panel provides slots for one-shots and loops with bank, playback, and level controls. Hardware performance pads can trigger the assigned slots when Sampler mode is active.',
      'Prepare samples before the set and keep their levels conservative. Use them for intentional accents or utility sounds, not as unplanned material that competes with the playing tracks.',
    ),
  },
  {
    id: 'rb-performance-record', surface: 'software', section: 'rb-mixer',
    label: 'RECORD PANEL', kind: 'panel', at: {x: 0.89, y: 0.555},
    primary: lesson(
      'Captures the rekordbox master output',
      'The Record panel controls mix recording and shows recording status and elapsed capture time. Confirm the destination and available storage before beginning a long session.',
      'Start recording before the first transition and verify that time is advancing. A short test capture catches routing or storage problems before they cost an entire set.',
      {gotcha: 'Recording availability and captured sources can depend on plan, source type, and service restrictions.'},
    ),
  },
];
