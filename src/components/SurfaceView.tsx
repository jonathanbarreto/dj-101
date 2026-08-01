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
import {ControlLessonDialog} from './ControlLessonDialog';
import {ControlIndex} from './ControlIndex';
import {SurfaceNavigator} from './SurfaceNavigator';
import {readResumeTarget, saveResumeTarget, type ResumeTarget} from '@/lib/resume-state';
import {ShiftProvider, useShift} from './ShiftContext';
import {ShiftToggle} from './ShiftToggle';
import {Stage} from './Stage';
import styles from './SurfaceView.module.css';

const FULL: Rect = {x: 0, y: 0, w: 1, h: 1};

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
  const isRbDeck = sectionId === 'rb-deck';
  const isMixer = sectionId === 'mixer';
  const isDeck = isDeckSection(sectionId);
  const isNarrow = useMediaQuery('(max-width: 767px)', false);
  const regionNavRef = useRef<HTMLDivElement>(null);
  const allControls = useMemo(
    () => (section === undefined ? [] : controlsInSection(section.id)),
    [section],
  );
  const [activeRegionId, setActiveRegionId] = useState<RbDeckRegionId>('info');
  const [activeMixerRegionId, setActiveMixerRegionId] = useState<MixerRegionId>('signal');
  const [activeDeckRegionId, setActiveDeckRegionId] = useState<DeckRegionId>('transport');
  const activeRbRegion = isRbDeck ? getRbDeckRegion(activeRegionId) : undefined;
  const activeMixerRegion = isMixer ? getMixerRegion(activeMixerRegionId) : undefined;
  const activeDeckRegion = isDeck ? getDeckRegion(activeDeckRegionId) : undefined;
  const activeRegion = activeRbRegion ?? activeMixerRegion ?? activeDeckRegion;
  const targetRect = activeRbRegion
    ? getRbDeckVisualRect(activeRbRegion.id, isNarrow)
    : activeMixerRegion
      ? getMixerVisualRect(activeMixerRegion.id, isNarrow)
    : activeDeckRegion && isDeck
      ? getDeckVisualRect(activeDeckRegion.id, sectionId)
    : sectionId === 'browser'
      ? getBrowserVisualRect(isNarrow)
      : section?.rect ?? FULL;
  const activeControlIds = activeRbRegion?.controlIds
    ?? activeMixerRegion?.controlIds
    ?? (activeDeckRegion && isDeck
      ? controlsForDeckRegion(activeDeckRegion, sectionId)
      : undefined);
  const controls = activeControlIds
    ? activeControlIds
        .map((id) => allControls.find((control) => control.id === id))
        .filter((control): control is Control => control !== undefined)
    : allControls;
  const [crop, setCrop] = useState<{sectionId?: SectionId; rect: Rect}>({
    sectionId,
    rect: targetRect,
  });
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);
  const [overlayMode, setOverlayMode] = useState<'none' | 'preview' | 'lesson'>('none');
  const [resumeTarget, setResumeTarget] = useState<ResumeTarget | null>(null);
  const initiatorRef = useRef<HTMLElement | null>(null);
  const stageRect = crop.sectionId === sectionId ? crop.rect : FULL;
  const baseHref = surface === 'hardware' ? '/controller' : '/rekordbox';
  const sections = Object.values(SECTIONS).filter((candidate) => candidate.surface === surface);
  const populatedSections = sections.filter((candidate) => controlsInSection(candidate.id).length > 0);
  const unavailableSections = sections.filter((candidate) => controlsInSection(candidate.id).length === 0);
  const isCompactSection = isNarrow && section !== undefined;
  const showControlIndex = (activeRegion !== undefined && controls.length > 0)
    || (isCompactSection && controls.length > 0);
  const selectedControl = allControls.find((control) => control.id === selectedControlId) ?? null;

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
    setSelectedControlId(control.id);
    setOverlayMode(isNarrow ? 'lesson' : 'preview');
    if (section) saveResumeTarget({surface, sectionId: section.id, controlId: control.id});

    if (updateHash && typeof window !== 'undefined') {
      const nextHash = `#${encodeURIComponent(control.id)}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
      }
    }
    return true;
  }, [allControls, isDeck, isMixer, isNarrow, isRbDeck, section, surface]);

  useEffect(() => {
    setCrop({sectionId: section?.id, rect: targetRect});
  }, [section?.id, targetRect]);

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
    queueMicrotask(() => initiatorRef.current?.focus());
  }, [selectedControlId]);

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
      {sectionId === 'browser' && <Text>{browserSectionIntro}</Text>}
      {sectionId === 'fx' && (
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
      <div ref={regionNavRef}>
        <SurfaceNavigator
          surface={surface}
          section={section}
          activeRegionId={activeRegion?.id}
          activeRegionLabel={activeRegion?.label}
          selectedControlLabel={selectedControl?.label}
          regions={regions}
          isCompact={isNarrow}
          overflowRegionIds={isMixer ? ['color-fx', 'outputs', 'monitoring', 'mic'] : undefined}
          onViewMap={() => {
            if (!section) return;
            const target = {surface, sectionId: section.id, controlId: selectedControlId ?? undefined};
            saveResumeTarget(target);
            setResumeTarget(target);
          }}
          onRegionChange={(value) => {
            if (section) {
              saveResumeTarget({surface, sectionId: section.id, controlId: selectedControlId ?? undefined});
            }
            selectRegion(value);
          }}
          resumeTarget={resumeTarget ?? undefined}
        />
      </div>
      {activeMixerRegion && (
        <div className={styles.regionHint}>
          <Text type="supporting">Swipe horizontally for all mixer lessons →</Text>
        </div>
      )}
      {activeMixerRegion?.id === 'signal' && (
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
        {section === undefined
          ? isNarrow ? null : (
              <>
                {populatedSections.map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`${baseHref}/${candidate.id}`}
                    className={styles.overviewLink}
                    data-testid="overview-overlay-link"
                    style={{left: `${candidate.marker.x * 100}%`, top: `${candidate.marker.y * 100}%`}}
                  >
                    {candidate.label}
                  </Link>
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
      {section === undefined && isNarrow && (
        <List
          hasDividers
          density="spacious"
          header={<Text type="label">Available lessons</Text>}
        >
          {populatedSections.map((candidate) => (
            <ListItem
              key={candidate.id}
              href={`${baseHref}/${candidate.id}`}
              label={candidate.label}
              description={surface === 'hardware'
                ? `Open the ${candidate.label.toLowerCase()} controls and practical lessons.`
                : 'Learn the visible deck fields and their hardware counterparts.'}
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
      {section === undefined && surface === 'software' && unavailableSections.length > 0 && (
        <Text type="supporting">
          {isNarrow
            ? 'Player deck is the published rekordbox 7 lesson. More Performance mode zones will be added as their teaching content is completed.'
            : 'Muted zone names are orientation only; their lesson routes are not published yet.'}
        </Text>
      )}
      {section === undefined && surface === 'hardware' && !isNarrow && (
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
      {showControlIndex && section && (
        <div className={styles.controlIndex}>
          <ControlIndex
            controls={controls}
            selectedControlId={selectedControlId}
            isShiftActive={isShiftActive}
            title={`Controls in ${activeRegion?.label ?? section.label}`}
            onSelect={(controlId, trigger) => selectControl(controlId, trigger, 'lesson')}
          />
        </div>
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
