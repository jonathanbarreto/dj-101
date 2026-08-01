'use client';

import {useState} from 'react';
import {SECTIONS, SURFACES} from '@/content';
import type {Rect, Surface} from '@/content';
import {cropStyle} from '@/lib/geometry';

const FULL: Rect = {x: 0, y: 0, w: 1, h: 1};

export function CoordPicker() {
  const [surface, setSurface] = useState<Surface>('hardware');
  const [rect, setRect] = useState<Rect>(FULL);
  const [picks, setPicks] = useState<string[]>([]);
  const spec = SURFACES[surface];

  function chooseSurface(nextSurface: Surface) {
    setSurface(nextSurface);
    setRect(FULL);
  }

  function handlePick(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const viewportX = (event.clientX - bounds.left) / bounds.width;
    const viewportY = (event.clientY - bounds.top) / bounds.height;
    const x = rect.x + viewportX * rect.w;
    const y = rect.y + viewportY * rect.h;

    setPicks((current) => [`at: {x: ${x.toFixed(4)}, y: ${y.toFixed(4)}},`, ...current]);
  }

  return (
    <div style={{padding: 16, fontFamily: 'monospace'}}>
      <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <select value={surface} onChange={(event) => chooseSurface(event.target.value as Surface)}>
          <option value="hardware">hardware</option>
          <option value="software">software</option>
        </select>
        <button type="button" onClick={() => setRect(FULL)}>full</button>
        {Object.values(SECTIONS)
          .filter((section) => section.surface === surface)
          .map((section) => (
            <button key={section.id} type="button" onClick={() => setRect(section.rect)}>
              {section.id}
            </button>
          ))}
        <button type="button" onClick={() => setPicks([])}>clear</button>
      </div>
      <div
        onClick={handlePick}
        style={{
          position: 'relative',
          overflow: 'hidden',
          cursor: 'crosshair',
          width: '100%',
          aspectRatio: `${rect.w * spec.naturalWidth} / ${rect.h * spec.naturalHeight}`,
          border: '1px solid #888',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={spec.image}
          alt=""
          style={{position: 'absolute', maxWidth: 'none', ...cropStyle(rect)}}
        />
      </div>
      <pre style={{marginTop: 12, maxHeight: 240, overflow: 'auto'}}>{picks.join('\n')}</pre>
    </div>
  );
}
