'use client';

import Image from 'next/image';
import {SURFACES} from '@/content';
import {cropCanvasStyle, cropStyle} from '@/lib/geometry';
import type {Rect, Surface} from '@/content/types';
import styles from './Stage.module.css';

export interface StageProps {
  surface: Surface;
  rect: Rect;
  children?: React.ReactNode;
}

export function Stage({surface, rect, children}: StageProps) {
  const spec = SURFACES[surface];
  const crop = cropStyle(rect);
  const canvasStyle = cropCanvasStyle(rect, spec.naturalWidth, spec.naturalHeight);
  const sizes = `${Math.ceil(100 / rect.w)}vw`;

  return (
    <div className={styles.stage} data-testid="stage" data-stable-stage="true">
      <div className={styles.canvas} data-testid="stage-canvas" style={canvasStyle}>
        <Image
          className={styles.image}
          src={spec.image}
          alt={spec.label}
          width={spec.naturalWidth}
          height={spec.naturalHeight}
          priority
          sizes={sizes}
          style={{position: 'absolute', maxWidth: 'none', ...crop}}
        />
        <div className={styles.hotspots}>{children}</div>
      </div>
    </div>
  );
}
