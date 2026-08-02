'use client';

import {Link} from '@astryxdesign/core/Link';
import {List, ListItem} from '@astryxdesign/core/List';
import {Stack} from '@astryxdesign/core/Stack';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Text} from '@astryxdesign/core/Text';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {controlsInSection, SECTIONS} from '@/content';
import {browserSectionIntro} from '@/content/hardware/browser';
import {detailAssetsForLesson} from '@/content/assets';
import {getBrowserVisualRect} from '@/content/hardware/browserVisual';
import {
  controlsForDeckRegion,
  DECK_REGIONS,
  getDeckRegion,
  getDeckRegionForControl,
  getDeckVisualRect,
  isDeckSection,
  type DeckRegionId,
} from '@/content/hardware/deckRegions';
import {mixerChannelOverview, mixerGainControls, mixerSignalFlowSteps} from '@/content/hardware/mixer';
import {
  getMixerRegion,
  getMixerRegionForControl,
  getMixerVisualRect,
  MIXER_REGIONS,
  type MixerRegionId,
} from '@/content/hardware/mixerRegions';
import {
  getRbDeckMarkerOffset,
  getRbDeckRegion,
  getRbDeckRegionForControl,
  getRbDeckVisualRect,
  RB_DECK_REGIONS,
  type RbDeckRegionId,
} from '@/content/rekordbox/deckRegions';
import type {Control, Point, Rect, SectionId, Surface} from '@/content/types';
import {isVisible, toViewport} from '@/lib/geometry';
import {Hotspot} from './Hotspot';
import {HotspotMarker} from './HotspotMarker';
import {ControlLessonDialog} from './ControlLessonDialog';
import {ControlIndex} from './ControlIndex';
import {SurfaceNavigator} from './SurfaceNavigator';
import {readResumeTarget, saveResumeTarget, type ResumeTarget} from '@/lib/resume-state';
import {ShiftProvider, useShift} from './ShiftContext';
import {Stage} from './Stage';
import styles from './SurfaceView.module.css';
import {DetailGallery} from './DetailGallery';
import {VideoLessons} from './VideoLessons';
import {tutorialVideosForLesson} from '@/content/videos';

const FULL: Rect = {x: 0, y: 0, w: 1, h: 1};

const SECTION_PROMPTS: Partial<Record<SectionId, {goal: string; cue: string}>> = {
  'deck-left': {
    goal: 'Learn how one side moves between transport, cueing, and phrase control.',
    cue: 'Start with jog mode awareness, then build one phrase-long transition before touching multiple knobs.',
  },
  'deck-right': {
    goal: 'Mirror deck flow and compare behavior with the left side under load.',
    cue: 'Use deck-to-deck symmetry in the same phrase to keep channel timing honest during swaps.',
  },
  mixer: {
    goal: 'Understand gain structure before creative moves so you never chase clipping.',
    cue: 'Set trim, routing, and one level first; add EQ and effects only after a clean gain structure is set.',
  },
  fx: {
    goal: 'Choose and tune effects only after the phrase transition is already set.',
    cue: 'Prepare route, rate, and depth while tracks are aligned, then switch on at the exact transfer point.',
  },
  browser: {
    goal: 'Prepare source material quickly without losing visual focus on mix flow.',
    cue: 'Move between source, cue, and loop planning before you open hardware-level changes.',
  },
};

const SECTION_FLOW: SectionId[] = ['deck-left', 'deck-right', 'mixer', 'fx', 'browser'];

interface SectionArea {
  id: string;
  label: string;
  at: Point;
  rect: Rect;
  controlIds: string[];
  targetSectionId?: SectionId;
}

