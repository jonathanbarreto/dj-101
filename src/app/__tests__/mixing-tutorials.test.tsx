import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import MixingTutorialsPage from '../mixing-tutorials/page';

describe('mixing tutorials route', () => {
  it('renders the Astryx classic gallery structure with YouTube players', () => {
    render(<MixingTutorialsPage />);
    expect(screen.getByRole('heading', {name: 'Mixing Tutorials'})).toBeDefined();
    expect(screen.getByRole('button', {name: 'Playlist lessons'})).toBeDefined();
    expect(screen.getAllByTitle(/Mixing tutorial/)).toHaveLength(7);
    expect(screen.getAllByTitle(/Mixing tutorial/)[0].getAttribute('src'))
      .toContain('youtube-nocookie.com/embed/rpiKaf9DIDI');
  });
});
