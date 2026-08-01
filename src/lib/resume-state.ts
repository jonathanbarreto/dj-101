import {getControl, SECTIONS} from '@/content';
import type {SectionId, Surface} from '@/content';

const STORAGE_KEY = 'dj101:resume:v1';

export interface ResumeTarget {
  surface: Surface;
  sectionId: SectionId;
  controlId?: string;
}

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function isResumeTarget(value: unknown): value is ResumeTarget {
  if (typeof value !== 'object' || value === null) return false;
  const target = value as Partial<ResumeTarget>;
  if ((target.surface !== 'hardware' && target.surface !== 'software') || typeof target.sectionId !== 'string') {
    return false;
  }

  const section = SECTIONS[target.sectionId as SectionId];
  if (!section || section.surface !== target.surface) return false;
  if (target.controlId === undefined) return true;
  if (typeof target.controlId !== 'string') return false;

  const control = getControl(target.controlId);
  return control !== undefined
    && control.surface === target.surface
    && control.section === target.sectionId;
}

function removeStoredTarget(store: Storage | null) {
  try {
    store?.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}

export function saveResumeTarget(target: ResumeTarget): void {
  const store = storage();
  if (!store) return;
  if (!isResumeTarget(target)) {
    removeStoredTarget(store);
    return;
  }

  try {
    store.setItem(STORAGE_KEY, JSON.stringify(target));
  } catch {
    // Resume state is progressive enhancement only.
  }
}

export function readResumeTarget(surface: Surface): ResumeTarget | null {
  const store = storage();
  if (!store) return null;

  try {
    const serialized = store.getItem(STORAGE_KEY);
    if (!serialized) return null;
    const target: unknown = JSON.parse(serialized);
    if (!isResumeTarget(target) || target.surface !== surface) {
      removeStoredTarget(store);
      return null;
    }
    return target;
  } catch {
    removeStoredTarget(store);
    return null;
  }
}

export function resumeHref(target: ResumeTarget): string {
  const base = target.surface === 'hardware' ? '/controller' : '/rekordbox';
  const fragment = target.controlId === undefined ? '' : `#${encodeURIComponent(target.controlId)}`;
  return `${base}/${target.sectionId}${fragment}`;
}
