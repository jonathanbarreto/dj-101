import type {SectionId, SectionSpec, Surface, SurfaceSpec} from './types';

export const SURFACES: Record<Surface, SurfaceSpec> = {
  hardware: {
    id: 'hardware',
    image: '/images/ddj1000-master.avif',
    naturalWidth: 3129,
    naturalHeight: 1652,
    label: 'Pioneer DJ DDJ-1000',
    credit: 'Product image © AlphaTheta Corporation / Pioneer DJ, used for educational identification.',
  },
  software: {
    id: 'software',
    image: '/images/rekordbox-master.avif',
    naturalWidth: 2880,
    naturalHeight: 1800,
    label: 'rekordbox 7 — Performance mode',
  },
};

// Hardware values are placeholders corrected in Task 4.
// rekordbox values were measured from the master image.
export const SECTIONS: Record<SectionId, SectionSpec> = {
  'deck-left':  {id:'deck-left',  surface:'hardware', label:'Left deck',  rect:{x:0,    y:0,    w:0.30, h:1},    marker:{x:0.15, y:0.5}},
  'deck-right': {id:'deck-right', surface:'hardware', label:'Right deck', rect:{x:0.70, y:0,    w:0.30, h:1},    marker:{x:0.85, y:0.5}},
  'mixer':      {id:'mixer',      surface:'hardware', label:'Mixer',      rect:{x:0.30, y:0,    w:0.40, h:1},    marker:{x:0.50, y:0.5}},
  'fx':         {id:'fx',         surface:'hardware', label:'Beat FX',    rect:{x:0.56, y:0.25, w:0.14, h:0.6},  marker:{x:0.63, y:0.55}},
  'browser':    {id:'browser',    surface:'hardware', label:'Browser',    rect:{x:0.22, y:0,    w:0.14, h:0.3},  marker:{x:0.29, y:0.15}},
  'rear':       {id:'rear',       surface:'hardware', label:'Rear panel', rect:{x:0,    y:0,    w:1,    h:1},    marker:{x:0.5,  y:0.05}},
  'front':      {id:'front',      surface:'hardware', label:'Front panel',rect:{x:0,    y:0,    w:1,    h:1},    marker:{x:0.5,  y:0.95}},
  'rb-command':   {id:'rb-command',   surface:'software', label:'Command panel',    rect:{x:0,    y:0,     w:1,    h:0.047}, marker:{x:0.5,  y:0.024}},
  'rb-fx':        {id:'rb-fx',        surface:'software', label:'FX panel',         rect:{x:0,    y:0.047, w:1,    h:0.082}, marker:{x:0.5,  y:0.088}},
  'rb-waveform':  {id:'rb-waveform',  surface:'software', label:'Waveforms',        rect:{x:0,    y:0.129, w:1,    h:0.139}, marker:{x:0.5,  y:0.198}},
  'rb-deck':      {id:'rb-deck',      surface:'software', label:'Player deck',      rect:{x:0,    y:0.268, w:0.48, h:0.265}, marker:{x:0.24, y:0.40}},
  'rb-mixer':     {id:'rb-mixer',     surface:'software', label:'Mixer',            rect:{x:0.48, y:0.268, w:0.07, h:0.308}, marker:{x:0.515,y:0.42}},
  'rb-record':    {id:'rb-record',    surface:'software', label:'Record panel',     rect:{x:0.79, y:0.533, w:0.21, h:0.043}, marker:{x:0.89, y:0.555}},
  'rb-sampler':   {id:'rb-sampler',   surface:'software', label:'Sampler',          rect:{x:0,    y:0.576, w:1,    h:0.105}, marker:{x:0.5,  y:0.628}},
  'rb-lighting':  {id:'rb-lighting',  surface:'software', label:'Lighting',         rect:{x:0,    y:0.681, w:1,    h:0.048}, marker:{x:0.5,  y:0.705}},
  'rb-palette':   {id:'rb-palette',   surface:'software', label:'Playlist palette', rect:{x:0,    y:0.729, w:1,    h:0.025}, marker:{x:0.5,  y:0.741}},
  'rb-sources':   {id:'rb-sources',   surface:'software', label:'Sources',          rect:{x:0,    y:0.754, w:0.13, h:0.246}, marker:{x:0.065,y:0.877}},
  'rb-tracklist': {id:'rb-tracklist', surface:'software', label:'Track list',       rect:{x:0.13, y:0.754, w:0.87, h:0.246}, marker:{x:0.56, y:0.877}},
};
