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
        onRegionChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/Full rekordbox map/)).toBeDefined();
    expect(screen.getByRole('link', {name: 'View map'}).getAttribute('href')).toBe('/rekordbox');
    expect(screen.queryByRole('link', {name: 'Resume'})).toBeNull();
    expect(screen.getByRole('button', {name: 'Info'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Jog / tempo'})).toBeDefined();
  });

  it('uses the same region navigator for a hardware deck', () => {
    render(
      <SurfaceNavigator
        surface="hardware"
        section={SECTIONS['deck-left']}
        activeRegionId="transport"
        regions={[{id: 'transport', label: 'Loop / transport'}, {id: 'jog', label: 'Jog / tempo'}]}
        onRegionChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/Full controller map/)).toBeDefined();
    expect(screen.getByText('Left deck')).toBeDefined();
    expect(screen.getByRole('button', {name: 'Loop / transport'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Jog / tempo'})).toBeDefined();
  });
});