const SECTION_AREAS: Partial<Record<SectionId, SectionArea[]>> = {
  'deck-left': [
    {id: 'transport', label: 'Loop & transport', at: {x: 0.17, y: 0.15}, rect: DECK_REGIONS[0].rect['deck-left'], controlIds: [...DECK_REGIONS[0].leftControlIds]},
    {id: 'jog', label: 'Jog & tempo', at: {x: 0.17, y: 0.43}, rect: DECK_REGIONS[1].rect['deck-left'], controlIds: [...DECK_REGIONS[1].leftControlIds]},
    {id: 'pads', label: 'Pads & key', at: {x: 0.17, y: 0.75}, rect: DECK_REGIONS[2].rect['deck-left'], controlIds: [...DECK_REGIONS[2].leftControlIds]},
  ],
  'deck-right': [
    {id: 'transport', label: 'Loop & transport', at: {x: 0.83, y: 0.15}, rect: DECK_REGIONS[0].rect['deck-right'], controlIds: DECK_REGIONS[0].leftControlIds.map((id) => id.replace('deck-left-', 'deck-right-'))},
    {id: 'jog', label: 'Jog & tempo', at: {x: 0.83, y: 0.43}, rect: DECK_REGIONS[1].rect['deck-right'], controlIds: DECK_REGIONS[1].leftControlIds.map((id) => id.replace('deck-left-', 'deck-right-'))},
    {id: 'pads', label: 'Pads & key', at: {x: 0.83, y: 0.75}, rect: DECK_REGIONS[2].rect['deck-right'], controlIds: DECK_REGIONS[2].leftControlIds.map((id) => id.replace('deck-left-', 'deck-right-'))},
  ],
  mixer: [
    {id: 'input-gain', label: 'Input & gain', at: {x: 0.49, y: 0.13}, rect: {x: 0.25, y: 0.022, w: 0.5, h: 0.956}, controlIds: ['mixer-ch1-input', 'mixer-ch2-input', 'mixer-ch3-input', 'mixer-ch4-input', 'mixer-ch1-trim', 'mixer-ch2-trim', 'mixer-ch3-trim', 'mixer-ch4-trim']},
    {id: 'eq', label: 'Channel EQ', at: {x: 0.49, y: 0.3}, rect: {x: 0.32, y: 0.16, w: 0.16, h: 0.46}, controlIds: ['mixer-ch1-high', 'mixer-ch1-mid', 'mixer-ch1-low']},
    {id: 'color-fx', label: 'Color FX', at: {x: 0.37, y: 0.49}, rect: {x: 0.32, y: 0.42, w: 0.15, h: 0.24}, controlIds: ['mixer-sound-color-fx-select', 'mixer-ch1-color']},
    {id: 'headphone-cue', label: 'Headphone cue', at: {x: 0.37, y: 0.74}, rect: {x: 0.31, y: 0.55, w: 0.16, h: 0.36}, controlIds: ['mixer-ch1-cue', 'mixer-headphones-mixing', 'mixer-headphones-level']},
    {id: 'master-booth', label: 'Master & booth', at: {x: 0.62, y: 0.24}, rect: {x: 0.58, y: 0.04, w: 0.11, h: 0.43}, controlIds: ['mixer-master-level', 'mixer-master-meter-clip', 'mixer-booth-monitor', 'mixer-master-cue']},
    {id: 'crossfader', label: 'Crossfader', at: {x: 0.5, y: 0.93}, rect: {x: 0.34, y: 0.68, w: 0.34, h: 0.3}, controlIds: ['mixer-crossfader', 'mixer-ch1-crossfader-assign', 'mixer-ch2-crossfader-assign']},
    {id: 'beat-fx', label: 'Beat FX', at: {x: 0.62, y: 0.76}, rect: {x: 0.56, y: 0.48, w: 0.13, h: 0.49}, controlIds: [], targetSectionId: 'fx'},
  ],
  fx: [
    {id: 'effect', label: 'Choose effect', at: {x: 0.62, y: 0.65}, rect: {x: 0.56, y: 0.49, w: 0.13, h: 0.23}, controlIds: ['fx-display', 'fx-selector']},
    {id: 'timing', label: 'Set timing', at: {x: 0.62, y: 0.58}, rect: {x: 0.56, y: 0.49, w: 0.13, h: 0.16}, controlIds: ['fx-display', 'fx-beat-arrows']},
    {id: 'routing', label: 'Route effect', at: {x: 0.62, y: 0.74}, rect: {x: 0.56, y: 0.68, w: 0.13, h: 0.15}, controlIds: ['fx-channel-selector']},
    {id: 'perform', label: 'Depth & release', at: {x: 0.62, y: 0.88}, rect: {x: 0.56, y: 0.78, w: 0.13, h: 0.2}, controlIds: ['fx-level-depth', 'fx-on-off']},
  ],
  browser: [
    {id: 'browse', label: 'Browse library', at: {x: 0.307, y: 0.094}, rect: {x: 0.26, y: 0.04, w: 0.12, h: 0.18}, controlIds: ['browser-rotary-selector']},
    {id: 'views', label: 'Views & back', at: {x: 0.303, y: 0.152}, rect: {x: 0.26, y: 0.1, w: 0.12, h: 0.14}, controlIds: ['browser-back', 'browser-view']},
  ],
};

