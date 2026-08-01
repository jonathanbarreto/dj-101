import type {Behavior, Control} from '../types';

const manual = (
  summary: string,
  detail: string,
  why: string,
  extras: Partial<Behavior> = {},
): Behavior => ({summary, detail, why, source: 'manual', ...extras});

/**
 * The grouped hardware effect controls. Ref 20 belongs to the mixer-wide
 * Sound Color row; refs 26–31 form the Beat FX strip at the mixer's right edge.
 */
export const hardwareFxControls: Control[] = [
  {
    id: 'mixer-sound-color-fx-select',
    ref: 20,
    surface: 'hardware',
    section: 'mixer',
    label: 'SOUND COLOR FX SELECT',
    kind: 'button',
    at: {x: 0.37, y: 0.486},
    primary: manual(
      'Selects one Sound Color FX for the mixer',
      'The four buttons choose DUB ECHO, PITCH, NOISE, or FILTER globally. Press a button and it flashes to show the selected effect; press that selected button again to cancel it. Only one Sound Color FX can be selected for all four channels at a time, but nothing is heard until a channel’s COLOR knob leaves its centre-off detent.',
      'Choose the effect before a transition, then apply it independently with each channel’s COLOR knob. That separation lets you filter one outgoing track while another channel stays neutral. These onboard hardware Sound Color FX also work with a compatible external input, so a turntable or line player can take part without using a rekordbox deck.',
      {gotcha: 'The row selects one global effect; it does not apply that effect equally to every channel. Each per-channel COLOR knob controls its own amount and direction, and centre remains off. Rekordbox functions cannot be used for an external input.'},
    ),
    referenceLinks: [
      {href: '/reference/sound-color-fx', label: 'Compare the four Sound Color FX directions'},
    ],
  },
  {
    id: 'fx-display',
    ref: 26,
    surface: 'hardware',
    section: 'fx',
    label: 'BEAT FX DISPLAY',
    kind: 'display',
    at: {x: 0.62, y: 0.52},
    primary: manual(
      'Confirms the complete Beat FX setup before it reaches the mix',
      'The display carries five pieces of information: the effect name; AUTO or TAP tempo mode; detected or entered BPM, which flashes when AUTO cannot measure it; the chosen beat fraction and its calculated time or effect parameter; and the routing target. Targets appear as SP, MIC, CH1, CH2, CH3, CH4, or MST.',
      'Read the display from top to bottom before enabling an effect. It catches the two expensive mistakes—sending the right effect to the wrong source and using the wrong rhythmic division—while the BPM and parameter readouts tell you whether the repeats or modulation will actually land with the phrase.',
      {gotcha: 'A flashing BPM is a warning that automatic measurement is unavailable or unstable. Enter the tempo with TAP before trusting a beat-timed echo, roll, or modulation.'},
    ),
  },
  {
    id: 'fx-beat-arrows',
    ref: 27,
    surface: 'hardware',
    section: 'fx',
    label: 'BEAT ◀ / ▶',
    shiftLegend: 'AUTO / TAP',
    kind: 'button',
    at: {x: 0.62, y: 0.585},
    primary: manual(
      'Changes the Beat FX timing or effect-specific parameter',
      'The left arrow selects a shorter beat fraction and the right arrow selects a longer one. For time-based Beat FX this changes the interval derived from BPM; for effects with a different parameter scale, the same arrows step through that effect’s available parameter values. The result appears beside the beat or parameter field in the display.',
      'Set the musical subdivision before turning the effect on: a short fraction can create a tight rhythmic fill, while a longer value can carry an echo across a bar or phrase. Watch the displayed value rather than assuming every effect interprets the arrows as delay time.',
      {gotcha: 'The arrows do not always mean “faster” and “slower.” Their parameter is effect-specific, so confirm the display after changing effects.'},
    ),
    shift: manual(
      'Chooses automatic BPM detection or enters tempo by tapping',
      'Hold SHIFT and press the left arrow for AUTO, which measures supported input from 70 to 180 BPM. Hold SHIFT and tap the right arrow in quarter-note time for TAP/manual mode; after more than two taps, the controller uses the average interval of those quarter-note pulses to calculate BPM.',
      'Leave AUTO active when its reading is stable. If the BPM flashes because a live drummer, quiet intro, or syncopated source cannot be measured reliably, tap a steady quarter-note pulse several times and check the resulting number before engaging a beat-timed effect.',
      {gotcha: 'AUTO’s 70–180 BPM range is a detection range, not a limit on your music library. A flashing reading is the cue to use SHIFT + right arrow TAP.'},
    ),
  },
  {
    id: 'fx-selector',
    ref: 28,
    surface: 'hardware',
    section: 'fx',
    label: 'BEAT FX SELECT',
    kind: 'knob',
    at: {x: 0.62, y: 0.659},
    primary: manual(
      'Chooses one of the fourteen printed Beat FX',
      'Turn the selector to choose the effect whose name is printed around the knob. The DDJ-1000 offers 14 positions, ranging from rhythmic repeats and gates to modulation, pitch, and self-generated Mobius tones; the selected name is confirmed in the display above.',
      'Choose by musical job before setting the other controls: an echo can carry the last word of a phrase, a roll can create a short fill, and a modulation effect can build tension. After changing effects, re-check the beat value and LEVEL/DEPTH because the same physical controls can take on different meanings.',
      {gotcha: 'Changing the effect does not guarantee that the previous timing and LEVEL/DEPTH position make musical sense for the new one. Re-check the display and start conservatively.'},
    ),
    referenceLinks: [
      {href: '/reference/beat-fx', label: 'Compare all 14 Beat FX and LEVEL/DEPTH roles'},
    ],
  },
  {
    id: 'fx-channel-selector',
    ref: 29,
    surface: 'hardware',
    section: 'fx',
    label: 'CH SELECT',
    kind: 'switch',
    at: {x: 0.62, y: 0.739},
    primary: manual(
      'Routes Beat FX to one source or to the complete master mix',
      'Turn CH SELECT to target CH1, CH2, CH3, CH4, MIC, SP for the sampler, or MST for the summed master bus. A channel choice processes only that strip’s routed signal; MIC and SP isolate those sources; MST processes the whole master mix after sources have been combined.',
      'Target the outgoing channel for a clean transition effect while the incoming track stays untouched. Use SP for a sampler flourish or MIC only for a deliberate voice effect. Reserve MST for a rehearsed whole-mix move, because every audible deck, microphone, and sampler source can be affected together.',
      {gotcha: 'CH SELECT is effect routing, not headphone cue or crossfader assignment. MST means the whole mix—not the currently selected deck.'},
    ),
  },
  {
    id: 'fx-level-depth',
    ref: 30,
    surface: 'hardware',
    section: 'fx',
    label: 'LEVEL / DEPTH',
    kind: 'knob',
    at: {x: 0.62, y: 0.825},
    primary: manual(
      'Controls the selected effect’s effect-specific depth parameter',
      'LEVEL/DEPTH is not one generic wet/dry knob. Its job differs by effect: it may set dry/effect balance, intensity, feedback plus balance, TRANS duty ratio, pitch change, alternating multi-tap levels, or Mobius oscillator level. The exact response belongs to the selected Beat FX.',
      'Start near minimum, turn the effect on, and raise only until the intended detail is clear in the room. Revisit the setting every time you change effects: the same knob position that gives a restrained echo can produce a far more aggressive modulation or pitch movement.',
      {gotcha: 'Never assume noon means a standard 50/50 blend. Read the effect-specific LEVEL/DEPTH role before performing a new effect live.'},
    ),
    referenceLinks: [
      {href: '/reference/beat-fx', label: 'Look up each effect’s LEVEL/DEPTH behavior'},
    ],
  },
  {
    id: 'fx-on-off',
    ref: 31,
    surface: 'hardware',
    section: 'fx',
    label: 'BEAT FX ON / OFF',
    shiftLegend: 'RELEASE FX',
    kind: 'button',
    at: {x: 0.62, y: 0.933},
    primary: manual(
      'Toggles the prepared Beat FX processing on and off',
      'Press once to turn the selected Beat FX on; the button flashes while the effect is active. Press again to turn it off. Build a safe setup in signal order before that first press: choose the effect, choose its CH SELECT target, set the beat or parameter, begin with LEVEL/DEPTH low, then use ON/OFF on the intended phrase boundary.',
      'Use the button as the final commitment after the display confirms every choice. Turning an echo on at the last word or enabling a roll for one measured fill is easier to control when selection, routing, timing, and depth were prepared before the phrase arrives.',
      {gotcha: 'ON/OFF does not choose what is processed or how strongly. An old target or a high LEVEL/DEPTH setting becomes audible immediately when you enable it.'},
    ),
    shift: manual(
      'Invokes the Release FX configured in rekordbox 7',
      'Hold SHIFT and press ON/OFF to invoke the Release FX assigned in rekordbox 7 for a rekordbox USB/software source. The configured exit effect is applied and the active Beat FX is cancelled; depending on the rekordbox preference, the action can also turn the active Sound Color FX off. The audible result therefore follows your software configuration rather than one fixed hardware sound.',
      'Use Release FX as a deliberate exit from a build or effect chain on a rekordbox deck, especially when you want one rehearsed gesture to transition out and clear the active Beat FX. Test the configured choice and the Sound Color FX preference in headphones before relying on it during a set.',
      {source: 'rekordbox7', gotcha: 'RELEASE FX is a rekordbox function and cannot process an analogue external input. It is configurable, so do not assume a particular sound, tail length, hold behavior, or latched state until you have checked the rekordbox 7 assignment.'},
    ),
  },
];
