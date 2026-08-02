'use client';

import {Dialog, DialogHeader} from '@astryxdesign/core/Dialog';
import {Layout, LayoutContent} from '@astryxdesign/core/Layout';
import type {Control} from '@/content/types';
import {ControlLesson, getActiveControlBehavior} from './ControlLesson';
import styles from './ControlLessonDialog.module.css';

export interface ControlLessonDialogProps {
  control: Control | null;
  isShiftActive: boolean;
  isOpen: boolean;
  isFullscreen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ControlLessonDialog({
  control,
  isShiftActive,
  isOpen,
  isFullscreen,
  onOpenChange,
}: ControlLessonDialogProps) {
  if (control === null) return null;

  const {label} = getActiveControlBehavior(control, isShiftActive);

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      width="min(720px, calc(100vw - 2 * var(--spacing-4)))"
      maxHeight="calc(100dvh - 2 * var(--spacing-4))"
      variant={isFullscreen ? 'fullscreen' : 'standard'}
      purpose="info"
    >
      <Layout
        className={styles.dialogLayout}
        header={<DialogHeader title={label} onOpenChange={onOpenChange} />}
        content={(
          <LayoutContent className={styles.dialogContent} data-testid="lesson-scroll-container">
            <ControlLesson control={control} isShiftActive={isShiftActive} />
          </LayoutContent>
        )}
      />
    </Dialog>
  );
}
