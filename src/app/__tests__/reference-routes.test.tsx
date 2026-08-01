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
    expect(screen.getByRole('link', {name: 'Reference library →'}).getAttribute('href'))
      .toBe('/reference/beat-fx');
  });
});
