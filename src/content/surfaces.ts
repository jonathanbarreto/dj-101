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

// Hardware crops were measured from the 3129x1652 overhead DDJ-1000 master.
// Rear/front are intentionally full-image placeholders: this top-down product shot
// does not depict those elevations, so a precise crop would be misleading.
// rekordbox values were measured from the master image.
export const SECTIONS: Record<SectionId, SectionSpec> = {
  'deck-left':  {id:'deck-left',  surface:'hardware', label:'Left deck',  rect:{x:0.0070,y:0.0220,w:0.3240,h:0.9560}, marker:{x:0.1690,y:0.5000}},
  'deck-right': {id:'deck-right', surface:'hardware', label:'Right deck', rect:{x:0.6690,y:0.0220,w:0.3240,h:0.9560}, marker:{x:0.8310,y:0.5000}},
  'mixer':      {id:'mixer',      surface:'hardware', label:'Mixer',      rect:{x:0.3320,y:0.0220,w:0.2960,h:0.9560}, marker:{x:0.4800,y:0.5000}},
  'fx':         {id:'fx',         surface:'hardware', label:'Beat FX',    rect:{x:0.5720,y:0.3200,w:0.0550,h:0.5820}, marker:{x:0.5995,y:0.6110}},
  'browser':    {id:'browser',    surface:'hardware', label:'Browser',    rect:{x:0.2670,y:0.1050,w:0.0640,h:0.1200}, marker:{x:0.2990,y:0.1650}},
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
