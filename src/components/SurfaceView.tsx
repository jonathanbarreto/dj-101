'use client';

import Link from 'next/link';
import {Stack} from '@astryxdesign/core/Stack';
import {controlsInSection, SECTIONS} from '@/content';
import type {Rect, SectionId, Surface} from '@/content/types';
import {Hotspot} from './Hotspot';
import {ShiftProvider, useShift} from './ShiftContext';
import {ShiftToggle} from './ShiftToggle';
import {Stage} from './Stage';

const FULL: Rect = {x: 0, y: 0, w: 1, h: 1};

export interface SurfaceViewProps {
  surface: Surface;
  sectionId?: SectionId;
}

function SurfaceViewInner({surface, sectionId}: SurfaceViewProps) {
  const {isShiftActive} = useShift();
  const section = sectionId === undefined ? undefined : SECTIONS[sectionId];
  const rect = section?.rect ?? FULL;
  const baseHref = surface === 'hardware' ? '/controller' : '/rekordbox';
  const sections = Object.values(SECTIONS).filter((candidate) => candidate.surface === surface);
  const controls = section === undefined ? [] : controlsInSection(section.id);

  return (
    <Stack direction="vertical" gap={3} xstyle={undefined}>
      {surface === 'hardware' ? <ShiftToggle /> : null}
      <Stage surface={surface} rect={rect}>
        {section === undefined
          ? sections.map((candidate) => (
              <Link
                key={candidate.id}
                href={`${baseHref}/${candidate.id}`}
                style={{
                  position: 'absolute',
                  left: `${candidate.marker.x * 100}%`,
                  top: `${candidate.marker.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--radius-container)',
                  background: 'var(--color-background-primary)',
                  color: 'var(--color-text-primary)',
                  boxShadow: 'var(--shadow-overlay)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {candidate.label}
              </Link>
            ))
          : controls.map((control) => (
              <Hotspot
                key={control.id}
                control={control}
                rect={rect}
                isShiftActive={isShiftActive}
              />
            ))}
      </Stage>
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
