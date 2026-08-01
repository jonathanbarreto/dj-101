'use client';

import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Stack} from '@astryxdesign/core/Stack';
import {Tab, TabList} from '@astryxdesign/core/TabList';
import type {SectionSpec, Surface} from '@/content';
import {resumeHref, type ResumeTarget} from '@/lib/resume-state';
import styles from './SurfaceNavigator.module.css';

interface Region {
  id: string;
  label: string;
}

export interface SurfaceNavigatorProps {
  surface: Surface;
  section: SectionSpec | undefined;
  activeRegionId?: string;
  activeRegionLabel?: string;
  selectedControlLabel?: string;
  regions: Region[];
  onRegionChange: (value: string) => void;
  resumeTarget?: ResumeTarget;
}

export function SurfaceNavigator({
  surface,
  section,
  activeRegionId,
  activeRegionLabel,
  selectedControlLabel,
  regions,
  onRegionChange,
  resumeTarget,
}: SurfaceNavigatorProps) {
  const rootHref = surface === 'hardware' ? '/controller' : '/rekordbox';
  const fullMapLabel = surface === 'hardware' ? 'Full controller map' : 'Full rekordbox map';

  return (
    <Stack direction="vertical" gap={2}>
      <nav aria-label="Surface orientation" className={styles.orientation}>
        <Stack direction="horizontal" gap={1} wrap="wrap" align="center">
          <span>{fullMapLabel}</span>
          {section ? <span aria-hidden="true">/</span> : null}
          {section ? <span>{section.label}</span> : null}
          {activeRegionLabel ? <span aria-hidden="true">/</span> : null}
          {activeRegionLabel ? <span>{activeRegionLabel}</span> : null}
          {selectedControlLabel ? <span aria-hidden="true">/</span> : null}
          {selectedControlLabel ? <span>{selectedControlLabel}</span> : null}
        </Stack>
      </nav>
      <Stack direction="horizontal" gap={2} wrap="wrap">
        <Button className={styles.mapAction} label="View map" href={rootHref} variant="ghost" />
        {resumeTarget ? <Link href={resumeHref(resumeTarget)} isStandalone>Resume</Link> : null}
      </Stack>
      {regions.length > 0 ? (
        <div className={styles.regionTabs}>
          <TabList
            value={activeRegionId ?? ''}
            onChange={onRegionChange}
            size="sm"
            layout="hug"
            hasDivider
            aria-label={`${section?.label ?? fullMapLabel} region`}
          >
            {regions.map((region) => (
              <Tab key={region.id} value={region.id} label={region.label} />
            ))}
          </TabList>
        </div>
      ) : null}
    </Stack>
  );
}
