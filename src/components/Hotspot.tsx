'use client';

import {useEffect, useState} from 'react';
import {Popover} from '@astryxdesign/core/Popover';
import type {Control, Point, Rect} from '@/content/types';
import {isVisible, toViewport} from '@/lib/geometry';
import {ControlPopover} from './ControlPopover';
import {HotspotMarker} from './HotspotMarker';

export interface HotspotProps {
  control: Control;
  rect: Rect;
  isShiftActive: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  markerOffset?: Point;
}

export function Hotspot({
  control,
  rect,
  isShiftActive,
  isOpen: controlledIsOpen,
  onOpenChange,
  markerOffset = {x: 0, y: 0},
}: HotspotProps) {
  const visible = isVisible(control.at, rect);
  const [openControlId, setOpenControlId] = useState<string | null>(null);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = visible && (isControlled ? controlledIsOpen : openControlId === control.id);

  function setOpen(nextIsOpen: boolean) {
    if (!nextIsOpen) {
      queueMicrotask(() => {
        document
          .getElementById(control.id)
          ?.querySelector<HTMLButtonElement>('button[aria-haspopup="dialog"]')
          ?.focus();
      });
    }
    if (!isControlled) setOpenControlId(nextIsOpen ? control.id : null);
    onOpenChange?.(nextIsOpen);
  }

  useEffect(() => {
    if (openControlId !== null && (!visible || openControlId !== control.id)) {
      setOpen(false);
    }
  }, [control.id, openControlId, visible]);

  if (!visible) return null;

  const position = toViewport(control.at, rect);
  const hasShiftBehavior = isShiftActive && control.shift !== undefined;
  const label = hasShiftBehavior ? control.shiftLegend ?? control.label : control.label;

  return (
    <div
      id={control.id}
      style={{
        position: 'absolute',
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
        transform: `translate(${markerOffset.x}px, ${markerOffset.y}px)`,
        transition:
          'left var(--duration-medium) var(--ease-standard), ' +
          'top var(--duration-medium) var(--ease-standard)',
      }}
    >
      {(markerOffset.x !== 0 || markerOffset.y !== 0) && (
        <span
          aria-hidden="true"
          data-hotspot-leader
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${Math.hypot(markerOffset.x, markerOffset.y)}px`,
            height: '2px',
            transformOrigin: 'left center',
            transform: `rotate(${Math.atan2(-markerOffset.y, -markerOffset.x)}rad)`,
            background: 'var(--color-border-emphasized)',
          }}
        />
      )}
      <Popover
        key={control.id}
        isOpen={isOpen}
        onOpenChange={setOpen}
        label={label}
        placement="below"
        width="min(340px, calc(100vw - 2 * var(--spacing-3)))"
        content={<ControlPopover control={control} isShiftActive={isShiftActive} />}
      >
        {(triggerProps) => (
          <HotspotMarker
            markerRef={triggerProps.ref}
            onClick={triggerProps.onClick}
            aria-haspopup={triggerProps['aria-haspopup']}
            aria-expanded={triggerProps['aria-expanded']}
            aria-controls={triggerProps['aria-controls']}
            aria-label={label}
            isOpen={isOpen}
          />
        )}
      </Popover>
    </div>
  );
}
