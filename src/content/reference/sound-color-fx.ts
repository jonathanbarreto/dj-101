export interface SoundColorFx extends Record<string, unknown> {
  name: string;
  description: string;
  turnLeft: string;
  center: string;
  turnRight: string;
}

/** Order printed in the DDJ-1000 Sound Color FX row. */
export const soundColorFx: SoundColorFx[] = [
  {
    name: 'DUB ECHO',
    description:
      'Adds a spacious echo to the channel selected by its COLOR knob. The direction chooses which frequency range feeds the echo, which makes it possible to trail a vocal or percussion without echoing the whole low end.',
    turnLeft:
      'Applies the echo primarily to the mid-frequency range; farther from center increases the effect.',
    center: 'Effect off—the channel passes without Sound Color processing.',
    turnRight:
      'Applies the echo primarily to the high-frequency range; farther from center increases the effect.',
  },
  {
    name: 'PITCH',
    description:
      'Changes the pitch of the channel without using the deck tempo fader. It is an effect for a deliberate tonal bend or transition accent; KEY SYNC and KEY SHIFT are the better tools when the musical key must stay controlled.',
    turnLeft:
      'Lowers the channel pitch progressively as the knob moves farther counterclockwise.',
    center: 'Effect off—the channel remains at its current playback pitch.',
    turnRight:
      'Raises the channel pitch progressively as the knob moves farther clockwise.',
  },
  {
    name: 'NOISE',
    description:
      'Mixes internally generated white noise into the channel through a filter. COLOR sweeps the filter cutoff; the separate PARAMETER control sets the noise level, so level and tone can be shaped independently.',
    turnLeft:
      'Moves the noise filter toward a lower cutoff for a darker, descending sweep.',
    center: 'Effect off—no internally generated noise is mixed into the channel.',
    turnRight:
      'Moves the noise filter toward a higher cutoff for a brighter, rising sweep.',
  },
  {
    name: 'FILTER',
    description:
      'Applies the familiar one-knob DJ filter to this channel. It is useful for removing bass before a blend or thinning a track to create space, but the center detent is the only neutral position.',
    turnLeft:
      'Engages a low-pass filter and lowers its cutoff, progressively removing high frequencies.',
    center: 'Effect off—the filter is neutral at the center detent.',
    turnRight:
      'Engages a high-pass filter and raises its cutoff, progressively removing low frequencies.',
  },
];
