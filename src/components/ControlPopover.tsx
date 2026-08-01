'use client';

import {Badge} from '@astryxdesign/core/Badge';
import {Markdown} from '@astryxdesign/core/Markdown';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Link} from '@astryxdesign/core/Link';
import type {Control} from '@/content/types';
import {CounterpartLink} from './CounterpartLink';

export interface ControlPopoverProps {
  control: Control;
  isShiftActive: boolean;
}

export function ControlPopover({control, isShiftActive}: ControlPopoverProps) {
  const shiftBehavior = isShiftActive ? control.shift : undefined;
  const behavior = shiftBehavior ?? control.primary;
  const label = shiftBehavior ? control.shiftLegend ?? control.label : control.label;

  return (
    <Stack direction="vertical" gap={3}>
      <Stack direction="horizontal" gap={2} align="center" wrap="wrap">
        <Heading level={2}>{label}</Heading>
        {shiftBehavior && <Badge label="SHIFT" />}
        {behavior.tier === 'subscription' && (
          <Badge variant="warning" label="Subscription required" />
        )}
      </Stack>

      <Text>{behavior.summary}</Text>
      <Markdown headingLevelStart={3}>{behavior.detail}</Markdown>

      <Stack direction="vertical" gap={1}>
        <Text type="label">When to use it</Text>
        <Markdown headingLevelStart={3}>{behavior.why}</Markdown>
      </Stack>

      {behavior.gotcha && <Text>⚠︎ {behavior.gotcha}</Text>}
      {behavior.tips && behavior.tips.length > 0 && (
        <Markdown headingLevelStart={3}>
          {behavior.tips.map((tip) => `- ${tip}`).join('\n')}
        </Markdown>
      )}
      {control.counterpart && control.counterpart.length > 0 && (
        <CounterpartLink ids={control.counterpart} />
      )}
      {control.referenceLinks && control.referenceLinks.length > 0 && (
        <Stack direction="vertical" gap={1}>
          <Text type="label">Learn more</Text>
          {control.referenceLinks.map((link) => (
            <Link key={link.href} href={link.href}>{link.label} →</Link>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
