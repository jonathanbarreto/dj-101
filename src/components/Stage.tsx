'use client';

import Image from 'next/image';
import {SURFACES} from '@/content';
import {cropStyle, cropAspectRatio} from '@/lib/geometry';
import type {Rect, Surface} from '@/content/types';

export interface StageProps {
  surface: Surface;
  rect: Rect;
  children?: React.ReactNode;
}

export function Stage({surface, rect, children}: StageProps) {
  const spec = SURFACES[surface];
  const crop = cropStyle(rect);
  const sizes = `${Math.ceil(100 / rect.w)}vw`;

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', width: '100%',
      aspectRatio: String(cropAspectRatio(rect, spec.naturalWidth, spec.naturalHeight)),
      borderRadius: 'var(--radius-container)',
      transition: 'aspect-ratio var(--duration-medium) var(--ease-standard)',
    }}>
      <Image
        src={spec.image}
        alt={spec.label}
        width={spec.naturalWidth}
        height={spec.naturalHeight}
        priority
        sizes={sizes}
        style={{
          position: 'absolute', maxWidth: 'none', ...crop,
          transition:
            'width var(--duration-medium) var(--ease-standard), ' +
            'height var(--duration-medium) var(--ease-standard), ' +
            'left var(--duration-medium) var(--ease-standard), ' +
            'top var(--duration-medium) var(--ease-standard)',
        }}
      />
      {children}
    </div>
  );
}
