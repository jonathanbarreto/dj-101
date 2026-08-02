import {render, screen, within} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {SURFACES} from '@/content';
import {LearningDashboard} from '../LearningDashboard';

describe('LearningDashboard', () => {
  it('presents the two visual learning paths from the existing master images', () => {
    render(<LearningDashboard />);

    expect(screen.getByRole('link', {name: 'Learn the gear'}).getAttribute('href'))
      .toBe('/controller');
    expect(screen.getByRole('link', {name: 'Mixing Tutorials'}).getAttribute('href'))
      .toBe('/mixing-tutorials');

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images.map((image) => {
      const src = image.getAttribute('src');
      return src ? new URL(src, 'http://localhost').searchParams.get('url') : null;
    })).toEqual([
      SURFACES.hardware.image,
      SURFACES.software.image,
    ]);
    expect(images.map((image) => image.getAttribute('sizes'))).toEqual([
      '(max-width: 767px) 100vw, 60vw',
      '(max-width: 767px) 100vw, 40vw',
    ]);
    images.forEach((image) => {
      expect(image.getAttribute('srcset')).toMatch(/\/_next\/image\?url=/);
    });
  });

  it('keeps each learning card at its intrinsic content height', () => {
    const {container} = render(<LearningDashboard />);

    expect(container.querySelector('.astryx-grid')?.getAttribute('data-align')).toBe('start');
  });

  it('offers the complete reference library as three direct routes', () => {
    render(<LearningDashboard />);

    const referenceLibrary = screen.getByRole('list', {name: 'Reference library'});
    const links = within(referenceLibrary).getAllByRole('link');

    expect(links).toHaveLength(3);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/reference/beat-fx',
      '/reference/sound-color-fx',
      '/reference/specs',
    ]);
  });
});
