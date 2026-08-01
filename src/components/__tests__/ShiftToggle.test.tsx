import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, describe, expect, it, vi} from 'vitest';
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

afterEach(() => {
  vi.restoreAllMocks();
});

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

  it('preserves a latched toggle through a physical Shift press and release', async () => {
    const user = userEvent.setup();
    render(<Subject />);

    await user.click(screen.getByRole('switch', {name: /shift/i}));
    fireEvent.keyDown(window, {key: 'Shift'});
    fireEvent.keyUp(window, {key: 'Shift'});

    expect(screen.getByTestId('state').textContent).toBe('on');
  });

  it('honors the controlled off value when toggled during a physical hold', async () => {
    const user = userEvent.setup();
    render(<Subject />);

    fireEvent.keyDown(window, {key: 'Shift', code: 'ShiftLeft'});
    await user.click(screen.getByRole('switch', {name: /shift/i}));
    expect(screen.getByTestId('state').textContent).toBe('on');

    fireEvent.keyUp(window, {key: 'Shift', code: 'ShiftLeft'});
    expect(screen.getByTestId('state').textContent).toBe('off');
  });

  it('stays active until both physical Shift keys are released', () => {
    render(<Subject />);

    fireEvent.keyDown(window, {key: 'Shift', code: 'ShiftLeft'});
    fireEvent.keyDown(window, {key: 'Shift', code: 'ShiftRight'});
    fireEvent.keyUp(window, {key: 'Shift', code: 'ShiftLeft'});
    expect(screen.getByTestId('state').textContent).toBe('on');

    fireEvent.keyUp(window, {key: 'Shift', code: 'ShiftRight'});
    expect(screen.getByTestId('state').textContent).toBe('off');
  });

  it('clears a physical Shift hold when the window loses focus', () => {
    render(<Subject />);

    fireEvent.keyDown(window, {key: 'Shift'});
    expect(screen.getByTestId('state').textContent).toBe('on');

    fireEvent.blur(window);
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
    const blurListener = addSpy.mock.calls.find(([type]) => type === 'blur')?.[1];

    unmount();

    expect(keydownListener).toBeDefined();
    expect(keyupListener).toBeDefined();
    expect(blurListener).toBeDefined();
    expect(removeSpy).toHaveBeenCalledWith('keydown', keydownListener);
    expect(removeSpy).toHaveBeenCalledWith('keyup', keyupListener);
    expect(removeSpy).toHaveBeenCalledWith('blur', blurListener);
  });

  it('fails fast when useShift is called outside ShiftProvider', () => {
    expect(() => render(<Readout />)).toThrow(
      'useShift must be used within a ShiftProvider',
    );
  });
});
