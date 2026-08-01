'use client';

import {Link} from '@astryxdesign/core/Link';
import {List, ListItem} from '@astryxdesign/core/List';
import {Stack} from '@astryxdesign/core/Stack';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import {Text} from '@astryxdesign/core/Text';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {controlsInSection, SECTIONS} from '@/content';
import {
  getRbDeckMarkerOffset,
  getRbDeckRegion,
  getRbDeckRegionForControl,
  RB_DECK_REGIONS,
  type RbDeckRegionId,
} from '@/content/rekordbox/deckRegions';
import type {Control, Rect, SectionId, Surface} from '@/content/types';
import {Hotspot} from './Hotspot';
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
  const allControls = useMemo(
    () => (section === undefined ? [] : controlsInSection(section.id)),
    [section],
  );
  const initialHashRegion = isRbDeck
    ? getRbDeckRegionForControl(hashControlId() ?? '')?.id
    : undefined;
  const [activeRegionId, setActiveRegionId] = useState<RbDeckRegionId>(
    initialHashRegion ?? 'info',
  );
  const activeRegion = isRbDeck ? getRbDeckRegion(activeRegionId) : undefined;
  const targetRect = activeRegion?.rect ?? section?.rect ?? FULL;
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

  const activateControl = useCallback((controlId: string, updateHash: boolean) => {
    const control = allControls.find((candidate) => candidate.id === controlId);
    if (!control) return false;

    const region = isRbDeck ? getRbDeckRegionForControl(control.id) : undefined;
    if (isRbDeck && !region) return false;
    if (region) setActiveRegionId(region.id);
    setOpenControlId(null);
    setPendingControlId(control.id);

    if (updateHash && typeof window !== 'undefined') {
      const nextHash = `#${encodeURIComponent(control.id)}`;
      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
      }
    }
    return true;
  }, [allControls, isRbDeck]);

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
        const trigger = document
          .getElementById(pendingControlId)
          ?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]');
        if (trigger) {
          trigger.focus();
          setOpenControlId(pendingControlId);
        }
        setPendingControlId(null);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [pendingControlId, activeRegionId]);

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
                markerOffset={activeRegion ? getRbDeckMarkerOffset(control.id) : undefined}
              />
            ))}
      </Stage>
      {activeRegion && (
        <div className={styles.controlIndex}>
          <List
            density="balanced"
            hasDividers
            header={<Text type="label">Controls in {activeRegion.label}</Text>}
          >
            {controls.map((control: Control) => (
              <ListItem
                key={control.id}
                className={styles.controlIndexItem}
                label={`Open ${control.label} lesson`}
                description={control.primary.summary}
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
