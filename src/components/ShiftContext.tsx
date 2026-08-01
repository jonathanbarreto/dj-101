'use client';

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface ShiftContextValue {
  isShiftActive: boolean;
  setIsShiftActive: Dispatch<SetStateAction<boolean>>;
}

const ShiftContext = createContext<ShiftContextValue | null>(null);

interface ShiftProviderProps {
  children: ReactNode;
}

export function ShiftProvider({children}: ShiftProviderProps) {
  const [isShiftLatched, setIsShiftLatched] = useState(false);
  const [isPhysicallyHeld, setIsPhysicallyHeld] = useState(false);
  const heldShiftKeys = useRef(new Set<string>());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        heldShiftKeys.current.add(event.code || 'Shift');
        setIsPhysicallyHeld(true);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        heldShiftKeys.current.delete(event.code || 'Shift');
        setIsPhysicallyHeld(heldShiftKeys.current.size > 0);
      }
    };
    const handleBlur = () => {
      heldShiftKeys.current.clear();
      setIsPhysicallyHeld(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const isShiftActive = isShiftLatched || isPhysicallyHeld;

  return (
    <ShiftContext.Provider
      value={{isShiftActive, setIsShiftActive: setIsShiftLatched}}>
      {children}
    </ShiftContext.Provider>
  );
}

export function useShift() {
  const context = useContext(ShiftContext);

  if (context === null) {
    throw new Error('useShift must be used within a ShiftProvider');
  }

  return context;
}
