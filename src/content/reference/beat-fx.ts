export interface BeatFx extends Record<string, unknown> {
  name: string;
  description: string;
  /** What the LEVEL/DEPTH knob changes for this specific effect. */
  levelDepth: string;
  /** Introduced as a new Beat FX on the DDJ-1000. */
  isExclusive?: boolean;
}

/** Order printed around the DDJ-1000 Beat FX selector. */
export const beatFx: BeatFx[] = [
  {
    name: 'ENIGMA JET',
    description:
      'A sweeping jet effect rises or falls in pitch in time with the selected beat value. It is a dramatic, metallic build or release effect: use it to make a transition climb, then switch it off cleanly on the next phrase rather than leaving the sweep over the mix.',
    levelDepth:
      'Controls the intensity of the jet effect; the BEAT controls set its timed movement.',
    isExclusive: true,
  },
  {
    name: 'TRANS',
    description:
      'Cuts the sound on and off rhythmically at the selected beat fraction, turning a sustained passage into a gated pattern. It is useful for adding pulse to a breakdown or making a brief rhythmic fill without changing the track itself.',
    levelDepth:
      'Changes both the gate duty ratio—the time heard versus muted—and the dry/effect balance.',
  },
  {
    name: 'REVERB',
    description:
      'Adds a reverberant tail that makes the source sound as though it occupies a larger space. A restrained amount can soften a transition; a long, wetter tail can let a vocal or final hit hang after its channel is lowered.',
    levelDepth:
      'Sets the balance between the original dry signal and the reverberated effect sound.',
  },
  {
    name: 'SPIRAL',
    description:
      'Creates a delayed, reverberant spiral whose pitch changes when the delay time changes. Its feedback can continue after the input is removed, so it works well as a rising transition tail but needs deliberate timing to avoid covering the incoming track.',
    levelDepth:
      'Changes the feedback amount and the balance between the original signal and the spiral.',
  },
  {
    name: 'MT DELAY',
    description:
      'MULTI TAP DELAY produces a sequence of distinct repeats at rhythmic intervals instead of one conventional echo line. The alternating taps create movement across a phrase, making it useful for turning a short stab or vocal syllable into a patterned fill.',
    levelDepth:
      'From MIN to center, raises the odd-numbered delay taps; from center to MAX, raises the even-numbered delay taps.',
  },
  {
    name: 'ECHO',
    description:
      'Repeats the input at the selected beat fraction, with each repeat fading away. It is the dependable choice for letting the final word, snare, or chord of the outgoing track trail across a clean channel change.',
    levelDepth:
      'Sets the balance between the original dry signal and the repeated echo sound.',
  },
  {
    name: 'LOW CUT ECHO',
    description:
      'Repeats the input like ECHO while reducing low frequencies in the delayed sound. The kick and bass stay out of the tail, so a vocal or percussion echo can cross into the next track without two low ends turning the mix muddy.',
    levelDepth:
      'Sets the balance between the original dry signal and the low-cut echo repeats.',
    isExclusive: true,
  },
  {
    name: 'FLANGER',
    description:
      'Applies a timed sweeping comb-filter effect over one cycle of the selected beat value. Its hollow, jet-like movement is effective over drums during a build; shorter settings sound tighter while longer settings make the sweep more obvious.',
    levelDepth:
      'Controls the intensity of the flanger sweep; the BEAT controls set the cycle length.',
  },
  {
    name: 'PHASER',
    description:
      'Moves a series of phase notches through the sound in time with the selected beat value. It is smoother than FLANGER, so it can animate pads, vocals, or a breakdown without the same pronounced metallic edge.',
    levelDepth:
      'Controls the intensity of the phaser movement; the BEAT controls set its timing.',
  },
  {
    name: 'PITCH',
    description:
      'Shifts the effect sound above or below the source pitch by the amount selected with the BEAT controls. Use a small interval for a tonal lift or drop; extreme values are a deliberate transition effect, not a substitute for harmonic key matching.',
    levelDepth:
      'Sets the balance between the original dry signal and the pitch-shifted effect; BEAT sets the pitch amount.',
  },
  {
    name: 'SLIP ROLL',
    description:
      'Captures a short slice and repeats it at the selected beat fraction while playback continues underneath on the track timeline in silence. Switch the effect off and playback returns to the position the track has reached, keeping the phrase on schedule.',
    levelDepth:
      'Sets the balance between the original dry signal and the repeated slip-roll sound.',
  },
  {
    name: 'ROLL',
    description:
      'Captures the sound at the moment the effect is engaged and repeats that slice at the selected beat fraction. Unlike SLIP ROLL, the track does not continue underneath, so releasing it does not jump ahead to the advanced timeline position.',
    levelDepth:
      'Sets the balance between the original dry signal and the repeated roll sound.',
  },
  {
    name: 'MOBIUS (SAW)',
    description:
      'Works even with the track stopped: its sawtooth-wave Shepard tone seems to rise or fall without reaching an endpoint. It can create tension in an empty breakdown or between tracks because the oscillator does not need incoming audio.',
    levelDepth:
      'Sets the oscillator mix and volume; the BEAT controls determine its pitch and rising or falling direction.',
    isExclusive: true,
  },
  {
    name: 'MOBIUS (TRI)',
    description:
      'Works even with the track stopped: its smoother triangle-wave Shepard tone seems to rise or fall forever. Choose it when the endless-motion illusion is useful but the sharper harmonics of MOBIUS (SAW) would be too aggressive.',
    levelDepth:
      'Sets the oscillator mix and volume; the BEAT controls determine its pitch and rising or falling direction.',
    isExclusive: true,
  },
];
