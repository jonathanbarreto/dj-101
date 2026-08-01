import {readFileSync} from 'node:fs';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';
import {SECTIONS} from '@/content';
import {SurfaceNavigator} from '../SurfaceNavigator';

const mixerRegions = [
  {id: 'signal', label: 'Signal path'},
  {id: 'channels', label: 'Four channels'},
  {id: 'color', label: 'Color FX'},
  {id: 'outputs', label: 'Outputs'},
  {id: 'headphones', label: 'Headphones + sampler'},
  {id: 'mic', label: 'Mic'},
];

describe('SurfaceNavigator', () => {
  it('renders an orientation path, map and resume links, and six directly reachable mixer regions', async () => {
    const onRegionChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SurfaceNavigator
        surface="hardware"
        section={SECTIONS.mixer}
        activeRegionId="signal"
        activeRegionLabel="Signal path"
        selectedControlLabel="HEADPHONES MIXING"
        regions={mixerRegions}
        isCompact={false}
        onRegionChange={onRegionChange}
        resumeTarget={{surface: 'software', sectionId: 'rb-deck', controlId: 'rb-deck-slip'}}
      />,
    );

    const orientation = screen.getByRole('navigation', {name: 'Surface orientation'});
    expect(within(orientation).getByText('Full controller map')).toBeDefined();
    expect(within(orientation).getByText('Mixer')).toBeDefined();
    expect(within(orientation).getByText('Signal path')).toBeDefined();
    expect(within(orientation).getByText('HEADPHONES MIXING')).toBeDefined();
    expect(screen.getByRole('link', {name: 'View map'}).getAttribute('href')).toBe('/controller');
    expect(screen.getByRole('link', {name: 'Resume'}).getAttribute('href'))
      .toBe('/rekordbox/rb-deck#rb-deck-slip');

    for (const region of mixerRegions) expect(screen.getByRole('button', {name: region.label})).toBeDefined();
    screen.getByRole('button', {name: 'Signal path'}).focus();
    await user.keyboard('{End}{Enter}');
    expect(document.activeElement).toBe(screen.getByRole('button', {name: 'Mic'}));
    expect(onRegionChange).toHaveBeenCalledWith('mic');
  });

  it('uses a generic rekordbox path and omits optional location details', () => {
    render(
      <SurfaceNavigator
        surface="software"
        section={SECTIONS['rb-deck']}
        regions={[{id: 'info', label: 'Info'}, {id: 'jog', label: 'Jog / tempo'}]}
        isCompact={false}
        onRegionChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/Full rekordbox map/)).toBeDefined();
    expect(screen.getByRole('link', {name: 'View map'}).getAttribute('href')).toBe('/rekordbox');
    expect(screen.queryByRole('link', {name: 'Resume'})).toBeNull();
    expect(screen.getByRole('button', {name: 'Info'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Jog / tempo'})).toBeDefined();
  });

  it('calls onViewMap while preserving the normal map link', async () => {
    const onViewMap = vi.fn();
    const user = userEvent.setup();
    render(
      <SurfaceNavigator
        surface="hardware"
        section={SECTIONS['deck-left']}
        regions={[]}
        isCompact={false}
        onRegionChange={vi.fn()}
        onViewMap={onViewMap}
      />,
    );

    const map = screen.getByRole('link', {name: 'View map'});
    expect(map.getAttribute('href')).toBe('/controller');
    map.addEventListener('click', (event) => event.preventDefault());
    await user.click(map);
    expect(onViewMap).toHaveBeenCalledTimes(1);
  });

  it('suppresses the map self-link while retaining a stored resume target', () => {
    render(
      <SurfaceNavigator
        surface="hardware"
        section={undefined}
        regions={[]}
        isCompact={false}
        onRegionChange={vi.fn()}
        resumeTarget={{surface: 'hardware', sectionId: 'deck-left'}}
      />,
    );

    expect(screen.queryByRole('link', {name: 'View map'})).toBeNull();
    expect(screen.getByRole('link', {name: 'Resume'}).getAttribute('href'))
      .toBe('/controller/deck-left');
  });

  it('uses the same region navigator for a hardware deck', () => {
    render(
      <SurfaceNavigator
        surface="hardware"
        section={SECTIONS['deck-left']}
        activeRegionId="transport"
        regions={[{id: 'transport', label: 'Loop / transport'}, {id: 'jog', label: 'Jog / tempo'}]}
        isCompact={false}
        onRegionChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/Full controller map/)).toBeDefined();
    expect(screen.getByText('Left deck')).toBeDefined();
    expect(screen.getByRole('button', {name: 'Loop / transport'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Jog / tempo'})).toBeDefined();
  });

  it('keeps two mixer regions direct and moves compact regions into an accessible More menu', async () => {
    const onRegionChange = vi.fn();
    const user = userEvent.setup();
    render(
      <SurfaceNavigator
        surface="hardware"
        section={SECTIONS.mixer}
        activeRegionId="headphones"
        activeRegionLabel="Headphones + sampler"
        regions={mixerRegions}
        isCompact
        overflowRegionIds={['color', 'outputs', 'headphones', 'mic']}
        onRegionChange={onRegionChange}
      />,
    );

    expect(screen.getByRole('button', {name: 'Signal path'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Four channels'})).toBeDefined();
    expect(screen.queryByRole('button', {name: 'Outputs'})).toBeNull();
    expect(within(screen.getByRole('navigation', {name: 'Surface orientation'}))
      .getByText('Headphones + sampler')).toBeDefined();
    const overflowTrigger = screen.getByRole('button', {name: 'More'});
    expect(overflowTrigger.getAttribute('aria-haspopup')).toBe('menu');

    await user.click(overflowTrigger);
    const overflowMenu = screen.getByRole('menu', {name: 'More'});
    expect(within(overflowMenu).getByRole('menuitem', {name: 'Color FX'})).toBeDefined();
    await user.click(within(overflowMenu).getByRole('menuitem', {name: 'Headphones + sampler'}));
    expect(onRegionChange).toHaveBeenCalledWith('headphones');
  });

  it('does not add horizontal scrolling to the region navigation CSS', () => {
    const css = readFileSync(`${process.cwd()}/src/components/SurfaceNavigator.module.css`, 'utf8');

    expect(css).not.toMatch(/overflow(?:-x)?:\s*(?:auto|scroll)/);
    expect(css).not.toMatch(/white-space:\s*nowrap/);
    expect(css).toMatch(/\.regionTabs\s*\{[^}]*min-inline-size:\s*0/);
  });
});
