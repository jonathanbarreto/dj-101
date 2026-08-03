import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import type {Control, Rect} from '@/content/types';
import {Hotspot} from '../Hotspot';

const control: Control = {
  id: 'deck-left-slip', surface: 'hardware', section: 'deck-left', label: 'SLIP',
  kind: 'button', at: {x: 0.2, y: 0.3},
  primary: {summary: 'Keeps time', detail: 'Presses the physical SLIP control.', why: 'Use it.', source: 'manual'},
};
const rect: Rect = {x: 0, y: 0, w: 1, h: 1};

describe('Hotspot', () => {
  it('is controlled and renders the full lesson in one popover', async () => {
    const user = userEvent.setup();
    const onPreviewOpenChange = vi.fn();
    render(<Hotspot control={control} rect={rect} isShiftActive={false} isSelected isPreviewOpen onPreviewOpenChange={onPreviewOpenChange} />);
    expect(screen.getByText('Presses the physical SLIP control.')).toBeDefined();
    expect(screen.getByText('When to use it')).toBeDefined();
    await user.click(screen.getByRole('button', {name: 'Close'}));
    expect(onPreviewOpenChange).toHaveBeenCalledWith(false, expect.any(HTMLButtonElement));
  });

  it('does not render a second lesson handoff', () => {
    const onPreviewOpenChange = vi.fn();
    render(<Hotspot control={control} rect={rect} isShiftActive={false} isSelected isPreviewOpen onPreviewOpenChange={onPreviewOpenChange} />);
    expect(screen.queryByRole('button', {name: 'Read full lesson'})).toBeNull();
  });

  it('reports opening from the marker click to its parent', async () => {
    const user = userEvent.setup();
    const onPreviewOpenChange = vi.fn();
    render(<Hotspot control={control} rect={rect} isShiftActive={false} isSelected={false} isPreviewOpen={false} onPreviewOpenChange={onPreviewOpenChange} />);
    await user.click(screen.getByRole('button', {name: 'SLIP'}));
    expect(onPreviewOpenChange).toHaveBeenCalledWith(true, expect.any(HTMLButtonElement));
  });

  it('uses bounded width and allows Astryx to choose flip placement', () => {
    render(<Hotspot control={control} rect={rect} isShiftActive={false} isSelected isPreviewOpen onPreviewOpenChange={() => {}} />);
    expect(screen.getByRole('dialog').parentElement?.style.getPropertyValue('--x-width'))
      .toBe('min(30rem, calc(100vw - 2 * var(--spacing-4)))');
  });
});
