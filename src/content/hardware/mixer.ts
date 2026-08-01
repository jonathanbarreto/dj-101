import type {Behavior, Control, Point} from '../types';

export const MIXER_CHANNEL_ORDER = [3, 1, 2, 4] as const;
export type MixerChannel = (typeof MIXER_CHANNEL_ORDER)[number];

type ChannelControlSlug =
  | 'input' | 'trim' | 'meter' | 'high' | 'mid' | 'low'
  | 'color' | 'cue' | 'fader' | 'assign';

interface ChannelSpec {
  channel: MixerChannel;
  x: number;
  selector: 'line' | 'phono-line';
}

const CHANNELS: ChannelSpec[] = [
  {channel: 3, x: 0.4140, selector: 'phono-line'},
  {channel: 1, x: 0.4645, selector: 'line'},
  {channel: 2, x: 0.5150, selector: 'line'},
  {channel: 4, x: 0.5652, selector: 'phono-line'},
];

const Y: Record<ChannelControlSlug, number> = {
  input: 0.0751,
  trim: 0.1513,
  meter: 0.2742,
  high: 0.2318,
  mid: 0.3136,
  low: 0.4047,
  color: 0.4938,
  cue: 0.5851,
  fader: 0.7155,
  assign: 0.8354,
};

const REF: Record<ChannelControlSlug, number> = {
  input: 11,
  trim: 9,
  meter: 10,
  high: 8,
  mid: 7,
  low: 6,
  color: 5,
  cue: 4,
  fader: 3,
  assign: 2,
};

const KIND: Record<ChannelControlSlug, Control['kind']> = {
  input: 'switch', trim: 'knob', meter: 'display', high: 'knob', mid: 'knob',
  low: 'knob', color: 'knob', cue: 'button', fader: 'fader', assign: 'switch',
};

const manual = (
  summary: string,
  detail: string,
  why: string,
  extras: Partial<Behavior> = {},
): Behavior => ({summary, detail, why, source: 'manual', ...extras});

function inputBehavior({channel, selector}: ChannelSpec): Behavior {
  if (selector === 'phono-line') {
    return manual(
      `Chooses the signal feeding channel ${channel}`,
      `The three positions route USB A, the shared PHONO/LINE RCA input, or USB B into channel ${channel}. For the centre position, the rear-panel PHONO/LINE switch decides whether that RCA pair expects a turntable-level phono signal or a line-level player.`,
      `Choose the source before setting TRIM: USB A or USB B assigns one of two connected rekordbox laptops, while the centre position brings an external deck into the mix. On a changeover, confirm this switch before raising the fader so you do not send silence or an unexpectedly loud source to the room.`,
      {gotcha: 'A turntable and a line player need different input sensitivity. Match the rear PHONO/LINE switch before opening the channel.'},
    );
  }
  return manual(
    `Chooses the signal feeding channel ${channel}`,
    `The three positions route USB A, the dedicated LINE RCA input, or USB B into channel ${channel}. The outer positions assign one of two connected rekordbox laptops; the centre position accepts a line-level player connected at the rear.`,
    `Set the source first, then build gain from TRIM. During a laptop handoff, the selector lets this strip move from USB A to USB B without repatching audio; for a media player, choose LINE and cue it before you open the channel.`,
    {gotcha: `Channel ${channel} is not a phono input. A turntable needs channel 3 or 4 with its rear switch set to PHONO, or a separate phono preamp.`},
  );
}

