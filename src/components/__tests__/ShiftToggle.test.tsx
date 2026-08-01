import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {ShiftProvider, useShift} from '../ShiftContext';
import {ShiftToggle} from '../ShiftToggle';

function Readout() {
  const {isShiftActive} = useShift();

  return <span data-testid="state">{isShiftActive ? 'on' : 'off'}</span>;
}

function Subject() {
  return (
    <ShiftProvider>
      <ShiftToggle />
      <Readout />
    </ShiftProvider>
  );
}

describe('ShiftToggle', () => {
  it('defaults to off and toggles on and off when clicked', async () => {
    const user = userEvent.setup();
    render(<Subject />);

    const toggle = screen.getByRole('switch', {name: /shift/i});
    expect(screen.getByTestId('state').textContent).toBe('off');

    await user.click(toggle);
    expect(screen.getByTestId('state').textContent).toBe('on');

    await user.click(toggle);
    expect(screen.getByTestId('state').textContent).toBe('off');
  });

  it('activates while the physical Shift key is held', () => {
    render(<Subject />);

    fireEvent.keyDown(window, {key: 'Shift'});
    expect(screen.getByTestId('state').textContent).toBe('on');

    fireEvent.keyUp(window, {key: 'Shift'});
    expect(screen.getByTestId('state').textContent).toBe('off');
  });

  it('ignores physical keys other than Shift', () => {
    render(<Subject />);

    fireEvent.keyDown(window, {key: 'Enter'});
    fireEvent.keyUp(window, {key: 'Enter'});

    expect(screen.getByTestId('state').textContent).toBe('off');
  });

  it('removes the physical-key listeners on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const {unmount} = render(<Subject />);
    const keydownListener = addSpy.mock.calls.find(([type]) => type === 'keydown')?.[1];
    const keyupListener = addSpy.mock.calls.find(([type]) => type === 'keyup')?.[1];

    unmount();

    expect(keydownListener).toBeDefined();
    expect(keyupListener).toBeDefined();
    expect(removeSpy).toHaveBeenCalledWith('keydown', keydownListener);
    expect(removeSpy).toHaveBeenCalledWith('keyup', keyupListener);

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
