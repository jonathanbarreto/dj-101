export type Surface = 'hardware' | 'software';

export type SectionId =
  | 'deck-left' | 'deck-right' | 'mixer' | 'fx' | 'browser'
  | 'rb-command' | 'rb-fx' | 'rb-waveform' | 'rb-deck' | 'rb-mixer'
  | 'rb-record' | 'rb-sampler' | 'rb-lighting' | 'rb-palette'
  | 'rb-sources' | 'rb-tracklist';

/** Source of a behavioral claim. 'virtualdj' is banned in shipped content. */
export type SourceTag = 'manual' | 'rekordbox7' | 'virtualdj' | 'community';

/** Normalized point in master-image space. Both axes 0..1. */
export interface Point { x: number; y: number; }
/** Normalized rectangle in master-image space. */
export interface Rect { x: number; y: number; w: number; h: number; }

export interface Behavior {
  /** One line. Popover header. No trailing period. */
  summary: string;
  /** What it does, mechanically. Markdown. */
  detail: string;
  /** When and why you'd reach for it. Markdown. The point of this site. */
  why: string;
  tips?: string[];
  /** A misconception this control commonly causes. */
  gotcha?: string;
  source: SourceTag;
  /** rekordbox 7 plan gating, where it applies. */
  tier?: 'free' | 'subscription';
}

export type ControlKind =
  | 'button' | 'knob' | 'fader' | 'jog' | 'pad' | 'switch'
  | 'display' | 'jack' | 'panel' | 'field' | 'menu';

export interface Control {
  /** Stable, URL-addressable. Convention: `<section>-<slug>`. */
  id: string;
  /** VirtualDJ manual reference number. Structure only — never cite its behavior. */
  ref?: number;
  surface: Surface;
  section: SectionId;
  /** As printed on the unit, or as labelled in rekordbox. */
  label: string;
  /** The grey silk-screened SHIFT legend, where present. */
  shiftLegend?: string;
  kind: ControlKind;
  /** Position in master-image space. */
  at: Point;
  primary: Behavior;
  shift?: Behavior;
  related?: string[];
  /** Cross-surface link: hardware ⇄ software control ids. */
  counterpart?: string[];
  /** Curated routes to reference tables or deeper lessons; not control-id links. */
  referenceLinks?: Array<{
    href: `/reference/${string}`;
    label: string;
  }>;
}

export interface SurfaceSpec {
  id: Surface;
  /** Path under /public. */
  image: string;
  /** Intrinsic pixel size of the master image. */
  naturalWidth: number;
  naturalHeight: number;
  label: string;
  credit?: string;
}

export interface SectionSpec {
  id: SectionId;
  surface: Surface;
  label: string;
  /** Crop rect on the surface's master image. */
  rect: Rect;
  /** Where the section's marker sits on the overview. */
  marker: Point;
}
