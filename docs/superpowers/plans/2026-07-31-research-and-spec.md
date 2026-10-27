# DDJ-1000 + rekordbox 7 — Research & Spec

**Date:** 2026-07-31
**Status:** Research complete; implementation plan approved
**Companion document:** `2026-07-31-implementation-plan.md`

---

## 1. Purpose

Publish an interactive site that explains the Pioneer DJ DDJ-1000 and the rekordbox 7 UI — not just *what* each control is, but *how and why* you'd reach for it. Interaction is a real image with pulsing dots over each element; clicking a dot opens a popover.

### The gap this fills

- **Pioneer's entire official tutorial output is 6 videos totalling 9m51s** — and it is a launch-feature highlight reel, not a curriculum. Zero coverage of setup, beatmatching, EQ, looping, pad modes, or FX fundamentals.
- **The manual is a parts list with no teaching.** It names every control and describes its mechanism, but never says when you'd use it.
- **Every existing resource describes 2018 hardware against 2018 software.** The DDJ-1000 manual predates rekordbox 6 and 7 entirely.

Nothing sits in between. That is the opportunity.

---

## 2. Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Controller art | Real photography | Chosen over SVG redraw |
| Hero image | One master image per surface; sections are CSS crops | Guarantees zoom continuity; see §7 |
| Navigation | Overview → zoom to section → hotspots → popover | |
| v1 scope | Hardware deck section, full depth + the rekordbox deck panel it drives | Complete story, small surface |
| Software | **rekordbox 7 (7.214) only** | No VirtualDJ, no Serato, no toggle |
| Mode | **Performance mode only** | Site is about performing, not library prep |
| Design system | Astryx (`@astryxdesign/core`) as an npm dependency | |
| Features in v1 | SHIFT layer toggle · reference tables | |
| Features deferred | Guided lessons · signal flow view | Sequencing, not a drop |

---

## 3. Hardware: DDJ-1000

4-channel performance controller for rekordbox dj. Released 2018. Model code DRH1656B. Brand now under AlphaTheta.

### Structure

Pioneer's manual divides the top panel into **three** sections: Browser, Deck (×2), Mixer. Beat FX and Sound Color FX are formally *part of the mixer section* in Pioneer's numbering, though they are worth splitting out for teaching.

**Physical channel-strip order is `3 · 1 · 2 · 4`** — club convention, decks 1 and 2 nearest the crossfader. **CH3 and CH4 are the phono-capable pair**; CH1 and CH2 are line-level only.

### Control numbering

Adopted from VirtualDJ's manual **for structure only** — never for behavior (see §5):
- `1–31` mixer & FX
- `32–55` deck
- `71–85` front/rear
- Zones `A`–`E`

### Deck section (controls 32–55)

Two physical decks drive four software decks. Left side controls decks 1 and 3, right side 2 and 4. DECK SELECT is labelled `3/1` and `2/4`.

| Control | Primary | SHIFT |
|---|---|---|
| Jog dial | Top with vinyl on: scratch. Outer ring, or top with vinyl off: pitch bend | Top: beat grid BPM adjust. Outer: slide the whole grid |
| QUANTIZE | Snap hot cues/loops to the nearest beat | WAKE UP (exit auto-standby) |
| SLIP | Slip mode on/off | **VINYL mode on/off** |
| JOG FEELING ADJUST | Jog resistance, LIGHT ↔ HEAVY | — |
| BEAT SYNC | Sync tempo and beat grid to master | Set this deck as master |
| MASTER TEMPO | Key lock | Cycle tempo range: ±6 / ±10 / ±16 / WIDE |
| TEMPO slider | Playback speed (100mm fader) | — |
| HOT CUE | Hot cue pad mode | Keyboard mode |
| PAD FX1 | Pad FX mode 1 | Pad FX mode 2 |
| BEAT JUMP | Beat jump mode | Beat loop mode |
| SAMPLER | Sampler mode | Key shift mode |
| PAGE ◄ ► | Pad page (→ 16 hot cues/deck) | Sampler bank |
| KEY SYNC | Match key to source, or dominant/subdominant | — |
| KEY RESET | Restore original key | — |
| PLAY/PAUSE | Play or pause | — |
| CUE | Set, call, play cue point | — |
| SEARCH ◄◄ ►► | Track search; hold to fast-forward/rewind | Cue/loop call |
| MEMORY | Store cue and loop points | Delete stored points |
| DECK selector | Switch which deck this side drives | — |
| SLIP REVERSE | Reverse while held, resume advanced position | REVERSE (latched) |
| LOOP IN · 1/2X | Set loop-in; during a loop, halve it | In adjust (fine-tune with jog) |
| LOOP OUT · 2X | Set loop-out and start loop; during a loop, double it | Out adjust / reloop |
| 4 BEAT LOOP/EXIT | 4-beat auto loop; press during a loop to exit | Active loop toggle |

