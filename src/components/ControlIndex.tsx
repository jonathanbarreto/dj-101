'use client';

import {List, ListItem} from '@astryxdesign/core/List';
import {Text} from '@astryxdesign/core/Text';
import type {Control} from '@/content/types';

export interface ControlIndexProps {
  controls: Control[];
  selectedControlId: string | null;
  isShiftActive: boolean;
  onSelect: (controlId: string, trigger: HTMLButtonElement | null) => void;
  title?: string;
}

export function ControlIndex({controls, selectedControlId, isShiftActive, onSelect, title = 'Controls'}: ControlIndexProps) {
  return (
    <List density="balanced" hasDividers header={<Text type="label">{title}</Text>}>
      {controls.map((control) => {
        const behavior = isShiftActive && control.shift ? control.shift : control.primary;
        const label = isShiftActive && control.shift ? control.shiftLegend ?? control.label : control.label;

        return (
        <div key={control.id} data-selected={selectedControlId === control.id ? 'true' : 'false'}>
        <ListItem
          data-control-id={control.id}
          label={label}
          description={behavior.summary}
          isSelected={selectedControlId === control.id}
          aria-pressed={selectedControlId === control.id}
          onClick={(event) => onSelect(
            control.id,
            event.target instanceof Element
              ? event.target.closest<HTMLButtonElement>('button')
              : null,
          )}
        />
        </div>
        );
      })}
    </List>
  );
}
