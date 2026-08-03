'use client';

import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {Stack} from '@astryxdesign/core/Stack';
import {Heading, Text} from '@astryxdesign/core/Text';
import type {Control} from '@/content/types';
import {ControlLesson, getActiveControlBehavior} from './ControlLesson';
import styles from './ControlPreview.module.css';

function proseLines(markdown: string): string[] {
  const lines: string[] = [];
  let fence: {character: string; length: number} | null = null;

  for (const rawLine of markdown.split('\n')) {
    let line = rawLine;
    while (/^\s*>\s?/.test(line)) line = line.replace(/^\s*>\s?/, '');
    const trimmed = line.trimStart();
    const fenceMatch = trimmed.match(/^(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (fence === null) {
        fence = {character: marker[0], length: marker.length};
      } else if (marker[0] === fence.character && marker.length >= fence.length) {
        fence = null;
      }
      continue;
    }
    if (fence !== null) continue;

    if (/^\s{0,3}#{1,6}(?:\s|$)/.test(line)) continue;
    while (/^\s*(?:[-+*]|\d+[.)])\s+/.test(line)) {
      line = line.replace(/^\s*(?:[-+*]|\d+[.)])\s+/, '');
    }
    if (line.trim().length > 0) lines.push(line.trim());
  }

  return lines;
}

function closingBracket(input: string, start: number): number {
  let depth = 0;
  for (let index = start; index < input.length; index += 1) {
    if (input[index] === '\\') {
      index += 1;
      continue;
    }
    if (input[index] === '[') depth += 1;
    if (input[index] === ']') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function balancedDestinationEnd(input: string, start: number): number {
  let depth = 0;
  for (let index = start; index < input.length; index += 1) {
    if (input[index] === '\\') {
      index += 1;
      continue;
    }
    if (input[index] === '(') depth += 1;
    if (input[index] === ')') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function inlineText(markdown: string): string {
  let output = '';

  for (let index = 0; index < markdown.length;) {
    const character = markdown[index];
    const next = markdown[index + 1];

    if (character === '\\' && next !== undefined) {
      output += next;
      index += 2;
      continue;
    }

    if (character === '`') {
      let runLength = 1;
      while (markdown[index + runLength] === '`') runLength += 1;
      const marker = '`'.repeat(runLength);
      const end = markdown.indexOf(marker, index + runLength);
      if (end >= 0) {
        output += markdown.slice(index + runLength, end);
        index = end + runLength;
      } else {
        index += runLength;
      }
      continue;
    }

    const labelStart = character === '!' && next === '['
      ? index + 1
      : character === '['
        ? index
        : -1;
    if (labelStart >= 0) {
      const labelEnd = closingBracket(markdown, labelStart);
      const destinationStart = labelEnd + 1;
      if (labelEnd >= 0 && markdown[destinationStart] === '(') {
        const destinationEnd = balancedDestinationEnd(markdown, destinationStart);
        if (destinationEnd >= 0) {
          output += inlineText(markdown.slice(labelStart + 1, labelEnd));
          index = destinationEnd + 1;
          continue;
        }
      }
    }

    if (character === '<') {
      const end = markdown.indexOf('>', index + 1);
      if (end >= 0) {
        const enclosed = markdown.slice(index + 1, end);
        const isAutolink = /^[a-zA-Z][a-zA-Z\d+.-]*:\S+$/.test(enclosed)
          || /^[^\s@<>]+@[^\s@<>]+$/.test(enclosed);
        const isHtmlTag = /^\/?[a-zA-Z][^>]*$/.test(enclosed) || /^!--/.test(enclosed);
        if (isAutolink) output += enclosed;
        if (isAutolink || isHtmlTag) {
          index = end + 1;
          continue;
        }
      }
    }

    if (character === '*') {
      while (markdown[index] === '*') index += 1;
      continue;
    }
    if (character === '_') {
      const previous = markdown[index - 1];
      if (/\p{L}|\p{N}/u.test(previous ?? '') && /\p{L}|\p{N}/u.test(next ?? '')) {
        output += character;
        index += 1;
      } else {
        while (markdown[index] === '_') index += 1;
      }
      continue;
    }
    if (character === '~' && next === '~') {
      while (markdown[index] === '~') index += 1;
      continue;
    }

    output += character;
    index += 1;
  }

  return output;
}

export function getPhysicalAction(detail: string): string {
  const plainText = inlineText(proseLines(detail).join(' '))
    .replace(/\s+/g, ' ')
    .trim();
  const firstSentence = plainText.match(/^.*?[.!?](?=\s|$)/)?.[0];

  return firstSentence ?? plainText;
}

export interface ControlPreviewProps {
  control: Control;
  isShiftActive: boolean;
  onClose: () => void;
}

export function ControlPreview({
  control,
  isShiftActive,
  onClose,
}: ControlPreviewProps) {
  const {behavior, isShiftBehavior, label} = getActiveControlBehavior(control, isShiftActive);
  const physicalAction = getPhysicalAction(behavior.detail);

  return (
    <div className={styles.preview}>
      <Stack direction="horizontal" gap={3} align="center" wrap="wrap">
        <Heading level={3} accessibilityLevel={2}>{label}</Heading>
        {isShiftBehavior && <Badge label="SHIFT" />}
      </Stack>
      <Text as="p" type="supporting" textWrap="pretty">{behavior.summary}</Text>
      <div className={styles.lessonBody}>
        <ControlLesson control={control} isShiftActive={isShiftActive} showSummary={false} />
      </div>
      <div className={styles.footer}>
        <Button label="Close" variant="ghost" onClick={onClose} />
      </div>
    </div>
  );
}
