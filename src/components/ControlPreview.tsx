'use client';

import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading, Text} from '@astryxdesign/core/Text';
import type {Control} from '@/content/types';
import {getActiveControlBehavior} from './ControlLesson';
import styles from './ControlLessonDialog.module.css';

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<([^>]+)>/g, '$1')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/([*_~])([^*_~]+)\1/g, '$2')
    .replace(/^\s*(?:[-+*]|\d+\.)\s+/gm, '')
    .replace(/\\([\\`*_[\]{}()#+.!-])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getPhysicalAction(detail: string): string {
  const prose = detail
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !/^#{1,6}(?:\s|$)/.test(line))
    .join(' ');
  const plainText = stripMarkdown(prose);
  const firstSentence = plainText.match(/^.*?[.!?](?=\s|$)/)?.[0];

  return firstSentence ?? plainText;
}

export interface ControlPreviewProps {
  control: Control;
  isShiftActive: boolean;
  onReadLesson: () => void;
  onClose: () => void;
}

export function ControlPreview({
  control,
  isShiftActive,
  onReadLesson,
  onClose,
}: ControlPreviewProps) {
  const {behavior, isShiftBehavior, label} = getActiveControlBehavior(control, isShiftActive);
  const physicalAction = getPhysicalAction(behavior.detail);

  return (
    <Stack direction="vertical" gap={3}>
      <Stack direction="horizontal" gap={2} align="center" wrap="wrap">
        <Heading level={2}>{label}</Heading>
        {isShiftBehavior && <Badge label="SHIFT" />}
      </Stack>
      <Text as="p">{behavior.summary}</Text>
      <Text as="p" className={styles.physicalAction}>
        {`Physical action: ${physicalAction}`}
      </Text>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Button label="Read full lesson" variant="primary" onClick={onReadLesson} />
        <Button label="Close" variant="ghost" onClick={onClose} />
      </Stack>
    </Stack>
  );
}
