import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import type {Control} from '@/content/types';
import {ControlPreview, getPhysicalAction} from '../ControlPreview';

const control: Control = {
  id: 'fx-selector',
  surface: 'hardware',
  section: 'fx',
  label: 'BEAT FX SELECT',
  shiftLegend: 'SHIFTED SELECT',
  kind: 'knob',
  at: {x: 0.62, y: 0.659},
  primary: {
    summary: 'Chooses one of fourteen Beat FX',
    detail: '## Gesture\nTurn the **selector** toward [Echo](/reference/beat-fx). Then listen for the result.',
    why: 'Unique why copy that must stay out of the preview.',
    gotcha: 'Unique gotcha copy that must stay out of the preview.',
    tips: ['Unique tip copy that must stay out of the preview.'],
    source: 'manual',
  },
  shift: {
    summary: 'Chooses the shifted function',
    detail: '# Shift gesture\nHold **SHIFT** and turn the selector. Ignore the next sentence.',
    why: 'Shift why.',
    source: 'community',
  },
  counterpart: ['rb-deck-slip'],
  referenceLinks: [{href: '/reference/beat-fx', label: 'Compare all Beat FX'}],
};

describe('ControlPreview', () => {
  it.each([
    ['blockquote', '> Push **PLAY** once. Ignore this.', 'Push PLAY once.'],
    [
      'multiple list items',
      '- Hold SHIFT\n1. press **PLAY**.',
      'Hold SHIFT press PLAY.',
    ],
    [
      'balanced link destination',
      'Choose [Echo](https://example.com/fx_(echo)). Ignore this.',
      'Choose Echo.',
    ],
    ['backslash escapes', String.raw`Turn the \[bracket\] control.`, 'Turn the [bracket] control.'],
    ['heading followed by prose', '## Gesture\nPress CUE. Ignore this.', 'Press CUE.'],
    ['fenced code followed by prose', '```ts\npress(fake)\n```\nPress CUE. Ignore this.', 'Press CUE.'],
    [
      'blockquote fenced code followed by prose',
      '> ```ts\n> press(fake)\n> ```\n> Press CUE. Ignore this.',
      'Press CUE.',
    ],
    [
      'image label and balanced destination',
      'Match ![the **waveform**](https://example.com/image_(2).png). Ignore this.',
      'Match the waveform.',
    ],
    [
      'HTML and angle autolink',
      'Press <kbd>SHIFT</kbd>, then visit <https://example.com>. Ignore this.',
      'Press SHIFT, then visit https://example.com.',
    ],
  ])('extracts content-preserving plain text from %s Markdown', (_name, detail, expected) => {
    expect(getPhysicalAction(detail)).toBe(expected);
  });

  it('shows only the glanceable primary preview and a clamped physical action', () => {
    const {container} = render(
      <ControlPreview
        control={control}
        isShiftActive={false}
        onReadLesson={() => {}}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText('BEAT FX SELECT')).toBeDefined();
    expect(screen.getByText('Chooses one of fourteen Beat FX')).toBeDefined();
    expect(screen.getByText('Physical action: Turn the selector toward Echo.')).toBeDefined();
    expect(screen.queryByText(/Then listen/)).toBeNull();
    expect(screen.queryByText(/Unique why/)).toBeNull();
    expect(screen.queryByText(/Unique gotcha/)).toBeNull();
    expect(screen.queryByText(/Unique tip/)).toBeNull();
    expect(screen.queryByText(/Compare all Beat FX/)).toBeNull();
    expect(screen.queryByText(/See SLIP/)).toBeNull();
    expect(screen.queryByText(/DDJ-1000 manual/)).toBeNull();
    expect(container.querySelector('[class*="physicalAction"]')).not.toBeNull();
    expect(container.querySelector('[style*="overflow"]')).toBeNull();
  });

  it('uses the active Shift label and behavior', () => {
    render(
      <ControlPreview
        control={control}
        isShiftActive
        onReadLesson={() => {}}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText('SHIFTED SELECT')).toBeDefined();
    expect(screen.getByText('SHIFT')).toBeDefined();
    expect(screen.getByText('Chooses the shifted function')).toBeDefined();
    expect(screen.getByText('Physical action: Hold SHIFT and turn the selector.')).toBeDefined();
  });

  it('exposes controlled read-lesson and close actions', async () => {
    const user = userEvent.setup();
    const onReadLesson = vi.fn();
    const onClose = vi.fn();
    render(
      <ControlPreview
        control={control}
        isShiftActive={false}
        onReadLesson={onReadLesson}
        onClose={onClose}
      />,
    );

    await user.click(screen.getByRole('button', {name: 'Read full lesson'}));
    await user.click(screen.getByRole('button', {name: 'Close'}));

    expect(onReadLesson).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
