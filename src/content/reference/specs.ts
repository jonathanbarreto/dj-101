export interface IoPort extends Record<string, unknown> {
  name: string;
  count: number;
  location: 'rear' | 'front';
  note: string;
}

export interface SpecificationRow extends Record<string, unknown> {
  specification: string;
  value: string;
  note: string;
}

export interface SpecificationGroup {
  title: string;
  rows: SpecificationRow[];
}

export const specifications = {
  dimensionsMm: {width: 708, height: 73.4, depth: 361.4},
  weightKg: 6,
  power: {dcVolts: 12, currentMa: 2000, adapterRatedOutputAmps: 3},
  operatingRange: {temperatureC: '5 to 35', humidityPercent: '5 to 85, non-condensing'},
  audio: {
    samplingRateKhz: 44.1,
    daConverterBits: 32,
    adConverterBits: 24,
    frequencyResponse: '20 Hz–20 kHz (USB, LINE, MIC 1, MIC 2)',
    usbSignalToNoiseDb: 112,
    lineSignalToNoiseDb: 96,
    phonoSignalToNoiseDb: 85,
    micSignalToNoiseDb: 80,
    usbTotalHarmonicDistortionPercent: 0.002,
    lineTotalHarmonicDistortionPercent: 0.005,
    lineCrosstalkDb: 82,
  },
  channelEq: {minDb: -26, maxDb: 6, isFullKill: true},
  microphoneEq: {minDb: -12, maxDb: 12},
  bitDepthCorrection:
    'The 32-bit figure is the D/A converter specification. It is not a streaming, file, or processing bit depth; the controller operates at 44.1 kHz only, and its A/D converter is 24-bit.',
  io: [
    {name: 'LINE input (RCA)', count: 2, location: 'rear', note: 'Line-level sources on channels 1 and 2.'},
    {name: 'LINE/PHONO input (RCA)', count: 2, location: 'rear', note: 'Switchable line or turntable inputs on channels 3 and 4.'},
    {name: 'MIC 1 input (XLR / 1/4-inch TRS combo)', count: 1, location: 'rear', note: 'Balanced microphone connection.'},
    {name: 'MIC 2 input (1/4-inch TRS)', count: 1, location: 'rear', note: 'Second microphone connection.'},
    {name: 'MASTER 1 output (XLR)', count: 1, location: 'rear', note: 'Balanced main output.'},
    {name: 'MASTER 2 output (RCA)', count: 1, location: 'rear', note: 'Unbalanced main output.'},
    {name: 'BOOTH output (1/4-inch TRS)', count: 1, location: 'rear', note: 'Balanced booth-monitor output.'},
    {name: 'PHONES output (1/4-inch stereo)', count: 1, location: 'front', note: 'Full-size headphone connection.'},
    {name: 'PHONES output (3.5 mm stereo mini)', count: 1, location: 'front', note: 'Mini headphone connection; both headphone sockets carry the same cue mix.'},
    {name: 'USB-B terminal', count: 2, location: 'rear', note: 'Dual-computer connection for DJ changeovers.'},
  ] satisfies IoPort[],
} as const;

export const specificationGroups: SpecificationGroup[] = [
  {
    title: 'Physical and power',
    rows: [
      {specification: 'Dimensions', value: '708 × 73.4 × 361.4 mm (W × H × D)', note: 'Full-size four-channel controller.'},
      {specification: 'Main-unit weight', value: '6.0 kg', note: '13.4 lb.'},
      {specification: 'Main-unit power', value: 'DC 12 V, 2,000 mA', note: 'External adapter; rated adapter output is DC 12 V, 3 A.'},
      {specification: 'Operating range', value: '5–35 °C; 5–85% RH', note: 'Humidity rating assumes no condensation.'},
    ],
  },
  {
    title: 'Digital and audio performance',
    rows: [
      {specification: 'Sampling rate', value: '44.1 kHz', note: 'The controller supports this sampling rate only.'},
      {specification: 'Converters', value: '32-bit D/A; 24-bit A/D', note: 'Converter resolution—not media or processing bit depth.'},
      {specification: 'Frequency response', value: '20 Hz–20 kHz', note: 'Specified for USB, LINE, MIC 1, and MIC 2.'},
      {specification: 'Signal-to-noise ratio', value: 'USB 112 dB; LINE 96 dB; PHONO 85 dB; MIC 1/2 80 dB', note: 'Rated output, A-weighted.'},
      {specification: 'Total harmonic distortion', value: 'USB 0.002%; LINE 0.005%', note: 'Measured from 20 Hz to 20 kHz bandwidth.'},
      {specification: 'LINE crosstalk', value: '82 dB', note: 'Separation between line channels.'},
    ],
  },
  {
    title: 'Level and equalizer ranges',
    rows: [
      {specification: 'Channel EQ', value: '−26 to +6 dB', note: 'HI at 20 kHz, MID at 1 kHz, LOW at 20 Hz; −26 dB is full kill.'},
      {specification: 'Microphone EQ', value: '−12 to +12 dB', note: 'HI at 10 kHz and LOW at 100 Hz.'},
      {specification: 'Standard input level / impedance', value: 'LINE −12 dBu / 47 kΩ; PHONO −52 dBu / 47 kΩ; MIC 1/2 −57 dBu / 3.3 kΩ', note: 'Nominal input specifications.'},
      {specification: 'Standard output level / load', value: 'MASTER 1 +6 dBu / 10 kΩ; MASTER 2 +2 dBu / 10 kΩ; BOOTH +6 dBu / 10 kΩ; PHONES +8 dBu / 32 Ω', note: 'Output impedance: MASTER 1 and BOOTH ≤330 Ω; MASTER 2 ≤680 Ω; PHONES ≤10 Ω.'},
      {specification: 'Rated output level / load', value: 'MASTER 1 25 dBu / 10 kΩ; MASTER 2 21 dBu / 10 kΩ; BOOTH 25 dBu / 10 kΩ', note: 'Maximum rated output figures.'},
    ],
  },
];
