import type {SourceTag} from '../types';

export type ConnectionPanel = 'rear' | 'front';

export interface ConnectionLesson extends Record<string, unknown> {
  id: string;
  ref?: number;
  panel: ConnectionPanel;
  label: string;
  connector: string;
  balance: string;
  governedBy: string;
  why: string;
  setup: string;
  failure: string;
  safety: string;
  source: Extract<SourceTag, 'manual'>;
}

export interface LessonStep {
  label: string;
  description: string;
}

export interface SetupRecipe {
  name: string;
  goal: string;
  steps: string[];
}

export const connectionLessons: ConnectionLesson[] = [
  {
    id: 'front-phones', ref: 70, panel: 'front', label: 'PHONES',
    connector: '1/4-inch stereo jack and 3.5 mm stereo mini jack',
    balance: 'Stereo headphone output; not a balanced line output',
    governedBy: 'HEADPHONES MIXING, HEADPHONES LEVEL, channel CUE and MASTER CUE',
    why: 'The two socket sizes carry the same cue mix, letting you use common DJ headphones without making an adapter the weak point of the performance.',
    setup: 'Use one socket that matches your headphone plug, select a channel CUE, blend CUE and MASTER, then raise HEADPHONES LEVEL gradually.',
    failure: 'Both sockets carry the same headphone bus, so plugging into the second socket does not create a separate monitor mix.',
    safety: 'Start with HEADPHONES LEVEL down and protect your hearing from sudden peaks.',
    source: 'manual',
  },
  {
    id: 'rear-master-1', ref: 71, panel: 'rear', label: 'MASTER 1',
    connector: 'XLR output pair',
    balance: 'Balanced stereo line output',
    governedBy: 'MASTER LEVEL',
    why: 'This is the preferred long-cable feed to a professional PA or venue mixer because a balanced run rejects interference.',
    setup: 'With MASTER LEVEL down, connect left and right XLR cables to balanced line inputs, power the destination, then raise level during soundcheck.',
    failure: 'Connecting only one side gives a mono-sided feed, while feeding microphone inputs can overload their more sensitive preamps.',
    safety: 'Never connect MASTER 1 to a terminal that can supply phantom power; the manual warns that equipment can be damaged.',
    source: 'manual',
  },
  {
    id: 'rear-master-2', ref: 72, panel: 'rear', label: 'MASTER 2',
    connector: 'RCA output pair',
    balance: 'Unbalanced stereo line output',
    governedBy: 'MASTER LEVEL',
    why: 'Use MASTER 2 for short runs to consumer speakers, recorders, or systems whose available line input is RCA.',
    setup: 'With MASTER LEVEL down, connect the white left and red right RCA plugs to a line-level input, then bring up gain slowly.',
    failure: 'A long unbalanced RCA run can collect hum or interference, and a phono input will apply the wrong gain and equalization.',
    safety: 'Mute or lower the destination before plugging RCA connectors to avoid loud transients.',
    source: 'manual',
  },
  {
    id: 'rear-booth', ref: 73, panel: 'rear', label: 'BOOTH',
    connector: '1/4-inch TRS output pair',
    balance: 'Balanced stereo line output',
    governedBy: 'BOOTH MONITOR LEVEL',
    why: 'Its independent level lets the DJ change booth loudness without disturbing the audience feed controlled by MASTER LEVEL.',
    setup: 'Connect left and right TRS cables to powered booth monitors or their amplifier, start low, and set only enough level to cue accurately.',
    failure: 'A TS cable may still pass audio but loses the noise rejection of the balanced TRS connection on a long run.',
    safety: 'Lower BOOTH MONITOR LEVEL before connecting or powering monitors to prevent a sudden blast.',
    source: 'manual',
  },
  {
    id: 'rear-signal-gnd', ref: 74, panel: 'rear', label: 'SIGNAL GND',
    connector: 'Turntable grounding terminal',
    balance: 'Ground reference; it does not carry program audio',
    governedBy: 'No level control',
    why: 'A turntable ground wire gives the phono preamp a shared reference and commonly removes the low electrical hum heard otherwise.',
    setup: 'Attach the turntable ground lead securely to SIGNAL GND before raising the channel, alongside its RCA connection to channel 3 or 4.',
    failure: 'A loose or missing turntable ground often produces steady hum even when the record itself is quiet.',
    safety: 'Use this terminal only for a turntable signal ground, never protective mains earth.',
    source: 'manual',
  },
  {
    id: 'rear-ch4-line-phono', ref: 75, panel: 'rear', label: 'CH 4 LINE / PHONO',
    connector: 'RCA input pair with LINE/PHONO selector',
    balance: 'Unbalanced stereo input',
    governedBy: 'Rear LINE/PHONO selector, top-panel CH 4 input selector and CH 4 TRIM',
    why: 'Channel 4 can host either a normal line player or an MM turntable while leaving the central software decks available.',
    setup: 'For a moving-magnet (MM) turntable, connect RCA and ground, set the rear switch to PHONO, then select PHONO/LINE on channel 4; use LINE for a line player.',
    failure: 'A LINE/PHONO mismatch makes line audio painfully loud and distorted in PHONO, or makes a turntable extremely quiet and thin in LINE.',
    safety: 'Lower CH 4 before changing the rear selector or swapping the connected source.',
    source: 'manual',
  },
  {
    id: 'rear-ch2-line', ref: 76, panel: 'rear', label: 'CH 2 LINE',
    connector: 'RCA input pair',
    balance: 'Unbalanced stereo line input',
    governedBy: 'Top-panel CH 2 input selector and CH 2 TRIM',
    why: 'This dedicated line input accepts a CDJ, media player, or other line-level source on the central channel 2 strip.',
    setup: 'Connect the player by RCA, set the channel 2 selector to LINE, start TRIM down, then gain-stage from the channel meter.',
    failure: 'Channel 2 is not a phono input; a turntable requires a separate phono preamp or the PHONO setting on channel 3 or 4.',
    safety: 'Lower the channel fader before changing sources or connecting an RCA cable.',
    source: 'manual',
  },
  {
    id: 'rear-ch1-line', ref: 77, panel: 'rear', label: 'CH 1 LINE',
    connector: 'RCA input pair',
    balance: 'Unbalanced stereo line input',
    governedBy: 'Top-panel CH 1 input selector and CH 1 TRIM',
    why: 'This dedicated line input accepts a CDJ, media player, or other line-level source on the central channel 1 strip.',
    setup: 'Connect the player by RCA, set the channel 1 selector to LINE, start TRIM down, then gain-stage from the channel meter.',
    failure: 'Channel 1 is not a phono input; a turntable requires a separate phono preamp or the PHONO setting on channel 3 or 4.',
    safety: 'Lower the channel fader before changing sources or connecting an RCA cable.',
    source: 'manual',
  },
  {
    id: 'rear-ch3-line-phono', ref: 78, panel: 'rear', label: 'CH 3 LINE / PHONO',
    connector: 'RCA input pair with LINE/PHONO selector',
    balance: 'Unbalanced stereo input',
    governedBy: 'Rear LINE/PHONO selector, top-panel CH 3 input selector and CH 3 TRIM',
    why: 'Channel 3 can host either a normal line player or an MM turntable, making it the natural outside strip for vinyl.',
    setup: 'For a moving-magnet (MM) turntable, connect RCA and ground, set the rear switch to PHONO, then select PHONO/LINE on channel 3; use LINE for a line player.',
    failure: 'A LINE/PHONO mismatch makes line audio painfully loud and distorted in PHONO, or makes a turntable extremely quiet and thin in LINE.',
    safety: 'Lower CH 3 before changing the rear selector or swapping the connected source.',
    source: 'manual',
  },
  {
    id: 'rear-usb-b', ref: 79, panel: 'rear', label: 'USB B',
    connector: 'USB Type-B device terminal',
    balance: 'Digital audio, MIDI control and computer connection',
    governedBy: 'Per-channel USB A / input / USB B selectors and rekordbox audio settings',
    why: 'USB B names the second computer path, so another DJ can connect and prepare before any live channel is handed over.',
    setup: 'Connect this USB Type-B terminal directly to the second computer, open rekordbox, confirm the DDJ-1000 audio device, then assign only intended channels to USB B.',
    failure: 'The A and B labels identify computer assignments, not different connector shapes; both rear sockets are USB Type-B terminals.',
    safety: 'The manual says to connect directly without a USB hub; verify audio before moving a live selector.',
    source: 'manual',
  },
  {
    id: 'rear-usb-a', ref: 80, panel: 'rear', label: 'USB A',
    connector: 'USB Type-B device terminal',
    balance: 'Digital audio, MIDI control and computer connection',
    governedBy: 'Per-channel USB A / input / USB B selectors and rekordbox audio settings',
    why: 'USB A names one complete computer path and can remain live while a second DJ prepares independently on USB B.',
    setup: 'Connect this USB Type-B terminal directly to the first computer, open rekordbox, confirm the DDJ-1000 audio device, then assign intended channels to USB A.',
    failure: 'The A and B labels identify computer assignments, not different connector shapes; both rear sockets are USB Type-B terminals.',
    safety: 'The manual says to connect directly without a USB hub; verify audio before opening channel faders.',
    source: 'manual',
  },
  {
    id: 'rear-mic-2', ref: 81, panel: 'rear', label: 'MIC 2',
    connector: '1/4-inch TRS microphone input',
    balance: 'Balanced microphone input',
    governedBy: 'MIC 2 LEVEL, shared MIC HI/LOW EQ and OFF/ON/TALK OVER switch',
    why: 'MIC 2 adds a second microphone with independent input level while sharing the final microphone EQ and operating mode.',
    setup: 'Connect the microphone with MIC 2 LEVEL down, select ON only when needed, then raise its level while speaking at performance distance.',
    failure: 'Plugging a line-level device here can overload the microphone input, while leaving the mic switch OFF produces no output.',
    safety: 'Keep microphone level down while connecting and aim speakers away from the mic to limit feedback.',
    source: 'manual',
  },
  {
    id: 'rear-mic-1', ref: 82, panel: 'rear', label: 'MIC 1',
    connector: 'XLR / 1/4-inch TRS combo microphone input',
    balance: 'Balanced microphone input',
    governedBy: 'MIC 1 LEVEL, shared MIC HI/LOW EQ and OFF/ON/TALK OVER switch',
    why: 'The combo socket accepts the two professional microphone plug formats without consuming a channel-strip line input.',
    setup: 'Connect one XLR or 1/4-inch plug with MIC 1 LEVEL down, select ON only when needed, then gain it at speaking distance.',
    failure: 'The combo opening is one input, not two simultaneous MIC 1 inputs, and the common mic switch must be ON or TALK OVER.',
    safety: 'The DDJ-1000 does not provide microphone phantom power; use a compatible microphone or external supply.',
    source: 'manual',
  },
  {
    id: 'rear-power', ref: 83, panel: 'rear', label: 'POWER',
    connector: 'On / standby switch',
    balance: 'Not an audio connection',
    governedBy: 'Rear power switch',
    why: 'The switch starts or stops the controller only after the power and audio chain has been connected in a safe order.',
    setup: 'Connect the supplied adapter and audio cables first, power source devices and controller, then power amplifiers or active speakers last.',
    failure: 'Powering the controller after loud downstream speakers can send startup transients through the room system.',
    safety: 'Turn amplifiers or powered speakers off first during shutdown, then switch off the controller.',
    source: 'manual',
  },
  {
    id: 'rear-dc-in', ref: 84, panel: 'rear', label: 'DC IN',
    connector: '12 V DC power inlet',
    balance: 'Power connection; not an audio signal',
    governedBy: 'POWER switch',
    why: 'The external supply powers the controller reliably; USB connections alone are not the controller power source.',
    setup: 'With POWER off, connect the supplied AC adapter to DC IN, route its cable through the cord hook, then connect mains power.',
    failure: 'An incompatible adapter can provide the wrong voltage, polarity, or current and may prevent operation or damage the unit.',
    safety: 'Use the supplied AC adapter and unplug by the plug rather than pulling its cable.',
    source: 'manual',
  },
  {
    id: 'rear-kensington', panel: 'rear', label: 'Kensington security slot',
    connector: 'Kensington-compatible cable-lock slot',
    balance: 'Mechanical security point; no signal',
    governedBy: 'The attached third-party security cable',
    why: 'A compatible lock can deter opportunistic removal when the controller must remain at a booth or installation.',
    setup: 'Attach a compatible Kensington-style lock according to its maker instructions and anchor the cable to a fixed object.',
    failure: 'The slot does not secure loose cables, laptops, or accessories and cannot replace responsible supervision.',
    safety: 'Route the security cable where performers and audience members cannot trip over it.',
    source: 'manual',
  },
  {
    id: 'rear-cord-hook', panel: 'rear', label: 'Cord hook',
    connector: 'Power-cable strain-relief hook',
    balance: 'Mechanical cable support; no signal',
    governedBy: 'Power-cable routing',
    why: 'Looping the adapter cable through the hook makes an accidental pull less likely to unplug the controller during a set.',
    setup: 'Route the supplied adapter cable around the cord hook without a sharp bend, then insert its plug fully into DC IN.',
    failure: 'Skipping the hook leaves the DC plug carrying the force of every cable tug and movement.',
    safety: 'Leave enough slack for strain relief and never lift the controller by its cable.',
    source: 'manual',
  },
];

