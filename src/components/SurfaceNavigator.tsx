'use client';

import {Button} from '@astryxdesign/core/Button';
import {Link} from '@astryxdesign/core/Link';
import {Stack} from '@astryxdesign/core/Stack';
import {Tab, TabList, TabMenu} from '@astryxdesign/core/TabList';
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
  regions: readonly Region[];
  isCompact: boolean;
  overflowRegionIds?: string[];
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
  isCompact,
  overflowRegionIds,
  onRegionChange,
  resumeTarget,
}: SurfaceNavigatorProps) {
  const rootHref = surface === 'hardware' ? '/controller' : '/rekordbox';
  const fullMapLabel = surface === 'hardware' ? 'Full controller map' : 'Full rekordbox map';
  const overflowIds = isCompact ? new Set(overflowRegionIds) : new Set<string>();
  const directRegions = regions.filter((region) => !overflowIds.has(region.id));
  const overflowRegions = regions.filter((region) => overflowIds.has(region.id));
  const overflowValues = new Map(overflowRegions.map((region) => [`overflow:${region.id}`, region.id]));

  function handleRegionChange(value: string) {
    onRegionChange(overflowValues.get(value) ?? value);
  }

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
            onChange={handleRegionChange}
            size="sm"
            layout="hug"
            hasDivider
            aria-label={`${section?.label ?? fullMapLabel} region`}
          >
            {directRegions.map((region) => (
              <Tab key={region.id} value={region.id} label={region.label} />
            ))}
            {overflowRegions.length > 0 ? (
              <TabMenu
                key="overflow"
                label="More"
                options={overflowRegions.map((region) => ({
                  value: `overflow:${region.id}`,
                  label: region.label,
                }))}
              />
            ) : null}
          </TabList>
        </div>
      ) : null}
    </Stack>
  );
}