function behaviorFor(spec: ChannelSpec, slug: ChannelControlSlug): Behavior {
  const channel = spec.channel;
  switch (slug) {
    case 'input':
      return inputBehavior(spec);
    case 'trim':
      return manual(
        `Sets channel ${channel}'s pre-fader input gain`,
        `TRIM raises or lowers the signal before the channel fader. Start with the channel EQ and COLOR controls centred, play the track's loudest passage, then set TRIM so the pre-fader channel meter reaches the upper orange area without living at the top.`,
        `Use TRIM to make unlike recordings arrive at the mixer with comparable headroom. That gives the fader a predictable working range and leaves room for summed channels and effects; use the channel fader, not TRIM, for the musical fade during a blend.`,
        {gotcha: 'TRIM is input calibration, not a performance-volume control. Chasing every quiet phrase with it makes the next loud section jump.'},
      );
    case 'meter':
      return manual(
        `Shows channel ${channel}'s input level before its fader`,
        `This vertical meter reads the channel's pre-fader level, so it still responds when the channel fader is closed. Read it while setting TRIM with the track's loudest passage; the top red area warns that the input stage has little or no headroom left.`,
        `Watch this meter in headphones before bringing in a new track. Matching useful meter peaks makes a fader swap more predictable, while leaving headroom prevents two well-behaved channels from overloading the master bus when they play together.`,
        {gotcha: 'A healthy channel meter does not guarantee a healthy master level: EQ boosts, effects, the sampler, microphones, and other channels add together later.'},
      );
    case 'high':
      return manual(
        `Cuts or boosts channel ${channel}'s high frequencies`,
        `HI is the top band of the three-band channel EQ. It reaches full kill at −26 dB and boosts up to +6 dB; the centre detent is neutral. It mainly shapes cymbals, hats, air, and upper presence rather than the track's overall loudness.`,
        `Ease the incoming track's HI back when two sets of hats make the blend brittle, or open it as the outgoing percussion leaves to restore sparkle and space. Small moves are usually enough because bright transients draw attention quickly.`,
        {gotcha: 'Noon is neutral. Matching knob angles after a cut does not match track brightness; use your headphones and the room.'},
      );
    case 'mid':
      return manual(
        `Cuts or boosts channel ${channel}'s midrange`,
        `MID is the centre band of the channel EQ, with a −26 dB full-kill cut, a +6 dB boost, and neutral at the centre detent. Vocals, synth hooks, guitars, snares, and much of a track's identity compete here.`,
        `Pull the incoming MID back when two vocals or lead synths collide, then trade the band across the phrase so one musical idea stays intelligible. This is often the cleanest fix for a crowded blend that is not actually too loud.`,
        {gotcha: 'A deep mid cut can make a track feel hollow even when its meter looks normal; meter level and perceived musical weight are different.'},
      );
    case 'low':
      return manual(
        `Cuts or boosts channel ${channel}'s low frequencies`,
        `LOW controls the kick-and-sub region with a −26 dB full-kill cut, a +6 dB boost, and a neutral centre detent. At full cut it removes nearly all energy assigned to this band so two bass lines do not have to play at once.`,
        `Use it for the bass swap: keep the incoming LOW cut while its rhythm is cued, then exchange the two LOW controls on a phrase boundary so one kick and sub foundation carries the room. That preserves punch and avoids low-frequency buildup.`,
        {gotcha: 'Boosting both tracks for impact usually reduces headroom and can make the limiter work harder; a clean exchange is stronger than stacked subs.'},
      );
    case 'color':
      return manual(
        `Applies the selected Sound Color FX to channel ${channel}`,
        `COLOR controls the currently selected global Sound Color FX on this channel only. The centre detent is off; turning left or right increases the effect and, depending on the selected effect, changes its direction or tonal side.`,
        `Reach for COLOR when one channel needs a quick tonal transition without routing the whole mix through Beat FX—for example, filtering the outgoing bass before a drop. Return it deliberately to centre so the next track does not inherit a hidden effect.`,
        {gotcha: 'The four Sound Color FX buttons choose one effect globally; this knob decides how that chosen effect is applied to this channel.'},
      );
    case 'cue':
      return manual(
        `Sends channel ${channel} to the headphones before the fader`,
        `CUE adds this channel's pre-fader signal to the headphone cue bus. You can hear and prepare the source with the channel fader closed; HEADPHONES MIXING then balances all selected cue channels against the master program.`,
        `Select CUE before loading or beatmatching so mistakes stay out of the speakers. You can compare two candidate tracks privately, set their gains, and rehearse the entry while the audience continues hearing the master mix.`,
        {gotcha: 'CUE only makes the channel available to the headphone mix. The MIXING and LEVEL knobs still determine what reaches your headphones.'},
      );
    case 'fader':
      return manual(
        `Controls channel ${channel}'s level in the mix`,
        `The channel fader moves this strip from closed to its working level after TRIM, EQ, and COLOR. Its response curve is set in rekordbox 7 under Preferences → Controller → Mixer; the physical fader has no curve selector.`,
        `Use the channel fader for phrase-length entrances and exits when you want independent control from the crossfader. A gradual rise reveals whether the vocal, percussion, and bass actually fit before the track reaches full level.`,
        {gotcha: 'The fader cannot repair poor gain staging. Set TRIM first, and set the fader curve in rekordbox 7 rather than looking for a hardware curve control.'},
      );
    case 'assign':
      return manual(
        `Routes channel ${channel} to crossfader side A, THRU, or side B`,
        `A sends the channel to the crossfader's left bus, B sends it to the right bus, and THRU bypasses the crossfader so the channel fader alone controls the channel. The switch changes routing; it does not pan audio left or right.`,
        `Assign two tracks to opposite sides for cuts, scratches, or a single-hand blend. Choose THRU for a mic-like utility source, a third deck, or any channel that must stay audible while you work the crossfader between A and B.`,
        {gotcha: 'THRU means bypass, not mute. A channel on THRU ignores the crossfader and can remain live even when the crossfader is fully away from it.'},
      );
  }
}