export const dualUsbSignalFlow: LessonStep[] = [
  {label: 'Laptop A or B', description: 'Each computer runs its own rekordbox session and sends its own audio channels to the controller.'},
  {label: 'Matching rear USB terminal', description: 'USB A and USB B are assignment labels on two identical USB Type-B device terminals.'},
  {label: 'Per-channel input selector', description: 'Each hardware channel independently chooses USB A, its analogue input, or USB B.'},
  {label: 'Channel signal path', description: 'The selected source then passes through that strip’s TRIM, EQ, Color FX, CUE and fader.'},
  {label: 'Master and booth outputs', description: 'Mixed channels share the same master and booth outputs; the sockets do not transfer tracks or rekordbox state between laptops.'},
];

export const dualUsbChangeoverSteps: string[] = [
  'Connect the incoming laptop directly to the unused USB terminal without a hub.',
  'Open rekordbox on the incoming laptop and select the DDJ-1000 audio device before touching a live channel.',
  'Load and cue a track on an unused deck, then verify it privately with that channel’s CUE and the headphones.',
  'Confirm the incoming channel selector points to that laptop and set its TRIM with the channel fader closed.',
  'Bring in the verified source and hand over one channel at a time; do not switch a channel carrying audible program audio.',
  'Confirm the mix is still reaching both master and booth outputs after the last live channel moves.',
  'Only after every required channel is safely on the incoming laptop, close the outgoing rekordbox session and disconnect its USB cable.',
];

