import type {Behavior, Control} from '../types';

const rekordbox = (
  summary: string,
  detail: string,
  why: string,
  extras: Partial<Behavior> = {},
): Behavior => ({summary, detail, why, source: 'rekordbox7', ...extras});

/**
 * The 28 numbered elements in rekordbox 7's two-deck player panel.
 * Coordinates were measured against the clean 1200x634 Performance-mode
 * master through /dev/coords. The official 7.214 manual is authoritative for
 * behavior; the annotated screenshot is used only to identify the elements.
 */
export const rbDeckControls: Control[] = [
  {
    id: 'rb-deck-artwork', surface: 'software', section: 'rb-deck',
    label: 'ARTWORK', kind: 'display', at: {x: 0.0216, y: 0.2949},
    primary: rekordbox(
      'Identifies the loaded release at a glance',
      'The track information panel shows the file’s embedded artwork. Pointing at it reveals the unload action, which removes the track from this deck without deleting it from the collection.',
      'Use the cover as a fast visual checksum before you raise the fader, especially when two remixes have nearly identical titles. It can catch a wrong load faster than reading a clipped filename.',
      {gotcha: 'Unload removes the track from the deck; it does not remove the file or collection entry.'},
    ),
  },
  {
    id: 'rb-deck-title', surface: 'software', section: 'rb-deck',
    label: 'TRACK TITLE', kind: 'field', at: {x: 0.1013, y: 0.2838},
    primary: rekordbox(
      'Shows exactly which track is loaded',
      'The title comes from the track metadata stored in the rekordbox collection and remains visible above the full waveform while the deck is loaded.',
      'Read it before a blind cue or deck-layer switch: the hardware jog display has limited space, while the computer view exposes enough of a remix name to distinguish the radio edit from the extended mix.',
    ),
  },
  {
    id: 'rb-deck-artist', surface: 'software', section: 'rb-deck',
    label: 'ARTIST', kind: 'field', at: {x: 0.0589, y: 0.3048},
    primary: rekordbox(
      'Shows the credited artist for the loaded track',
      'The artist field appears directly below the title and is read from the collection metadata for the loaded file.',
      'Use it to confirm an unfamiliar collaboration or remix before announcing it, and to catch duplicate track titles by different artists that the controller display may truncate.',
    ),
  },
  {
    id: 'rb-deck-original-bpm', surface: 'software', section: 'rb-deck',
    label: 'ORIGINAL BPM', kind: 'field', at: {x: 0.1071, y: 0.3048},
    primary: rekordbox(
      'Keeps the analysed source tempo visible',
      'This field shows the track’s original analysed BPM. The live jog panel separately shows the current BPM and speed change after tempo or Sync adjustments.',
      'Compare original and current BPM before a large tempo move. Seeing that a 128 BPM track is being driven at 118 warns you to audition vocal and transient quality rather than trusting the fader position alone.',
      {gotcha: 'A wrong beat grid can make the analysed BPM misleading; verify suspicious half- or double-time values by ear.'},
    ),
  },
  {
    id: 'rb-deck-original-key', surface: 'software', section: 'rb-deck',
    label: 'ORIGINAL KEY', kind: 'field', at: {x: 0.1329, y: 0.3048},
    primary: rekordbox(
      'Shows the track key before live shifting',
      'The track information line displays the analysed original key. rekordbox can show musical or alphanumeric notation according to the Key display format preference.',
      'Keep this as your harmonic reference after using Key Sync or semitone shift. It tells you how far processing has moved the record and helps you reset before planning the next transition.',
    ),
  },
  {
    id: 'rb-deck-remaining-time', surface: 'software', section: 'rb-deck',
    label: 'REMAINING TIME', kind: 'display', at: {x: 0.3259, y: 0.3048},
    primary: rekordbox(
      'Counts down to the end of the track',
      'The negative time display reports how much playback time remains from the current position to the file’s end.',
      'Check it while handling a request or microphone break: unlike the waveform alone, the countdown tells you whether you have three minutes to browse or thirty seconds to make a safe transition.',
    ),
  },
  {
    id: 'rb-deck-elapsed-time', surface: 'software', section: 'rb-deck',
    label: 'ELAPSED TIME', kind: 'display', at: {x: 0.3579, y: 0.3048},
    primary: rekordbox(
      'Shows how long the track has played',
      'The elapsed counter runs forward from the start of the file and sits beside the remaining-time display.',
      'Use it to learn arrangement landmarks while practising. If a vocal break reliably begins near 2:35, elapsed time gives you a repeatable preparation cue even before you have stored markers.',
    ),
  },
  {
    id: 'rb-deck-key-sync', surface: 'software', section: 'rb-deck',
    label: 'KEY SYNC', kind: 'button', at: {x: 0.4049, y: 0.2838},
    primary: rekordbox(
      'Matches this deck to the master deck key',
      'KEY SYNC applies key shifting so the loaded track follows the sync master’s key. The adjacent key readout and semitone difference show the result rather than hiding the transformation.',
      'Use the screen after pressing hardware KEY SYNC to verify what actually changed. A compatible-looking result still deserves headphone checking when vocals or sustained bass notes make artifacts obvious.',
    ),
    counterpart: ['deck-left-key-sync'],
  },
  {
    id: 'rb-deck-key-shift', surface: 'software', section: 'rb-deck',
    label: 'KEY / SEMITONE SHIFT', kind: 'field', at: {x: 0.4057, y: 0.3048},
    primary: rekordbox(
      'Displays and adjusts the live key change',
      'The left and right arrows move the key down or up by one semitone. The key readout shows the current key, and the signed number shows its difference from the original; double-clicking the key resets it.',
      'Use this when a promising transition needs one deliberate semitone of correction. The numeric offset makes the intervention visible, so you can avoid stacking another shift later or forgetting to restore the source key.',
      {tips: ['Audition large shifts on vocals in headphones; technically compatible keys can still sound processed.']},
    ),
  },
  {
    id: 'rb-deck-beat-sync', surface: 'software', section: 'rb-deck',
    label: 'BEAT SYNC', kind: 'button', at: {x: 0.4434, y: 0.2844},
    primary: rekordbox(
      'Synchronizes tempo and beat position to the master deck',
      'BEAT SYNC follows the designated master deck using analysed BPM and beat-grid information. Its on-screen state confirms whether Sync is engaged even when your hands are away from the controller.',
      'Check this indicator when a synced blend begins drifting. If it is on, investigate the beat grid or live drums; if it is off, correct tempo and phase manually instead of blaming the analysis.',
      {gotcha: 'Sync aligns beats, not musical phrases, and it cannot repair an incorrectly analysed grid.'},
    ),
    counterpart: ['deck-left-beat-sync'],
  },
  {
    id: 'rb-deck-master', surface: 'software', section: 'rb-deck',
    label: 'MASTER', kind: 'button', at: {x: 0.4484, y: 0.3066},
    primary: rekordbox(
      'Designates the timing reference for synced decks',
      'MASTER makes this deck the master player for Beat Sync. On the DDJ-1000, hold SHIFT and press BEAT SYNC to select it; other synced decks then follow this deck’s tempo and grid.',
      'Use the highlighted on-screen state to verify which deck is steering the system before changing tempo. Moving the wrong deck’s fader while it is master can make every synced deck follow unexpectedly.',
    ),
    // The hardware schema links controls, not individual primary/SHIFT actions.
    // SHIFT + BEAT SYNC reaches this state, so both software Sync controls link
    // back to the same physical button.
    counterpart: ['deck-left-beat-sync'],
  },
  {
    id: 'rb-deck-hot-cue-marker', surface: 'software', section: 'rb-deck',
    label: 'HOT CUE MARKER', kind: 'display', at: {x: 0.1822, y: 0.3276},
    primary: rekordbox(
      'Marks saved hot cues across the full waveform',
      'Colored, lettered markers show Hot Cue positions on the track’s full waveform. The overview keeps distant cues visible even when the enlarged waveform is focused tightly around the playhead.',
      'Scan these markers before shortening an arrangement live. They reveal whether the next pad jump leads to a chorus, break, or outro and how much music lies between the current position and that destination.',
    ),
  },
  {
    id: 'rb-deck-cue-point-marker', surface: 'software', section: 'rb-deck',
    label: 'CUE POINT MARKER', kind: 'display', at: {x: 0.2057, y: 0.3270},
    primary: rekordbox(
      'Shows the current cue position on the track overview',
      'The full waveform displays the current cue position separately from colored Hot Cues and stored memory cues, giving the temporary deck cue a visible location in the arrangement.',
      'Use it to confirm that CUE will return to the intended first kick rather than an older preparation point. That visual check prevents repeated cue presses from jumping farther back than expected.',
    ),
  },
  {
    id: 'rb-deck-lighting-scenes', surface: 'software', section: 'rb-deck',
    label: 'PHRASE / LIGHTING SCENES', kind: 'display', at: {x: 0.2346, y: 0.3678},
    primary: rekordbox(
      'Maps phrase analysis and lighting scenes across the track',
      'The strip below the full waveform visualizes analysed phrase sections and the Lighting scenes assigned along the arrangement. It is an overview, not the audio waveform itself.',
      'Use the color and section changes to anticipate an approaching breakdown or chorus while your enlarged waveform is zoomed into individual beats. It adds arrangement context that the hardware platter cannot show at this scale.',
    ),
  },
  {
    id: 'rb-deck-stems', surface: 'software', section: 'rb-deck',
    label: 'MUTE · DRUMS · VOCAL · INST', kind: 'button', at: {x: 0.4249, y: 0.3919},
    primary: rekordbox(
      'Separates and mutes musical parts of the loaded track',
      'When the STEMS function is enabled, the panel displays MUTE or SOLO according to the ACTIVE STEM setting. In MUTE mode, each Stem button outputs its part when on and mutes it when off; SOLO mode selects all parts or one part to output.',
      'Use the screen to confirm which parts remain before opening a channel fader. Removing a vocal can create space for an acapella, while keeping drums preserves timing through a transition that would otherwise lose its rhythmic anchor.',
      {gotcha: 'Connecting the DDJ-1000 unlocks STEMS without a paid plan. Enable Preferences → Extensions → STEMS; separation quality still varies with the source material.'},
    ),
  },
  {
    id: 'rb-deck-performance-pad-toggle', surface: 'software', section: 'rb-deck',
    label: 'PERFORMANCE PAD PANEL', kind: 'button', at: {x: 0.0073, y: 0.4339},
    primary: rekordbox(
      'Switches the lower deck area to performance pads',
      'This panel button returns from GRID EDIT to the performance-pad view, where the selected pad mode and its eight software assignments are displayed.',
      'Open it before changing pad modes with a mouse or Pad Editor. The software assignments expose exactly what each physical pad will trigger, which is safer than learning the current bank by firing a pad on air.',
    ),
  },
  {
    id: 'rb-deck-grid-edit-toggle', surface: 'software', section: 'rb-deck',
    label: 'GRID EDIT PANEL', kind: 'button', at: {x: 0.0073, y: 0.4993},
    primary: rekordbox(
      'Replaces the pads with beat-grid editing tools',
      'This button opens GRID EDIT in the lower deck panel. Returning to the performance-pad button restores the pad and JOG panels.',
      'Use GRID EDIT during preparation when downbeats drift or land between waveform transients. Correcting the visible grid here makes Quantize, loops, Beat Sync, and beat-count displays trustworthy on the hardware later.',
      {gotcha: 'Grid editing changes the timing map used by several performance features; verify the first beat and tempo before saving broad corrections.'},
    ),
  },
  {
    id: 'rb-deck-performance-pads', surface: 'software', section: 'rb-deck',
    label: 'PERFORMANCE PADS', kind: 'pad', at: {x: 0.1475, y: 0.4617},
    primary: rekordbox(
      'Shows the eight assignments for the active pad mode',
      'The software pad grid displays the current mode’s eight actions and saved content. In HOT CUE mode, filled pads call saved cues while empty pads can store the current position; other modes replace those assignments.',
      'Read the labels and colors before reaching for the hardware pads. The screen reveals cue names, times, and empty slots that the unlabelled rubber grid cannot, making an unfamiliar track far safer to perform.',
      {tips: ['The on-screen mode menu also exposes rekordbox modes that may require Pad Editor mapping on the DDJ-1000.']},
    ),
    counterpart: [
      'deck-left-hot-cue', 'deck-left-pad-fx-1', 'deck-left-beat-jump',
      'deck-left-sampler', 'deck-left-pad-grid',
    ],
  },
  {
    id: 'rb-deck-auto-loop', surface: 'software', section: 'rb-deck',
    label: 'AUTO BEAT LOOP', kind: 'button', at: {x: 0.3394, y: 0.4277},
    primary: rekordbox(
      'Starts a loop with the displayed beat length',
      'In AU mode, the numbered loop button creates an Auto Beat Loop of that many beats, aligned from the current position according to the deck’s timing and Quantize state.',
      'Use the displayed number as a preflight check before looping an exposed vocal. It prevents expecting four beats and accidentally trapping one beat because a previous performance left a shorter length selected.',
    ),
    counterpart: ['deck-left-loop-exit'],
  },
  {
    id: 'rb-deck-loop-length', surface: 'software', section: 'rb-deck',
    label: 'LOOP LENGTH ◄ ►', kind: 'button', at: {x: 0.3398, y: 0.4629},
    primary: rekordbox(
      'Shortens or lengthens the selected automatic loop',
      'The left and right controls reduce or increase the Auto Beat Loop length shown above them. They select the length used by the on-screen auto-loop action.',
      'Set the length visually before the phrase arrives, then use the hardware half/double controls during the loop. The screen removes doubt about whether the next press will produce one, two, four, or eight beats.',
    ),
    counterpart: ['deck-left-loop-in', 'deck-left-loop-out'],
  },
  {
    id: 'rb-deck-loop-mode', surface: 'software', section: 'rb-deck',
    label: 'AU / MA LOOP MODE', kind: 'switch', at: {x: 0.3394, y: 0.4907},
    primary: rekordbox(
      'Switches between automatic and manual loop controls',
      'AU and MA switch the controls shown in rekordbox’s on-screen JOG panel. AU presents Auto Beat Loop; MA presents mouse controls for real-time loop-in, loop-out, exit, and reloop. This view switch does not remap the DDJ-1000 loop buttons.',
      'Choose MA when placing a loop boundary with the mouse by ear, or AU for a grid-counted loop. Treat it as an on-screen workspace choice rather than a new hardware layer.',
    ),
  },
  {
    id: 'rb-deck-dvs-mode', surface: 'software', section: 'rb-deck',
    label: 'INT / ABS / REL', kind: 'menu', at: {x: 0.3725, y: 0.4221},
    primary: rekordbox(
      'Selects how a DVS timecode source controls the deck',
      'INT ignores timecode and plays internally. ABS maps the physical record position directly to the track, while REL follows timecode movement without binding playback to the needle’s absolute position.',
      'Use the visible mode to diagnose a DVS deck before touching the record: INT explains why timecode does nothing, ABS suits traditional needle-position control, and REL preserves modern jumps such as Hot Cues.',
      {
        tier: 'subscription',
        gotcha: 'The DDJ-1000 unlocks Performance control but not rekordbox DVS; a supported DVS plan and compatible timecode setup are still required.',
      },
    ),
  },
  {
    id: 'rb-deck-cue', surface: 'software', section: 'rb-deck',
    label: 'CUE', kind: 'button', at: {x: 0.3725, y: 0.4555},
    primary: rekordbox(
      'Sets or temporarily plays from the current cue',
      'When paused, CUE sets the cue at the current position. Holding it continues playback; releasing returns to that cue, matching the core deck cue workflow.',
      'Watch the on-screen cue marker after setting it from hardware. The visible position confirms that repeated cue taps will audition the intended transient rather than an older point hidden elsewhere in the arrangement.',
    ),
    counterpart: ['deck-left-cue'],
  },
  {
    id: 'rb-deck-play-pause', surface: 'software', section: 'rb-deck',
    label: 'PLAY / PAUSE', kind: 'button', at: {x: 0.3725, y: 0.5024},
    primary: rekordbox(
      'Starts or pauses this software deck',
      'The play control changes the deck between playing and paused states. Its state and the moving jog indicator provide an on-screen confirmation of transport.',
      'Use the animation as a quick check after switching the physical left side between decks 1 and 3. It shows which software deck actually received your press before you touch a channel fader.',
    ),
    counterpart: ['deck-left-play-pause'],
  },
  {
    id: 'rb-deck-jog-tempo', surface: 'software', section: 'rb-deck',
    label: 'JOG · BPM · PITCH', kind: 'display', at: {x: 0.4172, y: 0.4672},
    primary: rekordbox(
      'Combines platter position with live tempo and pitch readouts',
      'The software jog shows playback movement and cue/slip information. Its center reports current BPM and playback-speed percentage; mouse controls can change BPM or bend pitch, and the tempo range appears around the panel.',
      'Use this readout to quantify what your hands changed on the controller. A drifting mix may show the correct BPM but a phase problem needing a jog nudge, or a large pitch percentage that calls for a gentler track choice.',
      {gotcha: 'Current BPM is not the same as the original analysed BPM shown in the track information line.'},
    ),
    counterpart: ['deck-left-jog-dial', 'deck-left-tempo-slider'],
  },
  {
    id: 'rb-deck-slip', surface: 'software', section: 'rb-deck',
    label: 'SLIP', kind: 'button', at: {x: 0.4584, y: 0.4203},
    primary: rekordbox(
      'Shows whether slip performance is armed',
      'With SLIP on, the track continues advancing silently underneath compatible scratches, loops, reverse moves, and cue jumps, then resumes at the uninterrupted timeline position.',
      'Check the screen before attempting a risky fill. The lit state confirms the safety net is active even if the hardware button is partly hidden by your hand or the booth lighting is poor.',
    ),
    counterpart: ['deck-left-slip'],
  },
  {
    id: 'rb-deck-quantize', surface: 'software', section: 'rb-deck',
    label: 'Q — QUANTIZE', kind: 'button', at: {x: 0.4584, y: 0.4493},
    primary: rekordbox(
      'Shows whether performance actions snap to the beat grid',
      'Quantize automatically places loop points, Hot Cues, and Cues according to the analysed beat position instead of preserving every small timing error in the button press.',
      'Use the blue Q state as a warning as well as reassurance: it makes pad timing cleaner on a good grid, but an incorrect grid will pull an otherwise accurate finger press to the wrong place.',
    ),
    counterpart: ['deck-left-quantize'],
  },
  {
    id: 'rb-deck-master-tempo', surface: 'software', section: 'rb-deck',
    label: 'MT — MASTER TEMPO', kind: 'button', at: {x: 0.4584, y: 0.5105},
    primary: rekordbox(
      'Locks pitch while playback speed changes',
      'MASTER TEMPO changes playback speed without changing pitch. If the track key has been shifted, this control becomes KEY RESET so the live key can be restored.',
      'Watch this state before making a large BPM move on a vocal track. The screen tells you whether the singer’s key will stay fixed and exposes the KEY RESET state that a hardware label cannot change dynamically.',
    ),
    counterpart: ['deck-left-master-tempo', 'deck-left-key-reset'],
  },
];
