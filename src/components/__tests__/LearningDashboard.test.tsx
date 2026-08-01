import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {SURFACES} from '@/content';
import {LearningDashboard} from '../LearningDashboard';

describe('LearningDashboard', () => {
  it('presents the two visual learning paths from the existing master images', () => {
    render(<LearningDashboard />);

    expect(screen.getByRole('link', {name: 'Learn the controller'}).getAttribute('href'))
      .toBe('/controller');
    expect(screen.getByRole('link', {name: 'Learn rekordbox 7'}).getAttribute('href'))
      .toBe('/rekordbox');

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images.map((image) => image.getAttribute('src'))).toEqual([
      SURFACES.hardware.image,
      SURFACES.software.image,
    ]);
  });

  it('offers the complete reference library as three direct routes', () => {
    render(<LearningDashboard />);

    expect(screen.getByRole('heading', {name: 'Reference library'})).toBeDefined();
    expect(screen.getByRole('link', {name: 'Beat FX'}).getAttribute('href'))
      .toBe('/reference/beat-fx');
    expect(screen.getByRole('link', {name: 'Sound Color FX'}).getAttribute('href'))
      .toBe('/reference/sound-color-fx');
    expect(screen.getByRole('link', {name: 'DDJ-1000 specifications'}).getAttribute('href'))
      .toBe('/reference/specs');
  });
});
