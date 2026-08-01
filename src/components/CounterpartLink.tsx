'use client';

import Link from 'next/link';
import {getControl} from '@/content';

export interface CounterpartLinkProps {
  ids: string[];
}

export function CounterpartLink({ids}: CounterpartLinkProps) {
  const targets = ids.map(getControl).filter((target) => target !== undefined);

  if (targets.length === 0) return null;

  return (
    <div>
      {targets.map((target) => {
        const base = target.surface === 'software' ? '/rekordbox' : '/controller';
        const location = target.surface === 'software' ? 'on screen' : 'on the controller';

        return (
          <div key={target.id}>
            <Link href={`${base}/${target.section}#${target.id}`}>
              See {target.label} {location} →
            </Link>
          </div>
        );
      })}
    </div>
  );
}
