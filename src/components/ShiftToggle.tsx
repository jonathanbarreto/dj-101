'use client';

import {Switch} from '@astryxdesign/core';
import {useShift} from './ShiftContext';

export function ShiftToggle() {
  const {isShiftActive, setIsShiftActive} = useShift();

  return (
    <Switch
      label="SHIFT"
      value={isShiftActive}
      onChange={setIsShiftActive}
    />
  );
}
