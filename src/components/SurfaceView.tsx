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
import {mixerGainControls, mixerSignalFlowSteps} from '@/content/hardware/mixer';
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
import {ControlLessonPanel} from './ControlLesson';
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
    rect: FULL,
  });
  const [openControlId, setOpenControlId] = useState<string | null>(null);
  const [pendingControlId, setPendingControlId] = useState<string | null>(null);
  const stageRect = crop.sectionId === sectionId ? crop.rect : FULL;
  const baseHref = surface === 'hardware' ? '/controller' : '/rekordbox';
  const sections = Object.values(SECTIONS).filter((candidate) => candidate.surface === surface);
  const populatedSections = sections.filter((candidate) => controlsInSection(candidate.id).length > 0);
  const unavailableSections = sections.filter((candidate) => controlsInSection(candidate.id).length === 0);
  const isCompactSection = isNarrow && section !== undefined;
  const showControlIndex = (activeRegion !== undefined && controls.length > 0)
    || (isCompactSection && controls.length > 0);
  const openCompactControl = isCompactSection
    ? controls.find((control) => control.id === openControlId)
    : undefined;

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
    setOpenControlId(isCompactSection ? control.id : null);
    setPendingControlId(control.id);

    if (updateHash && typeof window !== 'undefined') {
      const nextHash = `#${encodeURIComponent(control.id)}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
      }
    }
    return true;
  }, [allControls, isCompactSection, isDeck, isMixer, isRbDeck]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCrop({sectionId: section?.id, rect: targetRect});
    });
    return () => window.cancelAnimationFrame(frame);
  }, [section?.id, targetRect]);

  useEffect(() => {
    if (!section) return;
    const openHashTarget = () => {
      const id = hashControlId();
      if (!id || !activateControl(id, false)) {
        setOpenControlId(null);
        setPendingControlId(null);
      }
    };
    openHashTarget();
    window.addEventListener('hashchange', openHashTarget);
    return () => window.removeEventListener('hashchange', openHashTarget);
  }, [activateControl, section]);

  useEffect(() => {
    if (!pendingControlId) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        if (isCompactSection) {
          document.getElementById(`${pendingControlId}-lesson`)?.focus();
        } else {
          const trigger = document
            .getElementById(pendingControlId)
            ?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]');
          if (trigger) {
            trigger.focus();
            setOpenControlId(pendingControlId);
          }
        }
        setPendingControlId(null);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [pendingControlId, activeRegionId, activeMixerRegionId, activeDeckRegionId, isCompactSection]);

  useEffect(() => {
    if (!openControlId) return;
    if (isCompactSection) {
      document.getElementById(`${openControlId}-lesson`)?.focus();
      return;
    }
    const dialog = document
      .getElementById(openControlId)
      ?.querySelector<HTMLElement>('[role="dialog"]');
    const destination = dialog?.querySelector<HTMLElement>('a[href], button');
    destination?.focus();
  }, [isCompactSection, openControlId]);

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

  const closeCompactLesson = useCallback((controlId: string) => {
    setOpenControlId(null);
    setPendingControlId(null);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    queueMicrotask(() => {
      document
        .querySelector<HTMLElement>(`[data-control-id="${controlId}"] button`)
        ?.focus();
    });
  }, []);

  function selectRegion(value: string) {
    if (isMixer) setActiveMixerRegionId(value as MixerRegionId);
    else if (isDeck) setActiveDeckRegionId(value as DeckRegionId);
    else setActiveRegionId(value as RbDeckRegionId);
    setOpenControlId(null);
    setPendingControlId(null);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  }

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
      {activeRegion && (
        <div className={styles.regionNav} ref={regionNavRef}>
          <TabList
            value={activeRegion.id}
            onChange={selectRegion}
            size="sm"
            layout={isMixer ? 'hug' : 'fill'}
            hasDivider
            aria-label={isMixer ? 'Mixer lesson region' : isDeck ? 'Deck lesson region' : 'Player deck region'}
          >
            {(isMixer ? MIXER_REGIONS : isDeck ? DECK_REGIONS : RB_DECK_REGIONS).map((region) => (
              <Tab key={region.id} value={region.id} label={region.label} />
            ))}
          </TabList>
        </div>
      )}
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
                isOpen={openControlId === control.id}
                onOpenChange={(nextIsOpen) => {
                  if (nextIsOpen) {
                    if (openControlId === control.id) return;
                    if (activateControl(control.id, true)) {
                      setOpenControlId(control.id);
                    }
                  } else {
                    setOpenControlId(null);
                    clearMatchingControlHash(control.id);
                  }
                }}
                markerOffset={activeRbRegion
                  ? getRbDeckMarkerOffset(control.id, isNarrow)
                  : undefined}
              />
            ))}
      </Stage>
      {openCompactControl && (
        <div
          id={`${openCompactControl.id}-lesson`}
          className={styles.compactLesson}
          role="region"
          aria-label={`${openCompactControl.label} lesson`}
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            closeCompactLesson(openCompactControl.id);
          }}
        >
          <div className={styles.compactLessonClose}>
            <Button
              label="Close lesson"
              size="sm"
              variant="ghost"
              onClick={() => closeCompactLesson(openCompactControl.id)}
            />
          </div>
          <ControlLessonPanel control={openCompactControl} isShiftActive={isShiftActive} />
        </div>
      )}
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
          <List
            density="balanced"
            hasDividers
            header={<Text type="label">Controls in {activeRegion?.label ?? section.label}</Text>}
          >
            {controls.map((control: Control) => (
              <ListItem
                key={control.id}
                data-control-id={control.id}
                className={styles.controlIndexItem}
                label={isShiftActive && control.shift
                  ? control.shiftLegend ?? control.label
                  : control.label}
                description={isShiftActive && control.shift
                  ? control.shift.summary
                  : control.primary.summary}
                onClick={() => activateControl(control.id, true)}
                isSelected={openControlId === control.id}
              />
            ))}
          </List>
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
