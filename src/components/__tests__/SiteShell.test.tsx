import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {isRouteActive, SiteShell} from '../SiteShell';

const {usePathnameMock} = vi.hoisted(() => ({
  usePathnameMock: vi.fn(() => '/'),
}));

vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
}));

beforeEach(() => {
  usePathnameMock.mockReturnValue('/');
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(max-width: 768px)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('SiteShell', () => {
  it('uses the shared dialog environment', () => {
    const dialog = document.createElement('dialog');
    const onClose = vi.fn();
    dialog.addEventListener('close', onClose);

    dialog.showModal();
    expect(dialog.open).toBe(true);

    dialog.close('dismissed');
    expect(dialog.open).toBe(false);
    expect(dialog.returnValue).toBe('dismissed');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('owns the only main landmark and provides a working skip link', () => {
    render(<SiteShell><div>Lesson content</div></SiteShell>);

    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getByRole('link', {name: 'Skip to content'}).getAttribute('href'))
      .toBe('#astryx-app-shell-main');
    expect(screen.getByRole('main').textContent).toContain('Lesson content');
    expect(screen.getByRole('main').contains(screen.getByRole('contentinfo'))).toBe(false);
  });

  it('marks product routes active including their nested pages', () => {
    expect(isRouteActive('/rekordbox/rb-deck', '/rekordbox')).toBe(true);
    expect(isRouteActive('/rekordbox/rb-deck', '/controller')).toBe(false);
    expect(isRouteActive('/mixing-tutorials', '/mixing-tutorials')).toBe(true);
  });

  it('uses the native Astryx mobile drawer and closes it on navigation', async () => {
    const user = userEvent.setup();
    render(<SiteShell><div>Lesson</div></SiteShell>);

    const toggle = screen.getByRole('button', {name: 'Open navigation'});
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    await user.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    const drawers = screen.getAllByRole('dialog');
    expect(drawers).toHaveLength(1);
    const drawerLink = within(drawers[0]).getByRole('link', {name: 'Learn the gear'});
    drawerLink.addEventListener('click', (event) => event.preventDefault(), {once: true});
    await user.click(drawerLink);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('includes Mixing Tutorials in the primary navigation', async () => {
    const user = userEvent.setup();
    render(<SiteShell><div>Lesson</div></SiteShell>);
    await user.click(screen.getByRole('button', {name: 'Open navigation'}));
    const drawer = screen.getAllByRole('dialog')[0];
    expect(within(drawer).getByRole('link', {name: 'Mixing Tutorials'}).getAttribute('href'))
      .toBe('/mixing-tutorials');
  });

  it('renders the required attribution and scope footer', () => {
    render(<SiteShell><div>Lesson</div></SiteShell>);

    expect(screen.getByText(/Product images © AlphaTheta Corporation \/ Pioneer DJ/i))
      .toBeDefined();
    expect(screen.getByText(/not affiliated with or endorsed by AlphaTheta/i)).toBeDefined();
    expect(screen.getByText(/rekordbox 7 Performance mode only/i)).toBeDefined();
  });
});
