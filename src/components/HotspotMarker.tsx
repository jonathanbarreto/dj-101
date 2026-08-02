'use client';

import type {ButtonHTMLAttributes, Ref} from 'react';
import styles from './HotspotMarker.module.css';

export interface HotspotMarkerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  markerRef?: Ref<HTMLButtonElement>;
}

export function HotspotMarker({
  isOpen = false,
  markerRef,
  className,
  type = 'button',
  ...props
}: HotspotMarkerProps) {
  return (
    <button
      {...props}
      ref={markerRef}
      type={type}
      className={[styles.marker, className].filter(Boolean).join(' ')}
    >
      <span className={styles.ring} aria-hidden="true" />
      <span className={`${styles.ring} ${isOpen ? styles.ringOpen : ''}`} aria-hidden="true" />
      <span
        className={`${styles.dot} ${isOpen ? styles.dotOpen : ''}`}
        aria-hidden="true"
      />
    </button>
  );
}
