import type {Behavior, Control} from '../types';

const manual = (summary: string, detail: string, why: string, extras: Partial<Behavior> = {}): Behavior => ({
  summary,
  detail,
  why,
  source: 'manual',
  ...extras,
});

/**
 * This deck lesson covers canonical controls 32–52. Canonical references
 * 53–55 are the Browser rotary selector, BACK, and VIEW, so they belong to
 * the Browser area rather than this deck lesson.
 * The right deck derives these Behavior objects in right-deck.ts so the
 * shared controls stay word-for-word consistent without duplicating prose.
 */
export const deckControls: Control[] = [
  {
    id: 'deck-left-jog-dial', ref: 43, surface: 'hardware', section: 'deck-left',
    label: 'JOG DIAL', shiftLegend: 'GRID ADJUST', kind: 'jog', at: {x: 0.1115, y: 0.4392},
    counterpart: ['rb-deck-jog-tempo'],
    primary: manual(
      'Scratches from the top and bends pitch from the rim',
      'With VINYL mode on, touching the jog top stops the track and lets you move it like a record. Turning the outer ring bends pitch; with VINYL off, the top also pitch-bends. The centre display shows deck and playback information.',
      'Nudge the rim when two kick drums are drifting during a long blend: a tiny clockwise push catches the incoming beat without changing its tempo setting. Use the top only when you deliberately want a scratch or a brake.',
    ),
    shift: manual(
      'Edits the beat grid from the jog',
      'Hold SHIFT and turn the jog top to adjust the grid BPM; turn the outer ring to slide the whole beat grid earlier or later without changing its BPM.',
      'Use this after importing a track whose first downbeat is visibly off in rekordbox. Slide the grid until the kick lands on beat one before trusting Quantize, Sync, or a four-beat loop in front of a crowd.',
      {tips: ['Correct the grid while the deck is in headphones, not while it is carrying the room.']},
    ),
  },
  {
    id: 'deck-left-quantize', ref: 41, surface: 'hardware', section: 'deck-left',
    label: 'QUANTIZE', kind: 'button', at: {x: 0.2176, y: 0.0794},
    counterpart: ['rb-deck-quantize'],
    primary: manual(
      'Snaps performance actions to the beat grid',
      'Press QUANTIZE during normal use to toggle rekordbox Quantize on or off. When enabled, it aligns actions such as setting or triggering hot cues and loops to the nearest beat in the rekordbox beat grid rather than firing them at the exact instant you press. On the left deck only, pressing this same button while the unit is in standby wakes the controller; WAKE UP is not a SHIFT command.',
      'Turn it on when you are punching a vocal hot cue over a four-on-the-floor track: a slightly early finger press still lands on the next beat instead of making the vocal flam against the kick.',
      {gotcha: 'The standby wake-up action belongs only to the left QUANTIZE button and requires an ordinary press, not SHIFT.'},
    ),
  },
  {
    id: 'deck-left-slip', ref: 42, surface: 'hardware', section: 'deck-left',
    label: 'SLIP', shiftLegend: 'VINYL', kind: 'button', at: {x: 0.2475, y: 0.0794},
    counterpart: ['rb-deck-slip'],
    primary: manual(
      'Keeps the track running underneath your performance move',
      'With slip on, playback continues silently while you scratch, loop, reverse, or trigger hot cues. When the move ends, audio jumps to the point the track would have reached if you had done nothing.',
      'Slip lets you scratch through the last bar before a chorus, then release exactly onto the chorus downbeat. Without it, you would be stranded at the scratch point and have to repair the timing audibly.',
      {tips: ['The jog display background turns red while slip is active.']},
    ),
    shift: manual(
      'Toggles vinyl mode for the jog top surface',
      'With VINYL mode on, touching the jog top stops playback and scratches like touching a record. With it off, the top behaves like the rim and only bends pitch.',
      'Turn vinyl mode off for a long, relaxed blend if you keep brushing the platter, then turn it back on before a scratch or spin-back. That avoids an accidental stop at the busiest point in the track.',
      {gotcha: 'There is no dedicated VINYL button on the DDJ-1000; its grey legend lives under SLIP.'},
    ),
  },
  {
    id: 'deck-left-jog-feeling-adjust', ref: 44, surface: 'hardware', section: 'deck-left',
    label: 'JOG ADJUST', kind: 'knob', at: {x: 0.3098, y: 0.2169},
    primary: manual(
      'Sets how lightly or heavily the jog platter turns',
      'JOG FEELING ADJUST changes the mechanical resistance of the jog from LIGHT to HEAVY; it does not change track tempo, pitch range, or scratch audio.',
      'Set it heavier before practising slow release scratches so the platter does not coast farther than your hand expects. Set it lighter if you need quick rim nudges during a dense two-deck mix.',
    ),
  },
  {
    id: 'deck-left-beat-sync', ref: 45, surface: 'hardware', section: 'deck-left',
    label: 'BEAT SYNC', shiftLegend: 'MASTER', kind: 'button', at: {x: 0.3066, y: 0.5692},
    counterpart: ['rb-deck-beat-sync', 'rb-deck-master'],
    primary: manual(
      'Matches this deck to the current master deck',
      'BEAT SYNC synchronizes this deck’s tempo and beat grid to the master deck. It relies on the track analysis and beat grids in rekordbox being correct.',
      'Use it to bring a third deck in under an acapella while both hands are busy with EQ and faders. You still listen for phrase placement; Sync locks beats, not whether a new chorus belongs over the old one.',
    ),
    shift: manual(
      'Makes this deck the sync master',
      'Holding SHIFT and pressing BEAT SYNC sets this deck as the master source that other synced decks follow.',
      'Make the deck with the live drummer or the most trustworthy grid master before synchronizing a house track to it. That keeps the stable musical reference in charge instead of making it chase a less reliable deck.',
    ),
  },
  {
    id: 'deck-left-master-tempo', ref: 47, surface: 'hardware', section: 'deck-left',
    label: 'MASTER TEMPO', shiftLegend: 'TEMPO RANGE', kind: 'button', at: {x: 0.2708, y: 0.6963},
    counterpart: ['rb-deck-master-tempo'],
    primary: manual(
      'Locks musical key while tempo changes',
      'MASTER TEMPO keeps the track key from changing as the tempo slider moves. It is rekordbox key lock, so a tempo change need not make vocals sound higher or lower.',
      'Leave it on when moving an R&B vocal from 100 to 104 BPM for a house transition; the singer stays in the intended key while you make the tempo fit.',
    ),
    shift: manual(
      'Cycles the tempo fader range',
      'Holding SHIFT and pressing MASTER TEMPO cycles the tempo range through ±6, ±10, ±16, and WIDE, changing how much BPM movement the same fader travel represents.',
      'Choose ±6 for a close beatmatch where every millimetre matters, then choose a wider range only when you intentionally need a large BPM move for a genre change.',
    ),
  },
  {
    id: 'deck-left-tempo-slider', ref: 46, surface: 'hardware', section: 'deck-left',
    label: 'TEMPO', kind: 'fader', at: {x: 0.2977, y: 0.7991},
    counterpart: ['rb-deck-jog-tempo'],
    primary: manual(
      'Changes playback speed with a full-length pitch fader',
      'The 100 mm TEMPO slider changes the selected deck’s playback speed within the current tempo range. Its centre position is the track’s analysed BPM.',
      'Ride this fader when beatmatching by ear: make a small change, listen to whether the kicks drift apart more slowly, then nudge with the jog instead of making a dramatic correction mid-phrase.',
    ),
  },
  {
    id: 'deck-left-hot-cue', ref: 50, surface: 'hardware', section: 'deck-left',
    label: 'HOT CUE', shiftLegend: 'KEYBOARD', kind: 'button', at: {x: 0.1017, y: 0.6962},
    counterpart: ['rb-deck-performance-pads'],
    primary: manual(
      'Puts the pads into hot-cue mode',
      'HOT CUE makes the performance pads set and recall hot cues. Use PAGE to reach the second bank, giving the deck up to sixteen pad-addressable hot cues.',
      'Mark an intro, first vocal, drop, and clean outro before the set so you can jump to a usable section when a request arrives late instead of scrubbing through a waveform under pressure.',
    ),
    shift: manual(
      'Puts the pads into Keyboard mode',
      'Holding SHIFT and pressing HOT CUE selects rekordbox Keyboard mode, where pads play the selected hot cue across a musical scale.',
      'Use Keyboard to answer a breakdown vocal with a short, pitched stab that stays musical, rather than repeatedly firing the same unpitched cue until it feels like an alarm.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-pad-fx-1', ref: 50, surface: 'hardware', section: 'deck-left',
    label: 'PAD FX1', shiftLegend: 'PAD FX2', kind: 'button', at: {x: 0.1326, y: 0.6962},
    counterpart: ['rb-deck-performance-pads'],
    primary: manual(
      'Puts the pads into the first bank of Pad FX',
      'PAD FX1 assigns the performance pads to the first Pad FX bank. Pressing or holding a pad applies its assigned effect according to that effect’s setting.',
      'Use a short Pad FX echo on the last word of a vocal when you need a transition accent but do not want to reach across the mixer and disturb an otherwise clean blend.',
    ),
    shift: manual(
      'Puts the pads into the second bank of Pad FX',
      'Holding SHIFT and pressing PAD FX1 selects the second Pad FX bank, giving the pads a separate set of assigned effects from PAD FX1.',
      'Keep subtle utility effects in bank one and more disruptive fills in bank two, so a quick transition does not accidentally become a long roll or a dramatic pitch effect.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-beat-jump', ref: 50, surface: 'hardware', section: 'deck-left',
    label: 'BEAT JUMP', shiftLegend: 'BEAT LOOP', kind: 'button', at: {x: 0.1646, y: 0.6962},
    counterpart: ['rb-deck-performance-pads'],
    primary: manual(
      'Puts the pads into beat-jump mode',
      'BEAT JUMP assigns pads to move the playback position forward or backward by the configured number of beats while the track keeps playing.',
      'Jump back four beats when you notice a phrase change arriving too soon; it buys one clean bar to reset your timing without stopping the music or hunting with the waveform.',
    ),
    shift: manual(
      'Puts the pads into beat-loop mode',
      'Holding SHIFT and pressing BEAT JUMP selects Beat Loop mode, where pads create loops of their assigned beat lengths.',
      'Use Beat Loop to hold an eight-beat percussion groove while the next track finishes loading, then release on a phrase boundary instead of letting an empty breakdown expose the delay.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-sampler', ref: 50, surface: 'hardware', section: 'deck-left',
    label: 'SAMPLER', shiftLegend: 'KEY SHIFT', kind: 'button', at: {x: 0.1976, y: 0.6962},
    counterpart: ['rb-deck-performance-pads'],
    primary: manual(
      'Puts the pads into sampler mode',
      'SAMPLER assigns the pads to trigger the loaded rekordbox sampler slots, independent of the deck track.',
      'Trigger a one-shot airhorn or a prepared percussion hit over a transition when the set needs a deliberate punctuation, not as a substitute for fixing a weak musical handoff.',
    ),
    shift: manual(
      'Puts the pads into Key Shift mode',
      'Holding SHIFT and pressing SAMPLER selects Key Shift mode, where pads change the playing track’s key by the assigned musical intervals.',
      'Use a one-semitone Key Shift only when two otherwise perfect tracks clash by that small interval; reset it before the next track so the correction does not become an unexplained key change later.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-page', ref: 51, surface: 'hardware', section: 'deck-left',
    label: 'PAGE ◄ ►', shiftLegend: 'SAMPLER BANK', kind: 'button', at: {x: 0.2236, y: 0.6962},
    primary: manual(
      'Moves to the next or previous pad page',
      'The PAGE arrows change the visible pad page. In Hot Cue mode this exposes the second group of hot cues, allowing sixteen per deck.',
      'Put emergency cues such as a clean intro and a safe outro on the second page; PAGE gives you a reserve plan without overwriting the eight performance cues you use constantly.',
    ),
    shift: manual(
      'Changes the sampler bank',
      'Holding SHIFT while using PAGE moves between rekordbox sampler banks rather than changing the current pad-mode page.',
      'Separate spoken tags from drum one-shots into different sampler banks, then switch banks before the transition so you do not fire the wrong sound over a quiet vocal.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-key-sync', ref: 48, surface: 'hardware', section: 'deck-left',
    label: 'KEY SYNC', kind: 'button', at: {x: 0.2795, y: 0.8291},
    counterpart: ['rb-deck-key-sync'],
    primary: manual(
      'Moves this deck toward a compatible musical key',
      'KEY SYNC changes the selected deck’s key to match the source deck or a compatible dominant or subdominant key, using rekordbox key analysis and key-shift processing.',
      'Use it when a track is rhythmically perfect but its bass note fights the outgoing record. Check it in headphones first: harmonic compatibility is a starting point, not a guarantee that two arrangements belong together.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-key-reset', ref: 49, surface: 'hardware', section: 'deck-left',
    label: 'KEY RESET', kind: 'button', at: {x: 0.2795, y: 0.8891},
    counterpart: ['rb-deck-master-tempo'],
    primary: manual(
      'Returns the track to its original key',
      'KEY RESET cancels the current key-shift amount and restores the track’s analysed original key.',
      'Press it after a Key Sync transition before you use the track as a reference for the next mix; otherwise the displayed, shifted key can quietly lead you into a bad harmonic decision.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-play-pause', ref: 32, surface: 'hardware', section: 'deck-left',
    label: 'PLAY/PAUSE', kind: 'button', at: {x: 0.0447, y: 0.8891},
    counterpart: ['rb-deck-play-pause'],
    primary: manual(
      'Starts or pauses the selected deck',
      'PLAY/PAUSE toggles playback for the deck selected on this side of the controller.',
      'Use a deliberate press on the first downbeat of a phrase when launching an intro by ear. If the incoming track is already cued and quantized, that one press is the moment the audience hears your choice.',
    ),
  },
  {
    id: 'deck-left-cue', ref: 33, surface: 'hardware', section: 'deck-left',
    label: 'CUE', kind: 'button', at: {x: 0.0447, y: 0.7690},
    counterpart: ['rb-deck-cue'],
    primary: manual(
      'Sets, recalls, and previews the cue point',
      'While paused, press CUE to set the cue at the current position. While playing, press CUE to back-cue to that point and pause. While paused at the cue, hold CUE to play in Cue Sampler mode; release it to stop and return to the cue.',
      'Tap and hold CUE in headphones to audition the first kick of an incoming track repeatedly while you align it to the master; release it until you are ready to launch for real.',
    ),
  },
  {
    id: 'deck-left-search', ref: 34, surface: 'hardware', section: 'deck-left',
    label: 'SEARCH ◄◄ / ►►', shiftLegend: 'CUE/LOOP CALL', kind: 'button', at: {x: 0.0405, y: 0.6834},
    primary: manual(
      'Searches backward or forward through the track',
      'Press SEARCH ◄◄ or ►► to move backward or forward; hold either button to rewind or fast-forward quickly while monitoring the deck. These buttons search the track, not a fixed beat amount.',
      'Use the pair in headphones to find a spoken intro or a clean later outro in an unfamiliar track, then set a cue before bringing that deck to the audience instead of dragging through the waveform mid-mix.',
    ),
    shift: manual(
      'Calls the previous or next saved cue or loop',
      'Holding SHIFT with SEARCH ◄◄ calls the preceding stored memory cue or loop; holding it with ►► calls the next one from rekordbox.',
      'Step through a track’s stored phrase markers while planning a live transition. You can audition its breakdown, chorus, and outro in order without taking your attention from the controller to hunt on screen.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-memory', ref: 35, surface: 'hardware', section: 'deck-left',
    label: 'MEMORY', shiftLegend: 'DELETE', kind: 'button', at: {x: 0.0335, y: 0.6292},
    primary: manual(
      'Stores the current cue point or loop as memory',
      'MEMORY saves the current cue point or active loop to the track’s rekordbox memory-cue list for later recall.',
      'Store the first full beat after a long ambient intro as a memory cue during preparation. It gives you a dependable mix-in point even if you do not want to spend one of the performance pads on it.',
      {source: 'rekordbox7'},
    ),
    shift: manual(
      'Deletes the current stored cue or loop',
      'Holding SHIFT and pressing MEMORY deletes the selected stored memory cue or loop from the track.',
      'Delete a marker only after confirming it is the duplicate or wrong phrase point; a cluttered memory list makes cue-call navigation slower exactly when you need it to be predictable.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-deck-select', ref: 36, surface: 'hardware', section: 'deck-left',
    label: 'DECK SELECT 3/1', kind: 'button', at: {x: 0.0247, y: 0.2192},
    primary: manual(
      'Chooses whether this side controls deck 1 or deck 3',
      'DECK SELECT switches this physical left deck between rekordbox decks 1 and 3. The jog display and deck controls follow the selected software deck.',
      'Switch to deck 3 only after checking its channel fader and cue routing: it lets one pair of hardware controls run a third track, but the wrong selection can launch or nudge the track currently on air.',
    ),
  },
  {
    id: 'deck-left-slip-reverse', ref: 37, surface: 'hardware', section: 'deck-left',
    label: 'SLIP REVERSE', shiftLegend: 'REVERSE', kind: 'button', at: {x: 0.0317, y: 0.1493},
    primary: manual(
      'Reverses momentarily while the track advances underneath',
      'Hold SLIP REVERSE to play backward momentarily with slip behavior: the underlying track position continues to advance, and releasing returns to the position it would have reached. Pioneer automatically cancels the move after eight beats even if you keep holding the button.',
      'Hold it for a one-beat reverse burst before a drop, then release on the downbeat. Slip keeps the arrangement moving so the drop arrives on time instead of late and disorienting.',
    ),
    shift: manual(
      'Turns on latched reverse playback',
      'Holding SHIFT and pressing SLIP REVERSE turns REVERSE on or off as a latched playback state rather than a hold-to-use slip move.',
      'Use latched reverse only for a planned transition texture with a clear exit point; it keeps running after your hand leaves the button, so an accidental press can quickly lose the phrase.',
    ),
  },
  {
    id: 'deck-left-loop-in', ref: 38, surface: 'hardware', section: 'deck-left',
    label: 'LOOP IN · 1/2X', shiftLegend: 'IN ADJUST', kind: 'button', at: {x: 0.0247, y: 0.0725},
    counterpart: ['rb-deck-loop-length'],
    primary: manual(
      'Sets the loop start or halves an active loop',
      'LOOP IN sets a loop-in point. While a loop is active, it halves the loop length, and the 1/2X legend describes that shortening action.',
      'Halve an eight-beat loop to four, then two beats as a transition approaches to build momentum from the same percussion without suddenly changing the track or losing the beat.',
    ),
    shift: manual(
      'Fine-adjusts the loop-in point with the jog',
      'Holding SHIFT and pressing LOOP IN enters IN ADJUST, allowing the jog to move the loop’s start point precisely.',
      'Use IN ADJUST when a loop catches a fraction before the kick and creates a click or flammed rhythm. Correct it in headphones so the loop is truly seamless before using it on the main output.',
    ),
  },
  {
    id: 'deck-left-loop-out', ref: 39, surface: 'hardware', section: 'deck-left',
    label: 'LOOP OUT · 2X', shiftLegend: 'OUT ADJUST/RELOOP', kind: 'button', at: {x: 0.0595, y: 0.0725},
    counterpart: ['rb-deck-loop-length'],
    primary: manual(
      'Sets the loop end and doubles an active loop',
      'LOOP OUT sets the loop-out point and starts the loop. While looping, it doubles the loop length, following the 2X legend.',
      'Double a one-beat loop back to two or four beats when the incoming track needs another bar to settle; the groove breathes again without abandoning the transition.',
    ),
    shift: manual(
      'Fine-adjusts the loop end or reloops a saved loop',
      'Holding SHIFT and pressing LOOP OUT reloops when no loop is active. When a loop is active, it enters OUT ADJUST so the jog can correct the loop end precisely.',
      'Recall a previously used loop to extend a percussion break when the next deck is not ready, but listen for a clean endpoint before reopening it on a vocal or melodic phrase.',
    ),
  },
  {
    id: 'deck-left-loop-exit', ref: 40, surface: 'hardware', section: 'deck-left',
    label: '4 BEAT LOOP / EXIT', shiftLegend: 'ACTIVE LOOP', kind: 'button', at: {x: 0.1017, y: 0.0784},
    counterpart: ['rb-deck-auto-loop'],
    primary: manual(
      'Creates a four-beat loop or exits the current loop',
      'Press 4 BEAT LOOP / EXIT to create a four-beat automatic loop. When a loop is active, pressing it exits and resumes normal playback.',
      'Use a four-beat loop to hold a drum groove while you swap a cable or cue the next track, then exit on a phrase boundary so the audience hears a planned continuation rather than a technical pause.',
    ),
    shift: manual(
      'Toggles the active-loop state at the stored loop',
      'Holding SHIFT and pressing 4 BEAT LOOP / EXIT toggles the track’s active-loop setting, so rekordbox automatically engages that saved loop when playback reaches it.',
      'Set an active loop as a safety net before an unusable outro: if you miss your planned exit while working another deck, the track repeats a musical section instead of falling into dead air.',
      {source: 'rekordbox7'},
    ),
  },
  {
    id: 'deck-left-pad-grid', ref: 52, surface: 'hardware', section: 'deck-left',
    label: 'PERFORMANCE PADS', kind: 'pad', at: {x: 0.1547, y: 0.8143},
    counterpart: ['rb-deck-performance-pads'],
    primary: manual(
      'Triggers the eight actions selected by the current pad mode',
      'The eight performance pads execute the assignments from the active pad mode: Hot Cue, Pad FX, Beat Jump, Sampler, or one of the SHIFT-selected modes. Their action depends on the mode button, not on a separate grey function printed on the pad grid.',
      'Before a transition, glance at the lit mode button and mentally name what the pads will do. A pad that launches a safe hot cue in one moment can trigger a sampler sound or key shift in the next, which is a very different result over an exposed vocal.',
      {tips: ['Set the pad mode before the phrase arrives; do not discover it by firing a pad on the master output.']},
    ),
  },
];