interface ControllerEntryPoint {
  id: string;
  label: string;
  at: Point;
  sectionId: SectionId;
  areaId: string;
  summary: string;
}

const CONTROLLER_ENTRY_POINTS: ControllerEntryPoint[] = [
  {id: 'eq', label: 'EQ', at: {x: 0.46, y: 0.34}, sectionId: 'mixer', areaId: 'eq', summary: 'Shape the frequencies of a representative channel.'},
  {id: 'color-fx', label: 'Sound Color FX', at: {x: 0.43, y: 0.55}, sectionId: 'mixer', areaId: 'color-fx', summary: 'Choose a color effect, then add it to the channel.'},
  {id: 'beat-fx', label: 'Beat FX', at: {x: 0.63, y: 0.68}, sectionId: 'fx', areaId: 'effect', summary: 'Choose, time, route, and perform a Beat FX.'},
  {id: 'crossfader', label: 'Crossfader', at: {x: 0.5, y: 0.9}, sectionId: 'mixer', areaId: 'crossfader', summary: 'Assign channels, then blend or cut between them.'},
  {id: 'master', label: 'Master volume', at: {x: 0.63, y: 0.19}, sectionId: 'mixer', areaId: 'master-booth', summary: 'Set the room and booth monitor independently.'},
  {id: 'pads', label: 'Pads', at: {x: 0.19, y: 0.83}, sectionId: 'deck-left', areaId: 'pads', summary: 'Use performance pads, pad modes, and key controls.'},
  {id: 'jog', label: 'Jog wheel', at: {x: 0.19, y: 0.52}, sectionId: 'deck-left', areaId: 'jog', summary: 'Control jog feel, tempo, sync, and vinyl behavior.'},
  {id: 'loops', label: 'Loop controls', at: {x: 0.08, y: 0.12}, sectionId: 'deck-left', areaId: 'transport', summary: 'Work with loops, cue calls, and deck transport.'},
  {id: 'deck-select', label: 'Deck select', at: {x: 0.07, y: 0.28}, sectionId: 'deck-left', areaId: 'transport', summary: 'Select the deck pair before using deck-specific controls.'},
];
function nextSection(currentId: SectionId): SectionId | null {
  const index = SECTION_FLOW.indexOf(currentId);
  if (index === -1) return null;
  return SECTION_FLOW[(index + 1) % SECTION_FLOW.length];
}

export interface SurfaceViewProps {
  surface: Surface;
  sectionId?: SectionId;
}

function hashControlId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = decodeURIComponent(window.location.hash.slice(1));
    return value || null;
  } catch {
    return null;
  }
}

function clearMatchingControlHash(controlId: string) {
  if (typeof window === 'undefined' || hashControlId() !== controlId) return;
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}

