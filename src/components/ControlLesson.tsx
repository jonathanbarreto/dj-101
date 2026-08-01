'use client';

import {Badge} from '@astryxdesign/core/Badge';
import {Link} from '@astryxdesign/core/Link';
import {Markdown} from '@astryxdesign/core/Markdown';
import {Stack} from '@astryxdesign/core/Stack';
import {Text} from '@astryxdesign/core/Text';
import type {Behavior, Control, SourceTag} from '@/content/types';
import {CounterpartLink} from './CounterpartLink';

const SOURCE_LABELS: Record<SourceTag, string> = {
  manual: 'DDJ-1000 manual',
  rekordbox7: 'rekordbox 7 documentation',
  community: 'Community-verified workflow',
};

export interface ActiveControlBehavior {
  behavior: Behavior;
  isShiftBehavior: boolean;
  label: string;
}

export function getActiveControlBehavior(
  control: Control,
  isShiftActive: boolean,
): ActiveControlBehavior {
  const isShiftBehavior = isShiftActive && control.shift !== undefined;

  return {
    behavior: isShiftBehavior ? control.shift! : control.primary,
    isShiftBehavior,
    label: isShiftBehavior ? control.shiftLegend ?? control.label : control.label,
  };
}

export interface ControlLessonProps {
  control: Control;
  isShiftActive: boolean;
}

export function ControlLesson({control, isShiftActive}: ControlLessonProps) {
  const {behavior, isShiftBehavior} = getActiveControlBehavior(control, isShiftActive);

  return (
    <Stack direction="vertical" gap={4}>
      {(isShiftBehavior || behavior.tier === 'subscription') && (
        <Stack direction="horizontal" gap={2} align="center" wrap="wrap">
          {isShiftBehavior && <Badge label="SHIFT" />}
          {behavior.tier === 'subscription' && (
            <Badge variant="warning" label="Subscription required" />
          )}
        </Stack>
      )}

      <Text type="large" as="p">{behavior.summary}</Text>
      <Markdown headingLevelStart={3}>{behavior.detail}</Markdown>

      <Stack direction="vertical" gap={1}>
        <Text type="label">When to use it</Text>
        <Markdown headingLevelStart={3}>{behavior.why}</Markdown>
      </Stack>

      {behavior.gotcha && (
        <Stack direction="vertical" gap={1}>
          <Text type="label">Gotcha</Text>
          <Text as="p">⚠︎ {behavior.gotcha}</Text>
        </Stack>
      )}

      {behavior.tips && behavior.tips.length > 0 && (
        <Stack direction="vertical" gap={1}>
          <Text type="label">Tips</Text>
          <Markdown headingLevelStart={3}>
            {behavior.tips.map((tip) => `- ${tip}`).join('\n')}
          </Markdown>
        </Stack>
      )}

      <Stack direction="vertical" gap={1}>
        <Text type="label">Source</Text>
        <Text type="supporting">{SOURCE_LABELS[behavior.source]}</Text>
      </Stack>

      {control.counterpart && control.counterpart.length > 0 && (
        <Stack direction="vertical" gap={1}>
          <Text type="label">Counterpart</Text>
          <CounterpartLink ids={control.counterpart} />
        </Stack>
      )}

      {control.referenceLinks && control.referenceLinks.length > 0 && (
        <Stack direction="vertical" gap={1}>
          <Text type="label">Learn more</Text>
          {control.referenceLinks.map((link) => (
            <Link key={link.href} href={link.href} isStandalone>
              {link.label} →
            </Link>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
