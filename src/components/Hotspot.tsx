'use client';

import {useRef} from 'react';
import {Popover} from '@astryxdesign/core/Popover';
import type {Control, Point, Rect} from '@/content/types';
import {isVisible, toViewport} from '@/lib/geometry';
import {ControlPreview} from './ControlPreview';
import {HotspotMarker} from './HotspotMarker';
import styles from './Hotspot.module.css';

export interface HotspotProps {
  control: Control;
  rect: Rect;
  isShiftActive: boolean;
  isSelected?: boolean;
  isPreviewOpen?: boolean;
  onPreviewOpenChange?: (isOpen: boolean, trigger?: HTMLButtonElement | null) => void;
  onReadLesson?: (trigger?: HTMLButtonElement | null) => void;
  /** @deprecated use isPreviewOpen */
  isOpen?: boolean;
  /** @deprecated use onPreviewOpenChange */
  onOpenChange?: (isOpen: boolean) => void;
  markerOffset?: Point;
  showLabel?: boolean;
}

export function Hotspot({
  control,
  rect,
  isShiftActive,
  isSelected,
  isPreviewOpen,
  onPreviewOpenChange,
  onReadLesson,
  isOpen,
  onOpenChange,
  markerOffset = {x: 0, y: 0},
  showLabel = true,
}: HotspotProps) {
  const visible = isVisible(control.at, rect);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

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
        isOpen={(isPreviewOpen ?? isOpen ?? false) && (isSelected ?? true)}
        onOpenChange={(nextIsOpen) => {
          onPreviewOpenChange?.(nextIsOpen, triggerRef.current);
          onOpenChange?.(nextIsOpen);
        }}
        label={label}
        width="min(30rem, calc(100vw - 2 * var(--spacing-4)))"
        content={<ControlPreview
          control={control}
          isShiftActive={isShiftActive}
          onClose={() => onPreviewOpenChange?.(false, triggerRef.current)}
        />}
      >
        {(triggerProps) => (
          <>
            <HotspotMarker
              markerRef={(node) => {
                triggerRef.current = node;
                if (typeof triggerProps.ref === 'function') triggerProps.ref(node);
              }}
              onClick={() => {
                onPreviewOpenChange?.(true, triggerRef.current);
              }}
              aria-haspopup={triggerProps['aria-haspopup']}
              aria-expanded={(isPreviewOpen ?? isOpen ?? false) && (isSelected ?? true)}
              aria-controls={triggerProps['aria-controls']}
              aria-label={label}
              isOpen={(isPreviewOpen ?? isOpen ?? false) && (isSelected ?? true)}
            />
            {showLabel ? <span className={styles.label} data-hotspot-label aria-hidden="true">{label}</span> : null}
          </>
        )}
      </Popover>
    </div>
  );
}
