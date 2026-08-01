'use client';

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ShiftContextValue {
  isShiftActive: boolean;
  setIsShiftActive: Dispatch<SetStateAction<boolean>>;
}

const ShiftContext = createContext<ShiftContextValue>({
  isShiftActive: false,
  setIsShiftActive: () => {},
});

interface ShiftProviderProps {
  children: ReactNode;
}

export function ShiftProvider({children}: ShiftProviderProps) {
  const [isShiftActive, setIsShiftActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setIsShiftActive(true);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setIsShiftActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <ShiftContext.Provider value={{isShiftActive, setIsShiftActive}}>
      {children}
    </ShiftContext.Provider>
  );
}

export function useShift() {
  return useContext(ShiftContext);
}