### On Jog Display — 16 elements

Deck number · artwork · key · key variation · **CUE SCOPE** (marks from 4 bars behind to 16 bars ahead) · deck status background (white/blue = decks 1–2 / 3–4; bright = on-air, dark = off-air, **red = slip**) · cue point · BPM · playing speed · speed range · waveform · cue/loop/hot-cue memory · playback position needle · time · MASTER · SYNC.

Customisable: waveform colour, artwork on/off, time mode. Hiding artwork enlarges the BPM readout.

> On the Serato DDJ-1000SRT the jog displays do **not** show waveforms or cue points — a key reason the rekordbox version is the richer one.

### Performance pads — 8 hardware-reachable modes

| Mode | Access | What it does |
|---|---|---|
| Hot Cue | HOT CUE | Set/recall hot cues; 16 per deck via PAGE |
| Keyboard | SHIFT + HOT CUE | Pads play a selected hot cue across a musical scale |
| Pad FX 1 | PAD FX1 | Momentary FX, slots A–P; hold = on |
| Pad FX 2 | SHIFT + PAD FX1 | Second bank, slots Q–AF |
| Beat Jump | BEAT JUMP | Jump 1/2/4/8 beats, forward and back |
| Beat Loop | SHIFT + BEAT JUMP | Loop of assigned length; continues after release |
| Sampler | SAMPLER | Trigger sampler slots; SHIFT+PAGE switches bank |
| Key Shift | SHIFT + SAMPLER | Shift the playing track's key to the pad's pitch |

### Mixer section

Per channel: input selector (USB A / PHONO·LINE / USB B on CH3-4; USB A / LINE / USB B on CH1-2), TRIM (−∞ to +9), 3-band EQ (**−26 to +6 dB** — full kill on cut), COLOR knob (centre detent), pre-fader level meter, headphone CUE (SHIFT = TAP), channel fader, crossfader assign A/THRU/B.

Master: MASTER LEVEL, CLIP indicator, stereo master meter (−24 to +15 dB), BOOTH MONITOR LEVEL, MASTER CUE. Headphones: LEVEL, MIXING (CUE ↔ MASTER). Sampler: VOL, CUE. Mic: MIC1/MIC2 LEVEL, shared HI/LOW EQ, OFF/ON/TALK OVER switch (talkover attenuates −18 dB default when mic exceeds −10 dB).

**MAGVEL FADER** — magnetic crossfader, rated >10 million movements.

### Sound Color FX (4)

Selected globally by one of four buttons; intensity and direction set per channel by that channel's COLOR knob (centre = off).

- **DUB ECHO** — echo; left applies it to mids, right to highs
- **PITCH** — left pitches down, right pitches up
- **NOISE** — white noise mixed in through a filter; further from centre = louder
- **FILTER** — left = low-pass, right = high-pass

### Beat FX (14)

Order printed around the selector: ENIGMA JET, TRANS, REVERB, SPIRAL, MT DELAY, ECHO, LOW CUT ECHO, FLANGER, PHASER, PITCH, SLIP ROLL, ROLL, MOBIUS (SAW), MOBIUS (TRI).

**Four are DDJ-1000 exclusives:** Enigma Jet, Mobius Saw, Mobius Triangle, Low Cut Echo.

What LEVEL/DEPTH controls **differs per effect** — the detail every other resource omits:
- ECHO / LOW CUT ECHO / SLIP ROLL / ROLL / REVERB — wet/dry balance
- MT DELAY — MIN→centre sets odd-numbered delay volume; centre→MAX sets even-numbered
- TRANS — duty ratio *and* balance
- SPIRAL — feedback amount and balance
- ENIGMA JET / FLANGER / PHASER — effect intensity
- PITCH — amount of pitch change
- MOBIUS SAW/TRI — oscillator pitch/intensity

Notable behaviors: **SLIP ROLL** continues playback underneath so you land back on the grid; **ROLL** does not. **Mobius Saw/Tri** are Shepard-tone oscillators that seem to rise or fall forever and work even with the track stopped. **Low Cut Echo** keeps the bass clean so echo tails don't turn to mud.

**Release FX:** hold SHIFT while switching the active effect off.

### Rear panel

