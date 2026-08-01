import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useState} from 'react';
import {describe, expect, it, vi} from 'vitest';
import type {Control} from '@/content/types';
import {ControlLessonDialog} from '../ControlLessonDialog';

const control: Control = {
  id: 'deck-left-slip',
  surface: 'hardware',
  section: 'deck-left',
  label: 'SLIP',
  shiftLegend: 'VINYL',
  kind: 'button',
  at: {x: 0.4, y: 0.5},
  primary: {
    summary: 'Keeps playback moving while scratching',
    detail: '# Mechanics\nPress SLIP to preserve the hidden playhead.',
    why: 'Use it for temporary performance moves.',
    gotcha: 'Watch the hidden playhead.',
    tips: ['Practice the return point.'],
    source: 'manual',
  },
  shift: {
    summary: 'Changes vinyl behavior',
    detail: '# Shift mechanics\nHold SHIFT and press SLIP.',
    why: 'Use this for the shifted mode.',
    source: 'rekordbox7',
  },
};

describe('ControlLessonDialog', () => {
  it('renders one named dialog with a visible close button and one scroll container', () => {
    render(
      <ControlLessonDialog
        control={control}
        isShiftActive={false}
        isOpen
        isFullscreen={false}
        onOpenChange={() => {}}
      />,
    );

    const dialog = screen.getByRole('dialog', {name: 'SLIP'});
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    const title = screen.getByRole('heading', {level: 2, name: 'SLIP'});
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(screen.getByRole('button', {name: 'Close'})).toBeDefined();
    expect(screen.getAllByTestId('lesson-scroll-container')).toHaveLength(1);
    expect(dialog.querySelectorAll('.astryx-layout-content')).toHaveLength(1);
    expect(dialog.querySelector('.astryx-layout-content'))
      .toBe(screen.getByTestId('lesson-scroll-container'));
    expect(screen.getByText('Keeps playback moving while scratching')).toBeDefined();
    expect(screen.getByText('Use it for temporary performance moves.')).toBeDefined();
    expect(screen.getByText(/Watch the hidden playhead/)).toBeDefined();
    expect(screen.getByText('Practice the return point.')).toBeDefined();
  });

  it('closes controlled state through the explicit close button', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Harness() {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <ControlLessonDialog
          control={control}
          isShiftActive={false}
          isOpen={isOpen}
          isFullscreen={false}
          onOpenChange={(nextIsOpen) => {
            onOpenChange(nextIsOpen);
            setIsOpen(nextIsOpen);
          }}
        />
      );
    }
    const {container} = render(<Harness />);

    await user.click(screen.getByRole('button', {name: 'Close'}));

    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect((container.querySelector('dialog') as HTMLDialogElement).open).toBe(false);
  });

  it.each(['keydown', 'cancel'] as const)('requests a controlled close through native %s', (path) => {
    const onOpenChange = vi.fn();
    render(
      <ControlLessonDialog
        control={control}
        isShiftActive={false}
        isOpen
        isFullscreen={false}
        onOpenChange={onOpenChange}
      />,
    );
    const dialog = screen.getByRole('dialog') as HTMLDialogElement;

    if (path === 'keydown') fireEvent.keyDown(dialog, {key: 'Escape'});
    else fireEvent(dialog, new Event('cancel', {cancelable: true}));

    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('replaces the lesson when the control changes without stacking dialogs', () => {
    const {rerender} = render(
      <ControlLessonDialog
        control={control}
        isShiftActive={false}
        isOpen
        isFullscreen={false}
        onOpenChange={() => {}}
      />,
    );
    const nextControl: Control = {
      ...control,
      id: 'deck-left-play-pause',
      label: 'PLAY/PAUSE',
      primary: {...control.primary, summary: 'Starts and stops playback'},
    };

    rerender(
      <ControlLessonDialog
        control={nextControl}
        isShiftActive={false}
        isOpen
        isFullscreen={false}
        onOpenChange={() => {}}
      />,
    );

    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getByRole('heading', {level: 2, name: 'PLAY/PAUSE'})).toBeDefined();
    expect(screen.getByText('Starts and stops playback')).toBeDefined();
    expect(screen.queryByText('Keeps playback moving while scratching')).toBeNull();
  });

  it('selects standard or fullscreen responsively from the controlled prop', () => {
    const {rerender} = render(
      <ControlLessonDialog
        control={control}
        isShiftActive
        isOpen
        isFullscreen={false}
        onOpenChange={() => {}}
      />,
    );

    expect(screen.getByRole('dialog').getAttribute('data-variant')).toBe('standard');
    expect(screen.getByRole('heading', {name: 'VINYL'})).toBeDefined();

    rerender(
      <ControlLessonDialog
        control={control}
        isShiftActive
        isOpen
        isFullscreen
        onOpenChange={() => {}}
      />,
    );

    expect(screen.getByRole('dialog').getAttribute('data-variant')).toBe('fullscreen');
  });

  it('renders nothing when no control is selected', () => {
    render(
      <ControlLessonDialog
        control={null}
        isShiftActive={false}
        isOpen
        isFullscreen={false}
        onOpenChange={() => {}}
      />,
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