function SurfaceViewInner({surface, sectionId}: SurfaceViewProps) {
  const {isShiftActive} = useShift();
  const section = sectionId === undefined ? undefined : SECTIONS[sectionId];
  const [focusedSectionId, setFocusedSectionId] = useState<SectionId | null>(null);
  const focusedSection = focusedSectionId === null ? undefined : SECTIONS[focusedSectionId];
  const activeSection = section ?? focusedSection;
  const isRbDeck = activeSection?.id === 'rb-deck';
  const isMixer = activeSection?.id === 'mixer';
  const isDeck = isDeckSection(activeSection?.id);
  const isHardwareSection = surface === 'hardware' && activeSection !== undefined;
  const isNarrow = useMediaQuery('(max-width: 767px)', false);
  const regionNavRef = useRef<HTMLDivElement>(null);
  const sectionPrompt = activeSection?.id === undefined ? undefined : SECTION_PROMPTS[activeSection.id];

  const allControls = useMemo(
    () => (activeSection === undefined ? [] : controlsInSection(activeSection.id)),
    [activeSection],
  );
  const [activeRegionId, setActiveRegionId] = useState<RbDeckRegionId>('info');
  const [activeMixerRegionId, setActiveMixerRegionId] = useState<MixerRegionId>('signal');
  const [activeDeckRegionId, setActiveDeckRegionId] = useState<DeckRegionId>('transport');
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const sectionAreas = activeSection === undefined ? [] : SECTION_AREAS[activeSection.id] ?? [];
  const selectedArea = sectionAreas.find((area) => area.id === selectedAreaId);
  const activeRbRegion = isRbDeck ? getRbDeckRegion(activeRegionId) : undefined;
  const activeMixerRegion = isMixer ? getMixerRegion(activeMixerRegionId) : undefined;
  const activeDeckRegion = isDeck ? getDeckRegion(activeDeckRegionId) : undefined;
  const activeRegion = activeRbRegion ?? activeMixerRegion ?? activeDeckRegion;
  const shouldScopeToRegion = !isHardwareSection || selectedControlId !== null;
  const targetRect = isHardwareSection
    ? selectedArea?.rect
      ?? (activeSection?.id === 'mixer'
      ? getMixerVisualRect('signal', isNarrow)
      : activeSection?.rect ?? FULL)
    : activeRbRegion
    ? getRbDeckVisualRect(activeRbRegion.id, isNarrow)
    : activeMixerRegion
      ? getMixerVisualRect(activeMixerRegion.id, isNarrow)
    : activeDeckRegion && isDeck
      ? getDeckVisualRect(activeDeckRegion.id, activeSection?.id as 'deck-left' | 'deck-right')
    : activeSection?.id === 'browser'
      ? getBrowserVisualRect(isNarrow)
      : activeSection?.rect ?? FULL;
  const activeControlIds = shouldScopeToRegion && (activeRbRegion?.controlIds
    ?? (isMixer && selectedControlId?.match(/^mixer-(ch[1-4])-./)
      ? allControls
          .filter((control) => control.id.startsWith(`mixer-${selectedControlId.match(/^mixer-(ch[1-4])-./)?.[1]}-`))
          .map((control) => control.id)
      : activeMixerRegion?.controlIds)
    ?? (activeDeckRegion && isDeck
      ? controlsForDeckRegion(activeDeckRegion, activeSection?.id as 'deck-left' | 'deck-right')
      : undefined));
  const scopedControls = activeControlIds
    ? activeControlIds
        .map((id) => allControls.find((control) => control.id === id))
        .filter((control): control is Control => control !== undefined)
    : allControls;
  const controls = selectedArea !== undefined
    ? selectedArea.controlIds
        .map((id) => allControls.find((control) => control.id === id))
        .filter((control): control is Control => control !== undefined)
    : scopedControls;
  const [crop, setCrop] = useState<{sectionId?: SectionId; rect: Rect}>({
    sectionId: activeSection?.id,
    rect: targetRect,
  });
  const [overlayMode, setOverlayMode] = useState<'none' | 'preview' | 'lesson'>('none');
  const [resumeTarget, setResumeTarget] = useState<ResumeTarget | null>(null);
  const initiatorRef = useRef<HTMLElement | null>(null);
  const stageRect = crop.sectionId === activeSection?.id ? crop.rect : FULL;
  const baseHref = surface === 'hardware' ? '/controller' : '/rekordbox';
  const sections = Object.values(SECTIONS).filter((candidate) => candidate.surface === surface);
  const populatedSections = sections.filter((candidate) => controlsInSection(candidate.id).length > 0);
  const unavailableSections = sections.filter((candidate) => controlsInSection(candidate.id).length === 0);
  const isCompactSection = isNarrow && activeSection !== undefined;
  const showControlIndex = (activeRegion !== undefined && shouldScopeToRegion && controls.length > 0)
    || (isCompactSection && controls.length > 0);
  const selectedControl = allControls.find((control) => control.id === selectedControlId) ?? null;
  const detailAssets = activeSection === undefined ? [] : detailAssetsForLesson(activeSection.id);
  const tutorialVideos = activeSection === undefined ? [] : tutorialVideosForLesson(activeSection.id);
  const nextSectionId = activeSection ? nextSection(activeSection.id) : null;

  const focusSection = useCallback((nextSectionId: SectionId) => {
    const nextSectionSpec = SECTIONS[nextSectionId];
    if (surface !== 'hardware' || section !== undefined || nextSectionSpec.surface !== 'hardware') return;
    setFocusedSectionId(nextSectionId);
    setSelectedAreaId(null);
    setSelectedControlId(null);
    setOverlayMode('none');
    setCrop({
      sectionId: nextSectionId,
      rect: nextSectionId === 'mixer'
        ? getMixerVisualRect('signal', isNarrow)
        : nextSectionSpec.rect,
    });
  }, [isNarrow, section, surface]);

  const focusArea = useCallback((area: SectionArea) => {
    if (area.targetSectionId) {
      focusSection(area.targetSectionId);
      return;
    }
    if (!activeSection) return;
    setSelectedAreaId(area.id);
    setSelectedControlId(null);
    setOverlayMode('none');
    setCrop({sectionId: activeSection.id, rect: area.rect});
  }, [activeSection, focusSection]);

  const focusEntryPoint = useCallback((entry: ControllerEntryPoint) => {
    const area = SECTION_AREAS[entry.sectionId]?.find((candidate) => candidate.id === entry.areaId);
    if (!area || surface !== 'hardware' || section !== undefined) return;
    setFocusedSectionId(entry.sectionId);
    setSelectedAreaId(area.id);
    setSelectedControlId(null);
    setOverlayMode('none');
    setCrop({sectionId: entry.sectionId, rect: area.rect});
  }, [section, surface]);

  const activateControl = useCallback((controlId: string, updateHash: boolean) => {
    const control = allControls.find((candidate) => candidate.id === controlId);
    if (!control) return false;

    const rbRegion = isRbDeck ? getRbDeckRegionForControl(control.id) : undefined;
    const mixerRegion = isMixer ? getMixerRegionForControl(control.id) : undefined;
    const deckRegion = isDeck ? getDeckRegionForControl(control.id) : undefined;
    if ((isRbDeck && !rbRegion) || (isMixer && !mixerRegion) || (isDeck && !deckRegion)) return false;
    if (rbRegion) setActiveRegionId(rbRegion.id);
    if (mixerRegion) setActiveMixerRegionId(mixerRegion.id);
    if (deckRegion) setActiveDeckRegionId(deckRegion.id);
    if (isHardwareSection && activeSection) {
      const regionRect = rbRegion
        ? getRbDeckVisualRect(rbRegion.id, isNarrow)
        : mixerRegion
          ? getMixerVisualRect(mixerRegion.id, isNarrow)
          : deckRegion
              ? isDeck
              ? getDeckVisualRect(deckRegion.id, activeSection.id as 'deck-left' | 'deck-right')
              : activeSection.rect
            : activeSection.rect;
      const focusedRect = selectedArea?.rect ?? regionRect;
      setCrop({sectionId: activeSection.id, rect: focusedRect});
    }
    setSelectedControlId(control.id);
    setOverlayMode(isNarrow ? 'lesson' : 'preview');
    if (activeSection) saveResumeTarget({surface, sectionId: activeSection.id, controlId: control.id});

    if (updateHash && typeof window !== 'undefined') {
      const nextHash = `#${encodeURIComponent(control.id)}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
      }
    }
    return true;
  }, [activeSection, allControls, isDeck, isHardwareSection, isMixer, isNarrow, isRbDeck, sectionId, selectedArea?.rect, surface]);

  useEffect(() => {
    setCrop({sectionId: activeSection?.id, rect: targetRect});
  }, [activeSection?.id, targetRect]);

  useEffect(() => {
    setResumeTarget(readResumeTarget(surface));
  }, [surface]);

  useEffect(() => {
    if (!section) return;
    const openHashTarget = () => {
      const id = hashControlId();
      if (!id || !activateControl(id, false)) {
        setSelectedControlId(null);
        setOverlayMode('none');
      } else {
        setOverlayMode('lesson');
      }
    };
    openHashTarget();
    window.addEventListener('hashchange', openHashTarget);
    return () => window.removeEventListener('hashchange', openHashTarget);
  }, [activateControl, section]);

  useEffect(() => {
    if (!selectedControlId || overlayMode !== 'preview' || !isNarrow) return;
    setOverlayMode('lesson');
  }, [isNarrow, overlayMode, selectedControlId]);

  useEffect(() => {
    if (!isNarrow || !activeRegion) return;
    const frame = window.requestAnimationFrame(() => {
      const nav = regionNavRef.current;
      const tab = nav?.querySelector<HTMLElement>(
        `[data-tab-value="${activeRegion.id}"]`,
      );
      if (!nav || !tab) return;
      nav.scrollTo?.({
        left: tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2,
        behavior: 'auto',
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeRegion, isNarrow]);

  const closeOverlay = useCallback((controlId: string | null = selectedControlId) => {
    if (controlId) clearMatchingControlHash(controlId);
    setOverlayMode('none');
    setSelectedControlId(null);
    if (isHardwareSection && activeSection) {
      setCrop({
        sectionId: activeSection.id,
        rect: selectedArea?.rect
          ?? (activeSection.id === 'mixer'
          ? getMixerVisualRect('signal', isNarrow)
          : activeSection.rect),
      });
    }
    queueMicrotask(() => initiatorRef.current?.focus());
  }, [activeSection, isHardwareSection, isNarrow, selectedArea?.rect, selectedControlId]);

  const resetSectionView = useCallback(() => {
    if (!isHardwareSection || !activeSection) return;
    clearMatchingControlHash(selectedControlId ?? '');
    setSelectedControlId(null);
    setOverlayMode('none');
    if (selectedArea) {
      setSelectedAreaId(null);
      setCrop({
        sectionId: activeSection.id,
        rect: activeSection.id === 'mixer'
          ? getMixerVisualRect('signal', isNarrow)
          : activeSection.rect,
      });
      return;
    }
    if (section === undefined) setFocusedSectionId(null);
    setCrop(section === undefined
      ? {sectionId: undefined, rect: FULL}
      : {
          sectionId: activeSection.id,
          rect: activeSection.id === 'mixer'
            ? getMixerVisualRect('signal', isNarrow)
            : activeSection.rect,
        });
  }, [activeSection, isHardwareSection, isNarrow, section, selectedArea, selectedControlId]);

  function selectRegion(value: string) {
    if (isMixer) setActiveMixerRegionId(value as MixerRegionId);
    else if (isDeck) setActiveDeckRegionId(value as DeckRegionId);
    else setActiveRegionId(value as RbDeckRegionId);
    setSelectedControlId(null);
    setOverlayMode('none');
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    queueMicrotask(() => regionNavRef.current?.querySelector<HTMLButtonElement>(
      `[data-tab-value="${value}"]`,
    )?.focus());
  }

  const regions = activeRegion ? (isMixer ? MIXER_REGIONS : isDeck ? DECK_REGIONS : RB_DECK_REGIONS) : [];
  const selectControl = (controlId: string, trigger: HTMLButtonElement | null, mode: 'preview' | 'lesson') => {
    initiatorRef.current = trigger;
    if (activateControl(controlId, true)) setOverlayMode(isNarrow ? 'lesson' : mode);
  };

  return (
    <Stack direction="vertical" gap={3} xstyle={undefined}>
      {surface !== 'hardware' && <div ref={regionNavRef}>
        <SurfaceNavigator
          surface={surface}
          section={activeSection}
          activeRegionId={activeRegion?.id}
          activeRegionLabel={activeRegion?.label}
          selectedControlLabel={selectedControl?.label}
          regions={regions}
          showRegionTabs
          isCompact={isNarrow}
          overflowRegionIds={isMixer ? ['color-fx', 'outputs', 'monitoring', 'mic'] : undefined}
          onViewMap={() => {
            if (!activeSection) {
              resetSectionView();
              return;
            }
            const target = {surface, sectionId: activeSection.id, controlId: selectedControlId ?? undefined};
            saveResumeTarget(target);
            setResumeTarget(target);
          }}
          onRegionChange={(value) => {
            if (activeSection) {
              saveResumeTarget({surface, sectionId: activeSection.id, controlId: selectedControlId ?? undefined});
            }
            selectRegion(value);
          }}
          resumeTarget={resumeTarget ?? undefined}
        />
      </div>}
      {activeMixerRegion && surface === 'software' && (
        <div className={styles.regionHint}>
          <Text type="supporting">Swipe horizontally for all mixer lessons →</Text>
        </div>
      )}
      {activeMixerRegion?.id === 'signal' && !isHardwareSection && (
        <div className={styles.signalGuide}>
          <Stack direction="vertical" gap={3} xstyle={undefined}>
            <Text type="label">Follow one sound, then set one level at a time</Text>
            <List
              listStyle="decimal"
              hasDividers
              header={<Text type="label">Signal flow</Text>}
            >
              {mixerSignalFlowSteps.map((step) => (
                <ListItem key={step.label} label={step.label} description={step.description} />
              ))}
            </List>
            <List
              hasDividers
              header={<Text type="label">Six different level jobs</Text>}
            >
              {mixerGainControls.map((control) => (
                <ListItem
                  key={control.label}
                  label={control.label}
                  description={control.description}
                />
              ))}
            </List>
            <Link href="/reference/sound-color-fx" isStandalone>
              Learn how each Sound Color FX changes the COLOR knob →
            </Link>
          </Stack>
        </div>
      )}
      {activeMixerRegion?.id === 'channels' && <Text>{mixerChannelOverview}</Text>}
      <Stage surface={surface} rect={stageRect}>
        {activeSection === undefined
          ? (
              <>
                {surface === 'hardware' ? CONTROLLER_ENTRY_POINTS.map((entry) => (
                  <div
                    key={entry.id}
                    className={styles.overviewBeacon}
                    style={{left: `${entry.at.x * 100}%`, top: `${entry.at.y * 100}%`}}
                  >
                    <HotspotMarker aria-label={`Explore ${entry.label}`} onClick={() => focusEntryPoint(entry)} />
                    <span className={styles.overviewBeaconLabel}>{entry.label}</span>
                  </div>
                )) : populatedSections.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={styles.overviewBeacon}
                    style={{left: `${candidate.marker.x * 100}%`, top: `${candidate.marker.y * 100}%`}}
                  >
                    <HotspotMarker aria-label={`Explore ${candidate.label}`} onClick={() => focusSection(candidate.id)} />
                    <span className={styles.overviewBeaconLabel}>{candidate.label}</span>
                  </div>
                ))}
                {surface !== 'hardware' && unavailableSections.map((candidate) => (
                  <span
                    key={candidate.id}
                    className={styles.overviewLabel}
                    style={{left: `${candidate.marker.x * 100}%`, top: `${candidate.marker.y * 100}%`}}
                  >
                    {candidate.label}
                  </span>
                ))}
              </>
            )
          : isCompactSection && !isHardwareSection
            ? null
            : isHardwareSection && sectionAreas.length > 0 && selectedArea === undefined && selectedControlId === null
              ? sectionAreas.map((area) => {
                if (!isVisible(area.at, stageRect)) return null;
                const position = toViewport(area.at, stageRect);
                return (
                  <div
                    key={area.id}
                    className={styles.overviewBeacon}
                    style={{left: `${position.x * 100}%`, top: `${position.y * 100}%`}}
                  >
                    <HotspotMarker aria-label={`Explore ${area.label}`} onClick={() => focusArea(area)} />
                    <span className={styles.overviewBeaconLabel}>{area.label}</span>
                  </div>
                );
              })
            : controls.map((control) => (
              <Hotspot
                key={control.id}
                control={control}
                rect={stageRect}
                isShiftActive={isShiftActive}
                isSelected={selectedControlId === control.id}
                isPreviewOpen={overlayMode === 'preview'}
                onPreviewOpenChange={(nextIsOpen, trigger) => {
                  if (nextIsOpen) {
                    selectControl(control.id, trigger ?? null, 'preview');
                  } else if (overlayMode === 'preview') {
                    closeOverlay(control.id);
                  }
                }}
                onReadLesson={(trigger) => {
                  selectControl(control.id, trigger ?? null, 'lesson');
                }}
                markerOffset={activeRbRegion
                  ? getRbDeckMarkerOffset(control.id, isNarrow)
                  : undefined}
              />
              ))}
        {isHardwareSection && activeSection !== undefined && (
          <div className={styles.resetBeacon}>
            <HotspotMarker
              aria-label={selectedArea || selectedControlId ? 'Back to section map' : 'Back to full controller'}
              onClick={resetSectionView}
            />
          </div>
        )}
      </Stage>
      {activeSection && !isHardwareSection && (
        <Stack direction="vertical" gap={2}>
          <div className={styles.learningFocus}>
            <Text type="label" color="accent">Learning focus</Text>
            <Text as="p" textWrap="pretty">
              {sectionPrompt?.goal
                ?? `Focus on ${activeSection.label} controls and what they change in context.`}
            </Text>
          </div>
          {sectionPrompt?.cue ? (
            <Text type="supporting" color="secondary">{sectionPrompt.cue}</Text>
          ) : (
            <Text type="supporting" color="secondary">
              Learn one control, practice one transition in it, then move to the next control.
            </Text>
          )}
          {nextSectionId !== null ? (
            <Link
              href={`/controller/${nextSectionId}`}
              isStandalone
            >
              Next up: {SECTIONS[nextSectionId].label} →
            </Link>
          ) : null}
        </Stack>
      )}
      {activeSection?.id === 'browser' && !isHardwareSection && <Text>{browserSectionIntro}</Text>}
      {activeSection?.id === 'fx' && !isHardwareSection && (
        <Stack direction="vertical" gap={2}>
          <Text>
            Prepare Beat FX in signal order: choose the effect, route its target, set the
            beat or parameter, start LEVEL/DEPTH low, then switch it on at the phrase.
          </Text>
          <Stack direction="horizontal" gap={3} wrap="wrap">
            <Link href="/reference/beat-fx" isStandalone>
              Compare all 14 Beat FX →
            </Link>
            <Link href="/reference/sound-color-fx" isStandalone>
              Sound Color FX directions →
            </Link>
          </Stack>
        </Stack>
      )}
      <ControlLessonDialog
        control={selectedControl}
        isShiftActive={isShiftActive}
        isOpen={overlayMode === 'lesson'}
        isFullscreen={isNarrow}
        onOpenChange={(open) => {
          if (open) setOverlayMode('lesson');
          else closeOverlay();
        }}
      />
      {activeSection === undefined && isNarrow && surface !== 'hardware' && (
        <List
          hasDividers
          density="spacious"
          header={<Text type="label">Available lessons</Text>}
        >
          {populatedSections.map((candidate) => (
            <ListItem
              key={candidate.id}
              label={candidate.label}
              description="Learn the visible deck fields and their hardware counterparts."
              href={`${baseHref}/${candidate.id}`}
            />
          ))}
        </List>
      )}
      {activeSection === undefined && surface === 'software' && unavailableSections.length > 0 && (
        <Text type="supporting">
          {isNarrow
            ? 'Player deck is the published rekordbox 7 lesson. More Performance mode zones will be added as their teaching content is completed.'
            : 'Muted zone names are orientation only; their lesson routes are not published yet.'}
        </Text>
      )}
      {activeSection === undefined && surface === 'hardware' && !isNarrow && false && (
        <List
          hasDividers
          header={<Text type="label">Connections beyond the overhead view</Text>}
        >
          <ListItem
            href="/controller/rear"
            label="Rear connections"
            description="Audio, microphones, power, dual USB routing, safe changeovers, and setup recipes"
          />
          <ListItem
            href="/controller/front"
            label="Front headphones"
            description="The shared cue bus and its two headphone plug sizes"
          />
          </List>
      )}
      {showControlIndex && activeSection && !isHardwareSection && (
        <div className={styles.controlIndex}>
          <ControlIndex
            controls={controls}
            selectedControlId={selectedControlId}
            isShiftActive={isShiftActive}
            title={`Controls in ${activeRegion?.label ?? activeSection.label}`}
            onSelect={(controlId, trigger) => selectControl(controlId, trigger, 'lesson')}
          />
        </div>
      )}
      {!isHardwareSection && (detailAssets.length > 0 || tutorialVideos.length > 0) && (
        <details className={styles.supportingDetails}>
          <summary>
            {detailAssets.length > 0 && tutorialVideos.length > 0
              ? 'See detailed photos and watch tutorials'
              : detailAssets.length > 0
                ? 'See detailed photos'
                : 'Watch tutorials'}
          </summary>
          {detailAssets.length > 0 && (
            <DetailGallery
              assets={detailAssets}
              label={sectionId === 'rb-deck' ? 'rekordbox 7 reference views' : 'DDJ-1000 detail views'}
            />
          )}
          {tutorialVideos.length > 0 && <VideoLessons videos={tutorialVideos} />}
        </details>
      )}
    </Stack>
  );
}

export function SurfaceView(props: SurfaceViewProps) {
  return (
    <ShiftProvider>
      <SurfaceViewInner {...props} />
    </ShiftProvider>
  );
}
