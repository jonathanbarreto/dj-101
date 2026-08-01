import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import type {Control, SourceTag} from '@/content/types';
import {ControlLesson} from '../ControlLesson';

const control: Control = {
  id: 'deck-left-slip',
  ref: 42,
  surface: 'hardware',
  section: 'deck-left',
  label: 'SLIP',
  shiftLegend: 'VINYL',
  kind: 'button',
  at: {x: 0.4, y: 0.5},
  primary: {
    summary: 'Primary summary',
    detail: '# Primary mechanics\nPress **SLIP** once.',
    why: 'Primary why copy.',
    source: 'manual',
  },
  shift: {
    summary: 'Shift summary',
    detail: '# Shift mechanics\nHold SHIFT and press **SLIP**.',
    why: 'Shift why copy.',
    gotcha: 'Shift gotcha copy.',
    tips: ['First complete tip.', 'Second complete tip.'],
    source: 'rekordbox7',
    tier: 'subscription',
  },
  counterpart: ['rb-deck-slip'],
  referenceLinks: [
    {href: '/reference/beat-fx', label: 'Compare Beat FX'},
    {href: '/reference/pad-modes', label: 'Compare pad modes'},
  ],
};

describe('ControlLesson', () => {
  it('renders every field from the active Shift behavior and every control relation', () => {
    render(<ControlLesson control={control} isShiftActive />);

    expect(screen.getByText('SHIFT')).toBeDefined();
    expect(screen.getByText('Subscription required')).toBeDefined();
    expect(screen.getByText('Shift summary')).toBeDefined();
    expect(screen.getByRole('heading', {level: 3, name: 'Shift mechanics'})).toBeDefined();
    expect(screen.getByText(/Hold SHIFT and press/)).toBeDefined();
    expect(screen.getByText('When to use it')).toBeDefined();
    expect(screen.getByText('Shift why copy.')).toBeDefined();
    expect(screen.getByText(/Shift gotcha copy/)).toBeDefined();
    expect(screen.getByText('First complete tip.')).toBeDefined();
    expect(screen.getByText('Second complete tip.')).toBeDefined();
    expect(screen.getByText('rekordbox 7 documentation')).toBeDefined();
    expect(screen.getByRole('link', {name: /See SLIP on screen/})).toBeDefined();
    expect(screen.getByRole('link', {name: /Compare Beat FX/}).getAttribute('href'))
      .toBe('/reference/beat-fx');
    expect(screen.getByRole('link', {name: /Compare pad modes/}).getAttribute('href'))
      .toBe('/reference/pad-modes');
  });

  it('uses the primary behavior when Shift is inactive and does not own the dialog title', () => {
    render(<ControlLesson control={control} isShiftActive={false} />);

    expect(screen.getByText('Primary summary')).toBeDefined();
    expect(screen.getByRole('heading', {level: 3, name: 'Primary mechanics'})).toBeDefined();
    expect(screen.queryByText('Shift summary')).toBeNull();
    expect(screen.queryByRole('heading', {level: 2})).toBeNull();
    expect(screen.queryByText('SHIFT')).toBeNull();
  });

  it.each<[SourceTag, string]>([
    ['manual', 'DDJ-1000 manual'],
    ['rekordbox7', 'rekordbox 7 documentation'],
    ['community', 'Community-verified workflow'],
  ])('maps the %s source to its readable label', (source, label) => {
    render(
      <ControlLesson
        control={{...control, primary: {...control.primary, source}, shift: undefined}}
        isShiftActive={false}
      />,
    );

    expect(screen.getByText(label)).toBeDefined();
  });
});
