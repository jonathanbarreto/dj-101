'use client';

import {Link} from '@astryxdesign/core/Link';
import {Stack} from '@astryxdesign/core/Stack';
import {getControl} from '@/content';

export interface CounterpartLinkProps {
  ids: string[];
}

export function CounterpartLink({ids}: CounterpartLinkProps) {
  const targets = ids.map(getControl).filter((target) => target !== undefined);

  if (targets.length === 0) return null;

  return (
    <Stack direction="vertical" gap={1}>
      {targets.map((target) => {
        const base = target.surface === 'software' ? '/rekordbox' : '/controller';
        const location = target.surface === 'software'
          ? 'on screen'
          : target.section === 'deck-left'
            ? 'on the left deck'
            : target.section === 'deck-right'
              ? 'on the right deck'
              : 'on the controller';

        return (
          <Link key={target.id} href={`${base}/${target.section}#${target.id}`}>
            {`See ${target.label} ${location} →`}
          </Link>
        );
      })}
    </Stack>
  );
}
