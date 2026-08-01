import type {Control} from './types';

const modules: Control[][] = [];

export const ALL_CONTROLS: Control[] = modules.flat();

export function getControl(id: string): Control | undefined {
  return ALL_CONTROLS.find((control) => control.id === id);
}

export function controlsInSection(section: string): Control[] {
  return ALL_CONTROLS.filter((control) => control.section === section);
}

export * from './types';
export * from './surfaces';