export const setupRecipes: SetupRecipe[] = [
  {
    name: 'Laptop and powered speakers',
    goal: 'A minimal home or small-room rekordbox setup using the balanced master output.',
    steps: ['Connect the laptop directly to USB A.', 'Connect MASTER 1 XLR to the speakers’ line inputs.', 'Start levels down; power the controller before the speakers.', 'Set channel TRIM, then MASTER LEVEL.'],
  },
  {
    name: 'Laptop, PA and booth monitor',
    goal: 'Separate audience and DJ-monitor levels.',
    steps: ['Send MASTER 1 XLR to the PA.', 'Send BOOTH TRS to the booth monitors.', 'Set MASTER LEVEL for the room and BOOTH MONITOR LEVEL independently for the DJ.'],
  },
  {
    name: 'Two-laptop changeover',
    goal: 'Prepare the next DJ without silencing the current one.',
    steps: ['Connect the current laptop to USB A and incoming laptop to USB B.', 'Verify the incoming deck in headphones.', 'Move only a quiet, prepared channel selector at each handoff step.'],
  },
  {
    name: 'Turntable on channel 3',
    goal: 'Play a moving-magnet record source through a phono-capable outside strip.',
    steps: ['Connect the turntable RCA to CH 3 LINE/PHONO.', 'Attach its ground wire to SIGNAL GND.', 'Set the rear switch to PHONO and the top selector to PHONO/LINE.', 'Start CH 3 TRIM down, then meter the record.'],
  },
  {
    name: 'Line player on channel 1',
    goal: 'Add a CDJ or other line-level source.',
    steps: ['Connect the player RCA to CH 1 LINE.', 'Set the channel 1 selector to LINE.', 'Start TRIM down and set gain from the channel meter.'],
  },
  {
    name: 'Microphone and headphones',
    goal: 'Monitor a mix and make controlled announcements.',
    steps: ['Connect one microphone to MIC 1 or MIC 2 with its level down.', 'Connect headphones to either front socket.', 'Set CUE/MASTER monitoring before raising headphone level.', 'Switch the microphone ON only when needed and raise its level carefully.'],
  },
];

export const shutdownOrder: string[] = [
  'Bring channel faders and output levels down.',
  'Switch off amplifiers, powered speakers, and booth monitors first.',
  'Switch microphones off and close rekordbox after saving any needed work.',
  'Move the rear POWER switch to standby and disconnect audio or USB cables only when quiet.',
  'Unplug the controller’s supplied adapter from mains if the setup is being packed away.',
];

export function connectionsForPanel(panel: ConnectionPanel): ConnectionLesson[] {
  return connectionLessons.filter((lesson) => lesson.panel === panel);
}
