import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import type {Control} from '@/content/types';
import {ControlIndex} from '../ControlIndex';

const controls: Control[] = [{
  id: 'deck-left-slip', surface: 'hardware', section: 'deck-left', label: 'SLIP',
  kind: 'button', at: {x: 0, y: 0},
  primary: {summary: 'Keeps time', detail: 'Keeps time while you perform.', why: 'Use it.', source: 'manual'},
}];

describe('ControlIndex', () => {
  it('lists controls and reports the initiating button when one is selected', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<ControlIndex controls={controls} selectedControlId={null} onSelect={onSelect} />);

    const item = screen.getByRole('button', {name: /SLIP/});
    await user.click(item);

    expect(onSelect).toHaveBeenCalledWith('deck-left-slip', item);
  });

  it('marks the controlled selected control', () => {
    render(<ControlIndex controls={controls} selectedControlId="deck-left-slip" onSelect={() => {}} />);
    expect(screen.getByRole('button', {name: /SLIP/}).closest('[data-selected]')?.getAttribute('data-selected')).toBe('true');
  });
});