Kensington slot · MASTER 1 (XLR balanced) · MASTER 2 (RCA unbalanced) · BOOTH (1/4" TRS balanced) · SIGNAL GND · LINE/PHONO switches ×2 · LINE/PHONO inputs (RCA ×2) · LINE inputs (RCA ×2) · **USB B** · **USB A** · MIC2 (1/4" TRS) · MIC1 (XLR + 1/4" combi) · power switch · DC IN 12V · cord hook.

Manual warning: use MASTER 1 for balanced connections only; never connect phantom-power-capable terminals.

**Dual USB** is the changeover feature — two laptops connected at once, per-channel source switching.

### Front panel

PHONES output ×2 — 1/4" and 3.5mm. **That is the only item on the front panel.**

### Specifications

- Dimensions **708 × 73.4 × 361.4 mm**; weight **6.0 kg**
- Sampling rate **44.1 kHz only**; **D/A 32-bit**, **A/D 24-bit**
- Frequency response 20 Hz – 20 kHz; S/N (USB) 112 dB; THD (USB) 0.002%
- Channel EQ −26 to +6 dB; Mic EQ −12 to +12 dB
- Power DC 12V 2000mA via external adapter

### Gotchas worth teaching

- **No VINYL button** — it's SHIFT + SLIP
- **No LOAD buttons** — press the rotary selector
- **No crossfader curve knob** — it's a software setting
- **44.1 kHz only** — the "32-bit" figure is the D/A converter, not streaming depth
- **DVS licence costs extra** — not bundled
- 16 hot cues require PAGE
- SHIFT legends are silk-screened in grey; the panel documents its own second layer, and most owners never notice

### Why this unit matters

1:1 translation to a CDJ-2000NXS2 + DJM-900NXS2 booth — same jog size and feel, same pitch fader, same full-kill EQ, same Sound Color FX row, same Beat FX architecture, same strip order, same crossfader assign. Practise at home, walk into a club, muscle memory holds. Full-size mechanical jogs with JOG FEELING ADJUST as the tension-screw equivalent. The on-jog display replaces the laptop stare. Key control is unusually deep for its era. Slip everywhere. Four analogue inputs make it a hybrid-rig hub.

---

## 4. Software: rekordbox 7

Target version **7.214**. Manual: `cdn.rekordbox.com/files/20260409151936/rekordbox7.214_manual_EN.pdf`

### Performance mode — 11 workspace components

Command panel · Sound Effects (FX1 + CFX) · Waveforms · Player decks · Mixer (vertical and horizontal) · Record · Sampler · Lighting · Playlist palette · Sources · Track list.

Element counts are substantial — Command 18, Player Deck 29, Sampler 25. **~150+ software hotspots against ~65 hardware ones.** The software surface is roughly as large as the hardware one.

rekordbox splits **Export mode** (library prep) from **Performance mode** (playing). This site covers Performance mode only.

### The 2018 hardware / 2026 software gap

The DDJ-1000 manual describes **rekordbox 5**. Cross-referencing against the rekordbox 7 manual:

- **The silk-screened legends still hold.** rekordbox 7 has both `KEYBOARD` and `KEY SHIFT` pad modes, matching the printed legends. Not stale.
- **rekordbox 7 has 10 pad modes; the DDJ-1000 reaches 8.** Software modes: HOT CUE, PAD FX, SLICER, BEAT JUMP, BEAT LOOP, KEYBOARD, KEY SHIFT, SEQ. CALL, ACT. CENSR, MEMORY CUE. **Slicer, Sequence Call, Active Censor and Memory Cue are unreachable by default** — they need Pad Editor remapping.
- **STEMS is rekordbox 7 only** (`Preferences → Extensions → STEMS`), splitting a track into VOCAL/INST/DRUMS or VOCAL/INST/BASS/DRUMS. No printed hardware controls, but drivable via Pad Editor and PAD FX.
- **MERGE FX** likewise postdates the hardware.

**This gap is the site's strongest differentiator.** A section on *what your DDJ-1000 can do with rekordbox 7* is genuinely novel.

### Subscription gating

Free: EQ and faders, tempo and key sync, slip, basic FX. Paid: recording, DVS, video, vocal stem separation. Content carries a `tier` field so popovers can flag it — telling someone to use a feature they can't access is a bad experience.

### Still to verify on the real unit

Pad-mode LED colours and paging behavior; the jog-display customisation path (the 2018 manual puts it at `Preferences → Controller → Deck → Jog`, which may have moved in the rekordbox 7 UI).

---

## 5. Source hierarchy and the VirtualDJ trap

**Canonical:** the Pioneer manual for hardware, the rekordbox 7 manual for software.

**VirtualDJ's manual may be used for control numbering only.** Its behavioral descriptions are wrong for this site — and not subtly. Whole feature sets differ:

| SHIFT + | rekordbox (correct) | VirtualDJ (wrong here) |
|---|---|---|
| HOT CUE | Keyboard | Cue Loop |
| PAD FX1 | Pad FX 2 | Pad FX 2 |
| BEAT JUMP | Beat Loop | Loop |
| SAMPLER | Key Shift | Key Cue |

Smaller divergences: VirtualDJ says SEARCH moves "by 4 beats"; rekordbox is fast-forward/rewind plus track search. MEMORY and PAGE behaviors differ per mode too.

Every `Behavior` carries a `source` tag so violations are greppable and test-enforced.

---

## 6. Image assets

### Hardware

**Master (placeholder):** Pioneer official overhead render, **3129 × 1652** transparent PNG, perfectly orthographic, every SHIFT legend legible.
`https://www.pioneerdj.com/product-images/1778/799393b2-2208-4e88-b7d2-d6406c154354/ddj-1000_1.png`

Also available: 3/4 hero (3000×1744), front elevation (3000×832), rear elevation (3000×310).

**Licensing:** © AlphaTheta, all rights reserved. Self-host, never hotlink, carry an attribution and non-affiliation footer. **Jonathan's own overhead photograph is the intended replacement** and retires the question entirely.

### Software

**Master:** the only clean, unannotated Performance mode capture found —
`https://www.deejayplaza.com/en/wp-content/uploads/2024/08/rekordbox-performance-mode-screenshot.webp` · **1200 × 634**

**Every other panel image on that site is annotated** with burned-in numbers, red boxes and arrows. Useless as bases; excellent as authoring checklists. Full inventory in the implementation plan.

**Resolution caveat:** 1200px is thin — the player-deck crop leaves ~480px of source. Good enough to build against; Jonathan's single 2× window capture is the intended upgrade.

### Asset requests

**Photography** (optional, resolves licensing permanently):
1. **Full overhead of the unit** — tripod, straight down, even diffuse light. *Highest value by a wide margin* — replaces the master image and makes the site originally-sourced.
2. Pads and PAD MODE row, straight down, lit
3. Jog display with a real track loaded
4. Rear panel, full width, straight on
5. Front panel

Straight-down angle matters more than resolution — perspective distortion breaks hotspot accuracy. No direct flash; brushed aluminium and glossy pads both blow out.

**Screenshot** (quality upgrade, not blocking):
1. Full Performance mode window at 2×, 2-deck horizontal, two tracks loaded, dark theme, maximized.

---

## 7. Architecture rationale

**One master image per surface; sections are CSS crops of it.**

The first draft zoomed the master then crossfaded to a separate section photo. That fails: the section images come from different sources with different lighting and perspective, so the transition reads as a bug rather than a zoom.

Cropping one master instead gives continuity for free, and it collapses the data model — every control needs **one coordinate pair in master space** rather than a per-image coordinate map. A single pure function maps master coords into whatever crop is on screen, which is trivially testable. Swapping in Jonathan's own photograph later means replacing one file and re-measuring rects.

**Cross-surface linking** (`counterpart`) is the core teaching device: a hardware control's popover offers "see this on screen →" and vice versa.

---

## 8. Source index

| Source | Use |
|---|---|
| `/Users/jonathanbarreto/Downloads/DDJ-1000_DRH1656B_quickstart-manual.pdf` | Part names (pp. 5–8), connections, **specs (pp. 15–16)** |
| `manualslib.com/manual/1436395/Pioneer-Dj-Ddj-1000.html?page=N` | Full 116-page Operating Instructions. **Beat FX pp. 22–23, Sound Color FX p. 24**, pad modes pp. 18–19 |
| `cdn.rekordbox.com/files/20260409151936/rekordbox7.214_manual_EN.pdf` | rekordbox 7 pad modes (p. 126), stems (p. 207), key shift (p. 165) |
| `deejayplaza.com/en/articles/rekordbox-performance-mode-tutorial` | Performance mode panel inventory + the clean master screenshot |
| `virtualdj.com/manuals/hardware/pioneer/ddj1000/layout/*` | **Control numbering only** — never behavior |
| YouTube `PLk1VCXHnvPLC8Tcjh8-eQV9idCd7jlRNH` | Pioneer's 6-video series; establishes what they chose *not* to teach |
| `pioneerdj.com/en/product/controller/ddj-1000/black/overview/` | Product page and official imagery |

**Note:** the Pioneer URLs in the original brief 404 — the path segment is `controller`, not `dj-controllers`.
