import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {notFound} from 'next/navigation';
import Home from '../page';
import ControllerPage from '../controller/page';
import ControllerSectionPage, {
  generateStaticParams as controllerParams,
} from '../controller/[section]/page';
import RekordboxPage from '../rekordbox/page';
import RekordboxSectionPage, {
  generateStaticParams as rekordboxParams,
} from '../rekordbox/[section]/page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

beforeEach(() => {
  vi.mocked(notFound).mockClear();
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

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
    expect(hardwareSections).toContain('rear');
    expect(hardwareSections).toContain('front');
    expect(hardwareSections).not.toContain('rb-deck');
    expect(softwareSections).toContain('rb-deck');
    expect(softwareSections).not.toContain('deck-left');
  });

  it('rejects unknown and cross-surface controller sections', async () => {
    await expect(ControllerSectionPage({params: Promise.resolve({section: 'not-real'})}))
      .rejects.toThrow('NEXT_NOT_FOUND');
    await expect(ControllerSectionPage({params: Promise.resolve({section: 'rb-deck'})}))
      .rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(2);
  });

  it('renders rear and front as text-first connection lessons without a false overhead image', async () => {
    const rear = render(await ControllerSectionPage({
      params: Promise.resolve({section: 'rear'}),
    }));
    expect(screen.getByRole('heading', {level: 1, name: 'Rear connections'})).toBeDefined();
    expect(screen.getByRole('heading', {name: 'Dual-computer changeover'})).toBeDefined();
    expect(screen.getByRole('heading', {name: 'Beginner setup recipes'})).toBeDefined();
    expect(screen.getByRole('note', {name: 'Connection safety'}).textContent)
      .toMatch(/standby.*disconnect.*mains/i);
    expect(screen.getByRole('table', {name: 'Rear connection inventory'})).toBeDefined();
    expect(screen.getByRole('list', {name: 'Safe seven-step handoff'}).children).toHaveLength(7);
    expect(screen.queryByRole('img')).toBeNull();
    rear.unmount();

    render(await ControllerSectionPage({params: Promise.resolve({section: 'front'})}));
    expect(screen.getByRole('heading', {level: 1, name: 'Front headphones'})).toBeDefined();
    expect(screen.getByText(/both sockets carry the same cue mix/i)).toBeDefined();
    expect(screen.getByRole('note', {name: 'Connection safety'})).toBeDefined();
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('uses the Astryx navigation contract for the controller backlink', async () => {
    render(await ControllerSectionPage({params: Promise.resolve({section: 'rear'})}));
    expect(screen.getByRole('link', {name: '← The controller'}).getAttribute('data-color'))
      .toBe('accent');
  });

  it('rejects unknown and cross-surface rekordbox sections', async () => {
    await expect(RekordboxSectionPage({params: Promise.resolve({section: 'not-real'})}))
      .rejects.toThrow('NEXT_NOT_FOUND');
    await expect(RekordboxSectionPage({params: Promise.resolve({section: 'deck-left'})}))
      .rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(2);
  });
});
