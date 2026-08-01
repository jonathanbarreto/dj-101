'use client';

import {useEffect, useState} from 'react';
import {Popover} from '@astryxdesign/core/Popover';
import type {Control, Rect} from '@/content/types';
import {isVisible, toViewport} from '@/lib/geometry';
import {ControlPopover} from './ControlPopover';
import {HotspotMarker} from './HotspotMarker';

export interface HotspotProps {
  control: Control;
  rect: Rect;
  isShiftActive: boolean;
}

export function Hotspot({control, rect, isShiftActive}: HotspotProps) {
  const visible = isVisible(control.at, rect);
  const [openControlId, setOpenControlId] = useState<string | null>(null);
  const isOpen = visible && openControlId === control.id;

  useEffect(() => {
    if (openControlId !== null && (!visible || openControlId !== control.id)) {
      setOpenControlId(null);
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
      }}
    >
      <Popover
        key={control.id}
        isOpen={isOpen}
        onOpenChange={(nextIsOpen) => {
          setOpenControlId(nextIsOpen ? control.id : null);
        }}
        label={label}
        placement="below"
        width={340}
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
