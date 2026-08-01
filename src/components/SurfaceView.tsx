'use client';

import {Link} from '@astryxdesign/core/Link';
import {List, ListItem} from '@astryxdesign/core/List';
import {Stack} from '@astryxdesign/core/Stack';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Text} from '@astryxdesign/core/Text';
import {useMediaQuery} from '@astryxdesign/core/hooks';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {controlsInSection, SECTIONS} from '@/content';
import {browserSectionIntro} from '@/content/hardware/browser';
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
import {ControlPopover} from './ControlPopover';
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
  const value = decodeURIComponent(window.location.hash.slice(1));
  return value || null;
}

function SurfaceViewInner({surface, sectionId}: SurfaceViewProps) {
  const {isShiftActive} = useShift();
  const section = sectionId === undefined ? undefined : SECTIONS[sectionId];
  const isRbDeck = sectionId === 'rb-deck';
  const isNarrow = useMediaQuery('(max-width: 767px)', false);
  const allControls = useMemo(
    () => (section === undefined ? [] : controlsInSection(section.id)),
    [section],
  );
  const [activeRegionId, setActiveRegionId] = useState<RbDeckRegionId>('info');
  const activeRegion = isRbDeck ? getRbDeckRegion(activeRegionId) : undefined;
  const targetRect = activeRegion
    ? getRbDeckVisualRect(activeRegion.id, isNarrow)
    : section?.rect ?? FULL;
  const controls = activeRegion
    ? allControls.filter((control) => activeRegion.controlIds.includes(control.id))
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
  const isCompactHardware = isNarrow && section !== undefined && surface === 'hardware';
  const showControlIndex = activeRegion !== undefined
    || isCompactHardware;
  const openCompactControl = isCompactHardware
    ? controls.find((control) => control.id === openControlId)
    : undefined;

  const activateControl = useCallback((controlId: string, updateHash: boolean) => {
    const control = allControls.find((candidate) => candidate.id === controlId);
    if (!control) return false;

    const region = isRbDeck ? getRbDeckRegionForControl(control.id) : undefined;
    if (isRbDeck && !region) return false;
    if (region) setActiveRegionId(region.id);
    setOpenControlId(isCompactHardware ? control.id : null);
    setPendingControlId(control.id);

    if (updateHash && typeof window !== 'undefined') {
      const nextHash = `#${encodeURIComponent(control.id)}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
      }
    }
    return true;
  }, [allControls, isCompactHardware, isRbDeck]);

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
        if (isCompactHardware) {
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
  }, [pendingControlId, activeRegionId, isCompactHardware]);

  useEffect(() => {
    if (!openControlId) return;
    const dialog = document
      .getElementById(openControlId)
      ?.querySelector<HTMLElement>('[role="dialog"]');
    const destination = dialog?.querySelector<HTMLElement>('a[href], button');
    destination?.focus();
  }, [openControlId]);

  function selectRegion(value: string) {
    setActiveRegionId(value as RbDeckRegionId);
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
      {activeRegion && (
        <div className={styles.regionNav}>
          <TabList
            value={activeRegion.id}
            onChange={selectRegion}
            size="sm"
            layout="fill"
            hasDivider
            aria-label="Player deck region"
          >
            {RB_DECK_REGIONS.map((region) => (
              <Tab key={region.id} value={region.id} label={region.label} />
            ))}
          </TabList>
        </div>
      )}
      <Stage surface={surface} rect={stageRect}>
        {section === undefined
          ? sections.map((candidate) => (
              <Link
                key={candidate.id}
                href={`${baseHref}/${candidate.id}`}
                className={styles.overviewLink}
                style={{
                  left: `${candidate.marker.x * 100}%`,
                  top: `${candidate.marker.y * 100}%`,
                }}
              >
                {candidate.label}
              </Link>
            ))
          : isCompactHardware
            ? null
            : controls.map((control) => (
              <Hotspot
                key={control.id}
                control={control}
                rect={stageRect}
                isShiftActive={isShiftActive}
                isOpen={openControlId === control.id}
                onOpenChange={(nextIsOpen) => {
                  setOpenControlId(nextIsOpen ? control.id : null);
                }}
                markerOffset={activeRegion
                  ? getRbDeckMarkerOffset(control.id, isNarrow)
                  : undefined}
              />
            ))}
      </Stage>
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
                label={control.label}
                description={control.primary.summary}
                onClick={() => activateControl(control.id, true)}
                isSelected={openControlId === control.id}
              />
            ))}
          </List>
          {openCompactControl && (
            <div
              id={`${openCompactControl.id}-lesson`}
              className={styles.compactLesson}
              role="region"
              aria-label={`${openCompactControl.label} lesson`}
              tabIndex={-1}
              onKeyDown={(event) => {
                if (event.key !== 'Escape') return;
                setOpenControlId(null);
                queueMicrotask(() => {
                  document
                    .querySelector<HTMLElement>(
                      `[data-control-id="${openCompactControl.id}"] button`,
                    )
                    ?.focus();
                });
              }}
            >
              <ControlPopover
                control={openCompactControl}
                isShiftActive={isShiftActive}
              />
            </div>
          )}
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
