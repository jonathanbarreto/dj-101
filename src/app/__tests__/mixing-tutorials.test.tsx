import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import MixingTutorialsPage from '../mixing-tutorials/page';

describe('mixing tutorials route', () => {
  it('renders the Astryx classic gallery structure with YouTube players', () => {
    render(<MixingTutorialsPage />);
    expect(screen.getByRole('heading', {name: 'Mixing Tutorials'})).toBeDefined();
    expect(screen.getByRole('textbox', {name: 'Search tutorials'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Playlist lessons'})).toBeDefined();
    expect(screen.getAllByRole('article')).toHaveLength(10);
    expect(screen.getAllByTitle(/./)).toHaveLength(10);
    expect(screen.getByTitle('5 Ways to Mix Between Genres').getAttribute('src'))
      .toContain('youtube-nocookie.com/embed/rpiKaf9DIDI');
    expect(screen.getByText('Looping Techniques That Change Your Mixes')).toBeDefined();
    expect(screen.getByText('7:36 · YouTube lesson')).toBeDefined();
  });

  it('filters the library by search and category', () => {
    render(<MixingTutorialsPage />);
    const search = screen.getByRole('textbox', {name: 'Search tutorials'});
    fireEvent.change(search, {target: {value: 'loop'}});
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByText('Looping Techniques That Change Your Mixes')).toBeDefined();

    fireEvent.change(search, {target: {value: ''}});
    fireEvent.click(screen.getByRole('button', {name: 'Playlist lessons'}));
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });
});
