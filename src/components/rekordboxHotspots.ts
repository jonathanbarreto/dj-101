import {controlsInSection} from '@/content';
import type {Control, SectionId} from '@/content/types';

export type RekordboxTerminalView = 'rb-deck' | 'rb-sources' | 'rb-mixer';

const VIEW_SOURCES: Record<RekordboxTerminalView, SectionId[]> = {
  'rb-deck': ['rb-deck'],
  'rb-sources': ['rb-sources'],
  'rb-mixer': ['rb-mixer'],
};

export function controlsForRekordboxView(view: RekordboxTerminalView): Control[] {
  return VIEW_SOURCES[view].flatMap((section) => controlsInSection(section));
}