function shiftFor(channel: MixerChannel, slug: ChannelControlSlug): Behavior | undefined {
  if (slug === 'cue') {
    return manual(
      `Taps rekordbox's Beat FX tempo from channel ${channel}`,
      `TAP enters Beat FX timing for a rekordbox deck selected through USB: hold SHIFT and tap this CUE button in time to set the BPM manually. It is not the channel's headphone-cue action while SHIFT is held.`,
      `Tap four or more steady beats when automatic tempo detection is unsuitable—for example, a drifting live drummer or an external rhythm with an unclear grid—so a time-based effect follows the musical pulse you hear.`,
      {gotcha: 'TAP is a rekordbox USB-deck function. Do not expect the same shifted command from an analogue PHONO or LINE source.'},
    );
  }
  if (slug === 'fader') {
    return manual(
      `Uses channel ${channel}'s fader to start and back-cue a rekordbox deck`,
      `For a rekordbox USB deck with a cue point set, hold SHIFT and raise the channel fader from fully closed to start playback from that cue. Return it fully closed while holding SHIFT to pause and back-cue; with no cue stored, playback starts from the track beginning.`,
      `Fader start can launch an incoming track at the exact moment its level begins to rise, which is useful for a hands-busy cut or a repeatable cue-drop. Rehearse the closed position and cue first so the gesture cannot launch an unprepared deck.`,
      {gotcha: 'This shifted start command controls a rekordbox deck over USB; it does not remotely start an analogue PHONO or LINE source.'},
    );
  }
  return undefined;
}

function channelPoint(spec: ChannelSpec, slug: ChannelControlSlug): Point {
  return {
    x: slug === 'meter' ? spec.x - 0.0205 : spec.x,
    y: Y[slug],
  };
}

function makeChannelControls(spec: ChannelSpec): Control[] {
  const slugs: ChannelControlSlug[] = [
    'input', 'trim', 'meter', 'high', 'mid', 'low', 'color', 'cue', 'fader', 'assign',
  ];
  return slugs.map((slug): Control => ({
    id: `mixer-ch${spec.channel}-${slug}`,
    ref: REF[slug],
    surface: 'hardware',
    section: 'mixer',
    label: slug === 'input' ? `CH ${spec.channel} INPUT`
      : slug === 'meter' ? `CH ${spec.channel} LEVEL METER`
        : slug === 'assign' ? `CH ${spec.channel} CROSSFADER ASSIGN`
          : `CH ${spec.channel} ${slug.toUpperCase()}`,
    shiftLegend: slug === 'cue' ? 'TAP' : undefined,
    kind: KIND[slug],
    at: channelPoint(spec, slug),
    primary: behaviorFor(spec, slug),
    shift: shiftFor(spec.channel, slug),
  }));
}

