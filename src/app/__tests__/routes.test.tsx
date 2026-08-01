import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Home from '../page';
import ControllerPage from '../controller/page';
import ControllerSectionPage, {
  generateStaticParams as controllerParams,
} from '../controller/[section]/page';
import RekordboxPage from '../rekordbox/page';
import RekordboxSectionPage, {
  generateStaticParams as rekordboxParams,
} from '../rekordbox/[section]/page';

describe('routes', () => {
  it('renders the home copy and surface links', () => {
    render(<Home />);

    expect(screen.getByRole('heading', {name: 'dj-101'})).toBeDefined();
    expect(screen.getByText(
      'An interactive guide to the Pioneer DDJ-1000 and rekordbox 7 — what every control does, and when to reach for it.',
    )).toBeDefined();
    expect(screen.getByRole('link', {name: 'The controller →'}).getAttribute('href'))
      .toBe('/controller');
    expect(screen.getByRole('link', {name: 'rekordbox 7 →'}).getAttribute('href'))
      .toBe('/rekordbox');
  });

  it('renders the overview page titles', () => {
    const controller = render(<ControllerPage />);
    expect(screen.getByRole('heading', {name: 'Pioneer DJ DDJ-1000'})).toBeDefined();
    controller.unmount();

    render(<RekordboxPage />);
    expect(screen.getByRole('heading', {name: 'rekordbox 7'})).toBeDefined();
  });

  it('generates static params only for the matching surface', () => {
    const hardwareSections = controllerParams().map(({section}) => section);
    const softwareSections = rekordboxParams().map(({section}) => section);

    expect(hardwareSections).toContain('deck-left');
    expect(hardwareSections).not.toContain('rb-deck');
    expect(softwareSections).toContain('rb-deck');
    expect(softwareSections).not.toContain('deck-left');
  });

  it('rejects unknown and cross-surface controller sections', async () => {
    await expect(ControllerSectionPage({params: Promise.resolve({section: 'not-real'})}))
      .rejects.toThrow();
    await expect(ControllerSectionPage({params: Promise.resolve({section: 'rb-deck'})}))
      .rejects.toThrow();
  });

  it('rejects unknown and cross-surface rekordbox sections', async () => {
    await expect(RekordboxSectionPage({params: Promise.resolve({section: 'not-real'})}))
      .rejects.toThrow();
    await expect(RekordboxSectionPage({params: Promise.resolve({section: 'deck-left'})}))
      .rejects.toThrow();
  });
});
