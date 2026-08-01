import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {notFound} from 'next/navigation';
import Home from '../page';
import ReferencePage, {
  generateStaticParams,
} from '../reference/[topic]/page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

beforeEach(() => {
  vi.mocked(notFound).mockClear();
});

describe('reference routes', () => {
  it('shows the horizontal-scroll hint through tablet widths only', () => {
    const styles = readFileSync(
      resolve(import.meta.dirname, '../reference/[topic]/ReferencePage.module.css'),
      'utf8',
    );

    expect(styles).toMatch(/\.scrollHint\s*{\s*display:\s*none;\s*}/);
    expect(styles).toMatch(
      /@media\s*\(max-width:\s*48rem\)[\s\S]*?\.scrollHint\s*{\s*display:\s*block;\s*}/,
    );
  });

  it('generates only the three published topics', () => {
    expect(generateStaticParams()).toEqual([
      {topic: 'beat-fx'},
      {topic: 'sound-color-fx'},
      {topic: 'specs'},
    ]);
  });

  it('rejects an unknown topic', async () => {
    await expect(ReferencePage({params: Promise.resolve({topic: 'not-real'})}))
      .rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledOnce();
  });

  it('renders Beat FX in a real Astryx table with a clear hierarchy', async () => {
    render(await ReferencePage({params: Promise.resolve({topic: 'beat-fx'})}));

    expect(screen.getByRole('heading', {level: 1, name: 'Beat FX'})).toBeDefined();
    expect(screen.getByRole('table')).toBeDefined();
    expect(screen.getByRole('columnheader', {name: 'Effect'})).toBeDefined();
    expect(screen.getByRole('columnheader', {name: 'What it does'})).toBeDefined();
    expect(screen.getByRole('columnheader', {name: 'LEVEL / DEPTH'})).toBeDefined();
    expect(screen.getAllByRole('row')).toHaveLength(15);

    expect(screen.getByRole('navigation', {name: 'Breadcrumb'})).toBeDefined();
    const currentCrumb = screen.getAllByText('Beat FX')
      .find((element) => element.getAttribute('aria-current') === 'page');
    expect(currentCrumb).toBeDefined();
    const activeLink = screen.getByRole('link', {name: 'Beat FX'});
    expect(activeLink.getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('link', {name: 'Sound Color FX'}).getAttribute('aria-current'))
      .toBeNull();

    const scrollHint = screen.getByRole('note');
    expect(scrollHint.textContent).toMatch(/swipe the table sideways/i);
    expect(screen.getByRole('table').getAttribute('aria-describedby')).toBe(scrollHint.id);
  });

  it('renders Sound Color FX and specifications as semantic tables', async () => {
    const color = render(
      await ReferencePage({params: Promise.resolve({topic: 'sound-color-fx'})}),
    );
    expect(screen.getByRole('heading', {level: 1, name: 'Sound Color FX'})).toBeDefined();
    expect(screen.getByRole('columnheader', {name: 'Turn left'})).toBeDefined();
    color.unmount();

    render(await ReferencePage({params: Promise.resolve({topic: 'specs'})}));
    expect(screen.getByRole('heading', {level: 1, name: 'DDJ-1000 specifications'}))
      .toBeDefined();
    expect(screen.getAllByRole('table').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/32-bit figure is the D\/A converter/i)).toBeDefined();
  });

  it('makes the reference library discoverable from home', () => {
    render(<Home />);
    expect(screen.getByRole('link', {name: /Open the reference library/}).getAttribute('href'))
      .toBe('/reference/beat-fx');
  });
});
