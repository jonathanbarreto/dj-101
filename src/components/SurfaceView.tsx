'use client';

import {Link} from '@astryxdesign/core/Link';
import {Button} from '@astryxdesign/core/Button';
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
import type {Control, Rect, SectionId, Surface} from '@/content/types';
import {Hotspot} from './Hotspot';
import {HotspotMarker} from './HotspotMarker';
import {ControlLessonDialog} from './ControlLessonDialog';
import {ControlIndex} from './ControlIndex';
import {SurfaceNavigator} from './SurfaceNavigator';
import {readResumeTarget, saveResumeTarget, type ResumeTarget} from '@/lib/resume-state';
import {ShiftProvider, useShift} from './ShiftContext';
import {ShiftToggle} from './ShiftToggle';
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

const MIXER_ORIENTATION_CONTROL_IDS = new Set([
  'mixer-ch1-input', 'mixer-ch2-input', 'mixer-ch3-input', 'mixer-ch4-input',
  'mixer-ch1-trim', 'mixer-ch2-trim', 'mixer-ch3-trim', 'mixer-ch4-trim',
  'mixer-master-meter-clip', 'mixer-headphones-mixing', 'mixer-crossfader',
]);
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
  const activeRbRegion = isRbDeck ? getRbDeckRegion(activeRegionId) : undefined;
  const activeMixerRegion = isMixer ? getMixerRegion(activeMixerRegionId) : undefined;
  const activeDeckRegion = isDeck ? getDeckRegion(activeDeckRegionId) : undefined;
  const activeRegion = activeRbRegion ?? activeMixerRegion ?? activeDeckRegion;
  const shouldScopeToRegion = !isHardwareSection || selectedControlId !== null;
  const targetRect = isHardwareSection
    ? activeSection?.id === 'mixer'
      ? getMixerVisualRect('signal', isNarrow)
      : activeSection?.rect ?? FULL
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
  const controls = isHardwareSection
    && activeSection?.id === 'mixer'
    && selectedControlId === null
    ? scopedControls.filter((control) => MIXER_ORIENTATION_CONTROL_IDS.has(control.id))
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
    setSelectedControlId(null);
    setOverlayMode('none');
    setCrop({
      sectionId: nextSectionId,
      rect: nextSectionId === 'mixer'
        ? getMixerVisualRect('signal', isNarrow)
        : nextSectionSpec.rect,
    });
  }, [isNarrow, section, surface]);

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
      const focusedRect = rbRegion
        ? getRbDeckVisualRect(rbRegion.id, isNarrow)
        : mixerRegion
          ? getMixerVisualRect(mixerRegion.id, isNarrow)
          : deckRegion
              ? isDeck
              ? getDeckVisualRect(deckRegion.id, activeSection.id as 'deck-left' | 'deck-right')
              : activeSection.rect
            : activeSection.rect;
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
  }, [activeSection, allControls, isDeck, isHardwareSection, isMixer, isNarrow, isRbDeck, sectionId, surface]);

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
        rect: activeSection.id === 'mixer'
          ? getMixerVisualRect('signal', isNarrow)
          : activeSection.rect,
      });
    }
    queueMicrotask(() => initiatorRef.current?.focus());
  }, [activeSection, isHardwareSection, isNarrow, selectedControlId]);

  const resetSectionView = useCallback(() => {
    if (!isHardwareSection || !activeSection) return;
    clearMatchingControlHash(selectedControlId ?? '');
    setSelectedControlId(null);
    setOverlayMode('none');
    if (section === undefined) setFocusedSectionId(null);
    setCrop(section === undefined
      ? {sectionId: undefined, rect: FULL}
      : {
          sectionId: activeSection.id,
          rect: activeSection.id === 'mixer'
            ? getMixerVisualRect('signal', isNarrow)
            : activeSection.rect,
        });
  }, [activeSection, isHardwareSection, isNarrow, section, selectedControlId]);

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
      {surface === 'hardware' ? <ShiftToggle /> : null}
      <div ref={regionNavRef}>
        <SurfaceNavigator
          surface={surface}
          section={activeSection}
          activeRegionId={activeRegion?.id}
          activeRegionLabel={activeRegion?.label}
          selectedControlLabel={selectedControl?.label}
          regions={regions}
          showRegionTabs={surface === 'hardware' ? activeSection === undefined : true}
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
      </div>
      {isHardwareSection ? (
        <Stack direction="vertical" gap={1} className={styles.sectionIntro}>
          <Text as="h1" type="display-1" className={styles.sectionHeading}>
            {activeSection.label}
          </Text>
          <Text as="p" type="supporting" textWrap="pretty">
            Explore the map, then tap a pulsing marker to zoom in and open its lesson.
          </Text>
        </Stack>
      ) : null}
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
      {isHardwareSection && selectedControlId ? (
        <Stack direction="horizontal" gap={2} align="center" wrap="wrap">
          <Text type="supporting" color="secondary">
            Focused on {selectedControl?.label ?? 'this control'}.
          </Text>
          <Button label="Zoom out to section map" variant="ghost" onClick={resetSectionView} />
        </Stack>
      ) : null}
      <Stage surface={surface} rect={stageRect}>
        {activeSection === undefined
          ? (
              <>
                {populatedSections.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={styles.overviewBeacon}
                    style={{left: `${candidate.marker.x * 100}%`, top: `${candidate.marker.y * 100}%`}}
                  >
                    <HotspotMarker
                      aria-label={`Explore ${candidate.label}`}
                      onClick={() => focusSection(candidate.id)}
                    />
                    <span className={styles.overviewBeaconLabel}>{candidate.label}</span>
                  </div>
                ))}
                {unavailableSections.map((candidate) => (
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
          : isCompactSection
            ? null
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
      </Stage>
      {activeSection && (
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
      {activeSection?.id === 'browser' && <Text>{browserSectionIntro}</Text>}
      {activeSection?.id === 'fx' && (
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
      {activeSection === undefined && isNarrow && (
        <List
          hasDividers
          density="spacious"
          header={<Text type="label">Available lessons</Text>}
        >
          {populatedSections.map((candidate) => (
            <ListItem
              key={candidate.id}
              label={candidate.label}
              description={surface === 'hardware'
                ? `Open the ${candidate.label.toLowerCase()} controls and practical lessons.`
                : 'Learn the visible deck fields and their hardware counterparts.'}
              {...(surface === 'hardware'
                ? {onClick: () => focusSection(candidate.id)}
                : {href: `${baseHref}/${candidate.id}`})}
            />
          ))}
          {surface === 'hardware' && (
            <>
              <ListItem href="/controller/rear" label="Rear connections" description="Audio, microphones, power, dual USB routing, safe changeovers, and setup recipes" />
              <ListItem href="/controller/front" label="Front headphones" description="The shared cue bus and its two headphone plug sizes" />
            </>
          )}
        </List>
      )}
      {activeSection === undefined && surface === 'software' && unavailableSections.length > 0 && (
        <Text type="supporting">
          {isNarrow
            ? 'Player deck is the published rekordbox 7 lesson. More Performance mode zones will be added as their teaching content is completed.'
            : 'Muted zone names are orientation only; their lesson routes are not published yet.'}
        </Text>
      )}
      {activeSection === undefined && surface === 'hardware' && !isNarrow && (
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
      {showControlIndex && activeSection && (
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
      {(detailAssets.length > 0 || tutorialVideos.length > 0) && (
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