const globalControls: Control[] = [
  {
    id: 'mixer-crossfader', ref: 1, surface: 'hardware', section: 'mixer',
    label: 'MAGVEL CROSS FADER', kind: 'fader', at: {x: 0.4992, y: 0.9413},
    primary: manual(
      'Blends or cuts between channels assigned to A and B',
      'The MAGVEL FADER controls only channels whose assign switches are on A or B; THRU channels bypass it. Its curve is configured in rekordbox 7 Preferences → Controller → Mixer. Pioneer rates the magnetic mechanism for more than ten million movements.',
      'Use a smooth curve for long transitions or a sharp curve when scratching and cutting, where sound must arrive near the edge. Before moving it, scan all four assign switches so an unexpected channel does not vanish with the opposite side.',
      {gotcha: 'There is no hardware crossfader-curve knob on the DDJ-1000. Set the curve in rekordbox 7, and remember THRU channels stay outside it.'},
    ),
    shift: manual(
      'Starts or back-cues assigned rekordbox decks from the crossfader edge',
      'With rekordbox USB decks assigned to A and B and cue points set, hold SHIFT and move away from a fully closed side; that closed side starts from its cue. Return fully to the edge while holding SHIFT to pause and back-cue it.',
      'Use crossfader start for a rehearsed cut where the audible edge and deck launch must be one gesture. Verify both assignments, cues, and the side that is closed before engaging it; an accidental route makes the wrong deck start.',
      {gotcha: 'Crossfader start requires the A/B routing and a rekordbox USB deck. THRU or analogue sources do not gain remote transport control.'},
    ),
  },
  {
    id: 'mixer-master-level', ref: 12, surface: 'hardware', section: 'mixer',
    label: 'MASTER LEVEL', kind: 'knob', at: {x: 0.6237, y: 0.0872},
    primary: manual(
      'Sets the program level sent to MASTER 1 and MASTER 2',
      'MASTER LEVEL controls the summed program feeding the balanced MASTER 1 XLR and unbalanced MASTER 2 RCA outputs. Set it while reading the stereo master meter after channel gains, EQ, effects, sampler, and microphone have combined.',
      'Use it to match the controller to the venue system while preserving mixer headroom. Build clean channel levels first, then set the room feed with the system engineer rather than running the controller into clipping and turning the speakers down.',
      {gotcha: 'This does not control the BOOTH output. BOOTH MONITOR has an independent level knob for the DJ monitor.'},
    ),
  },
  {
    id: 'mixer-master-meter-clip', ref: 13, surface: 'hardware', section: 'mixer',
    label: 'MASTER METER + CLIP', kind: 'display', at: {x: 0.6228, y: 0.2551},
    primary: manual(
      'Shows the stereo master level and warns when the output clips',
      'The L/R master meter spans -24 to +15 dB as a stereo reading of the summed program. The CLIP light blinking slowly means the output is nearing distortion; fast blinking means the output is distorted. Multiple channels, boosts, sampler, microphones, and effects can push the sum over the limit.',
      'Read both sides during the loudest overlap, not only while one track plays. If CLIP flashes, reduce the gain feeding the sum—often channel TRIM, EQ boosts, or effect level—so the master retains transient punch instead of flattening into distortion.',
      {gotcha: 'Turning MASTER LEVEL down is not a complete cure for an overloaded mix bus; remove excessive gain earlier in the signal path as well.'},
    ),
  },
  {
    id: 'mixer-booth-monitor', ref: 14, surface: 'hardware', section: 'mixer',
    label: 'BOOTH MONITOR LEVEL', kind: 'knob', at: {x: 0.6237, y: 0.3917},
    primary: manual(
      'Sets the independent DJ-booth speaker level',
      'BOOTH MONITOR LEVEL controls the balanced booth output independently of MASTER LEVEL. It changes what the DJ hears from the monitor speaker without changing the level sent from MASTER 1 or MASTER 2 to the audience system.',
      'Turn the booth up only enough to hear timing and phrasing over the room, then lower it between checks to reduce fatigue. Independence lets the front-of-house engineer keep a stable audience level while you adapt the monitor to the booth.',
      {gotcha: 'The booth feed is for monitoring, not a second master-volume shortcut. Protect your hearing and leave the audience output alone.'},
    ),
  },
  {
    id: 'mixer-master-cue', ref: 15, surface: 'hardware', section: 'mixer',
    label: 'MASTER CUE', kind: 'button', at: {x: 0.6237, y: 0.4514},
    primary: manual(
      'Adds the master program to the headphone monitor',
      'MASTER CUE sends the master program to the headphone monitoring section. You hear it when HEADPHONES MIXING is moved toward MASTER; channel and sampler CUE selections remain available on the CUE side.',
      'Use it to compare the private incoming track with the exact program leaving the mixer, especially when booth speakers are delayed or coloured. A quick CUE-to-MASTER sweep exposes timing and level differences without touching the audience mix.',
      {gotcha: 'MASTER CUE does not turn the master outputs on or off. It only makes that program available to the headphone mix.'},
    ),
  },
  {
    id: 'mixer-headphones-level', ref: 16, surface: 'hardware', section: 'mixer',
    label: 'HEADPHONES LEVEL', kind: 'knob', at: {x: 0.3717, y: 0.8276},
    primary: manual(
      'Sets the final headphone listening volume',
      'HEADPHONES LEVEL controls the volume reaching both front headphone sockets after the CUE/MASTER blend. It does not change any channel, master, or booth output level, so it is purely your personal monitoring gain.',
      'Start low, put the headphones on, then raise only until beats and details are clear. Keeping this separate from MIXING prevents a louder cue from being mistaken for a better cue and reduces the temptation to chase a loud booth with unsafe headphone level.',
      {gotcha: 'Protect your ears: lower this control before plugging in, swapping headphones, or handing them to someone else.'},
    ),
  },
  {
    id: 'mixer-headphones-mixing', ref: 17, surface: 'hardware', section: 'mixer',
    label: 'HEADPHONES MIXING', kind: 'knob', at: {x: 0.3717, y: 0.7394},
    primary: manual(
      'Balances selected CUE sources against the master in headphones',
      'Turn toward CUE to hear channels and the sampler whose CUE buttons are selected; turn toward MASTER to hear the master program when MASTER CUE is on. The centre lets you compare private preparation with the audience program in one headset.',
      'Lean toward CUE while finding a beat or setting gain, then move toward MASTER to check the transition in context. This comparison is independent of the booth speaker, so delay in the room cannot pull your beatmatch late.',
      {gotcha: 'The knob cannot create a source: select at least one channel or sampler CUE, and enable MASTER CUE if you want the master side.'},
    ),
  },
  {
    id: 'mixer-sampler-vol', ref: 18, surface: 'hardware', section: 'mixer',
    label: 'SAMPLER VOL', kind: 'knob', at: {x: 0.3717, y: 0.6429},
    primary: manual(
      'Sets the overall level of the rekordbox sampler',
      'SAMPLER VOL is the overall sampler control: it raises or lowers the sampler as a whole before it joins the program mix. Individual sample-slot levels may differ in rekordbox, but this hardware knob is the practical master level for all sampler playback.',
      'Set it with the loudest loaded sample before the set, then use it to place drops, one-shots, or loops behind the music instead of letting them overpower a calibrated channel. Leave headroom for samples that layer on a full master mix.',
      {gotcha: 'A hot sample can clip the summed master even when every deck channel meter looks healthy; watch the master meter while testing it.'},
    ),
  },
  {
    id: 'mixer-sampler-cue', ref: 19, surface: 'hardware', section: 'mixer',
    label: 'SAMPLER CUE', kind: 'button', at: {x: 0.3717, y: 0.5859},
    primary: manual(
      'Adds the rekordbox sampler to the headphone cue mix',
      'SAMPLER CUE makes sampler playback available on the CUE side of HEADPHONES MIXING. It lets you audition the sampler in headphones while keeping its relationship to the program under your monitoring controls.',
      'Cue the sampler before a set-piece transition to confirm the right bank, slot, timing, and level without relying on memory. Compare it with MASTER in the headphones before committing the sample to a crowded phrase.',
      {gotcha: 'This is a monitoring selection, not a sample trigger and not a mute for the sampler output.'},
    ),
  },
  {
    id: 'mixer-mic-low', ref: 21, surface: 'hardware', section: 'mixer',
    label: 'MIC EQ LOW', kind: 'knob', at: {x: 0.3717, y: 0.3935},
    primary: manual(
      'Shapes low frequencies for both microphone inputs',
      'The shared MIC LOW EQ moves from +12 dB boost to -12 dB cut around 100 Hz for both MIC 1 and MIC 2. Centre is neutral; it changes microphone tone after their individual level controls, not the music-channel EQ.',
      'Reduce LOW when speech sounds boomy from proximity, handling noise, or a resonant booth. A modest cut usually improves intelligibility and preserves master headroom better than turning the whole microphone down.',
      {gotcha: 'This one control affects both microphone inputs. A correction that helps one mic may thin the other, so check both before an event.'},
    ),
  },
  {
    id: 'mixer-mic-high', ref: 22, surface: 'hardware', section: 'mixer',
    label: 'MIC EQ HI', kind: 'knob', at: {x: 0.3717, y: 0.3096},
    primary: manual(
      'Shapes high frequencies for both microphone inputs',
      'The shared MIC HI EQ moves from +12 dB boost to -12 dB cut around 10 kHz for both MIC 1 and MIC 2. Centre is neutral; it changes the brightness and air of speech without replacing proper level setting.',
      'Trim HI when sibilance or feedback-prone brightness makes announcements harsh, or add a small amount when a dull microphone needs clarity. Judge it through the actual PA because booth monitoring can hide room reflections.',
      {gotcha: 'This one control affects both microphone inputs, so avoid solving one voice by making the second mic unnaturally bright or dark.'},
    ),
  },
  {
    id: 'mixer-mic2-level', ref: 23, surface: 'hardware', section: 'mixer',
    label: 'MIC 2 LEVEL', kind: 'knob', at: {x: 0.3717, y: 0.2288},
    primary: manual(
      'Sets the input level for the MIC 2 TRS socket',
      'MIC 2 LEVEL controls the microphone connected to the rear 1/4-inch TRS MIC 2 input. It is independent of MIC 1 LEVEL, while both microphones share the MIC HI and LOW EQ and the OFF/ON/TALK OVER switch.',
      'Set MIC 2 from the loudest expected voice before it is needed, leaving space for excited speech. Independent gain is essential when a guest microphone has different sensitivity from the host mic.',
      {gotcha: 'Lower this level before connecting, disconnecting, or handing over a live microphone to avoid a sudden burst through the PA.'},
    ),
  },
  {
    id: 'mixer-mic1-level', ref: 24, surface: 'hardware', section: 'mixer',
    label: 'MIC 1 LEVEL', kind: 'knob', at: {x: 0.3717, y: 0.1507},
    primary: manual(
      'Sets the input level for the MIC 1 combo socket',
      'MIC 1 LEVEL controls the microphone connected to the rear MIC 1 combo XLR and 1/4-inch input. It is independent of MIC 2 LEVEL, while both microphones share the same HI/LOW EQ and operating switch.',
      'Calibrate MIC 1 with the person speaking at performance volume, not a quiet check voice. Clear speech with headroom avoids the distortion and feedback risk that comes from trying to fix a weak setup by pushing the master.',
      {gotcha: 'This level knob is not the microphone on/off switch. Use OFF before changing cables or when the mic must be guaranteed silent.'},
    ),
  },
  {
    id: 'mixer-mic-mode', ref: 25, surface: 'hardware', section: 'mixer',
    label: 'MIC OFF / ON / TALK OVER', kind: 'switch', at: {x: 0.3717, y: 0.0908},
    primary: manual(
      'Turns the microphones off, on, or enables automatic talkover',
      'OFF mutes the microphone section. ON passes it normally and the microphone indicator stays solid. TALK OVER makes the indicator flash; by default, mic input at -10 dB or higher attenuates non-mic sound by -18 dB. Normal mode broadly reduces the program, while configurable Advanced mode mainly reduces its midrange.',
      'Use ON when you want full manual control over speech and music. Use TALK OVER for repeated announcements where automatic space is helpful, but sound-check the threshold and attenuation first so room noise does not duck the music or the drop is not startling.',
      {gotcha: 'Talkover changes the music automatically whenever the microphone crosses its threshold. OFF is the safest position when the microphone is unattended.'},
    ),
  },
];

export const mixerControls: Control[] = [
  ...CHANNELS.flatMap(makeChannelControls),
  ...globalControls,
];

export const mixerSignalFlow =
  'Source → TRIM → EQ → Sound Color FX through COLOR → pre-fader meter and headphone CUE branch → channel fader → crossfader assign → crossfader when assigned A or B → master bus → MASTER LEVEL → MASTER 1 and MASTER 2. BOOTH branches independently before MASTER LEVEL. Channel, sampler, and master cue selections meet at HEADPHONES MIXING, then HEADPHONES LEVEL.';

export const mixerGainGuide =
  'Six controls answer six different questions: TRIM calibrates one source before the fader; the channel fader performs that source’s level; the crossfader blends only A/B-assigned channels; MASTER LEVEL feeds the audience outputs; BOOTH MONITOR sets the DJ speaker independently; HEADPHONES LEVEL protects and sets your private monitor.';
