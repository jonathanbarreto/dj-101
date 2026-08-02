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
import NotFound from '../not-found';
import CoordsPage from '../dev/coords/page';

const RESUME_STORAGE_KEY = 'dj101:resume:v1';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

beforeEach(() => {
  vi.mocked(notFound).mockClear();
  window.sessionStorage.clear();
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
  it('renders the visual learning dashboard inside the shared page frame', () => {
    render(<Home />);

    expect(screen.getByRole('heading', {name: 'Mixed'})).toBeDefined();
    expect(screen.getByText(/Learn the controls where they live/i)).toBeDefined();
    expect(screen.getByRole('link', {name: 'Learn the gear'}).getAttribute('href'))
      .toBe('/controller');
    expect(screen.getByRole('link', {name: 'Mixing Tutorials'}).getAttribute('href'))
      .toBe('/mixing-tutorials');
    expect(screen.getByTestId('page-frame')).toBeDefined();
    expect(screen.queryByRole('main')).toBeNull();
  });

  it('renders the overview page titles', () => {
    const controller = render(<ControllerPage />);
    expect(screen.getByRole('heading', {name: 'Pioneer DJ DDJ-1000'})).toBeDefined();
    controller.unmount();

    render(<RekordboxPage />);
    expect(screen.getByRole('heading', {name: 'rekordbox 7'})).toBeDefined();
    expect(screen.queryByRole('main')).toBeNull();
  });

  it('uses SurfaceView orientation for map and taught-section routes without duplicate breadcrumbs', async () => {
    const controller = render(<ControllerPage />);
    expect(screen.getByRole('navigation', {name: 'Surface orientation'})).toBeDefined();
    expect(screen.queryByRole('navigation', {name: 'Breadcrumb'})).toBeNull();
    expect(screen.getAllByRole('heading', {level: 1})).toHaveLength(1);
    controller.unmount();

    const section = render(await RekordboxSectionPage({
      params: Promise.resolve({section: 'rb-deck'}),
    }));
    expect(screen.getByRole('navigation', {name: 'Surface orientation'})).toBeDefined();
    expect(screen.getByRole('link', {name: 'View map'}).getAttribute('href'))
      .toBe('/rekordbox');
    expect(screen.queryByRole('navigation', {name: 'Breadcrumb'})).toBeNull();
    expect(screen.getAllByRole('heading', {level: 1})).toHaveLength(1);
    section.unmount();
  });

  it('offers Resume from each map only after a valid same-surface target is stored', () => {
    window.sessionStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify({
      surface: 'hardware', sectionId: 'deck-left', controlId: 'deck-left-play-pause',
    }));
    const controller = render(<ControllerPage />);
    expect(screen.getByRole('link', {name: 'Resume'}).getAttribute('href'))
      .toBe('/controller/deck-left#deck-left-play-pause');
    controller.unmount();

    window.sessionStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify({
      surface: 'software', sectionId: 'rb-deck', controlId: 'rb-deck-title',
    }));
    render(<RekordboxPage />);
    expect(screen.getByRole('link', {name: 'Resume'}).getAttribute('href'))
      .toBe('/rekordbox/rb-deck#rb-deck-title');
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

  it('renders rear and front as text-first connection lessons with contextual detail views', async () => {
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
    expect(screen.getByRole('img', {name: /DDJ-1000 rear panel/i})).toBeDefined();
    rear.unmount();

    render(await ControllerSectionPage({params: Promise.resolve({section: 'front'})}));
    expect(screen.getByRole('heading', {level: 1, name: 'Front headphones'})).toBeDefined();
    expect(screen.getByText(/both sockets carry the same cue mix/i)).toBeDefined();
    expect(screen.getByRole('note', {name: 'Connection safety'})).toBeDefined();
    expect(screen.getByRole('img', {name: /DDJ-1000 front edge/i})).toBeDefined();
  });

  it('uses Astryx breadcrumbs with a non-linked current page', async () => {
    render(await ControllerSectionPage({params: Promise.resolve({section: 'rear'})}));
    expect(screen.getByRole('navigation', {name: 'Breadcrumb'})).toBeDefined();
    expect(screen.getByRole('link', {name: 'Controller'}).getAttribute('href'))
      .toBe('/controller');
    const breadcrumb = screen.getByRole('navigation', {name: 'Breadcrumb'});
    expect(breadcrumb.querySelector('[aria-current="page"]')?.textContent).toBe('Rear connections');
  });

  it('rejects unknown and cross-surface rekordbox sections', async () => {
    await expect(RekordboxSectionPage({params: Promise.resolve({section: 'not-real'})}))
      .rejects.toThrow('NEXT_NOT_FOUND');
    await expect(RekordboxSectionPage({params: Promise.resolve({section: 'deck-left'})}))
      .rejects.toThrow('NEXT_NOT_FOUND');
    await expect(RekordboxSectionPage({params: Promise.resolve({section: 'rb-waveform'})}))
      .rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(3);
  });

  it('renders a polished not-found recovery path', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', {name: /lost the beat/i})).toBeDefined();
    expect(screen.getByRole('link', {name: /return to Mixed/i}).getAttribute('href'))
      .toBe('/');
  });

  it('keeps the coordinate authoring tool unavailable outside development', () => {
    expect(() => CoordsPage()).toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledOnce();
  });
});
