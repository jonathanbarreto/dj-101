import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {Stage} from '../Stage';

describe('Stage', () => {
  it('renders the master image for the surface', () => {
    render(<Stage surface="hardware" rect={{x: 0, y: 0, w: 1, h: 1}} />);
    const img = screen.getByRole('img', {name: /DDJ-1000/i});
    expect(img).toBeDefined();
  });

  it('scales the image to fill the viewport for a half-width crop', () => {
    render(<Stage surface="hardware" rect={{x: 0.5, y: 0, w: 0.5, h: 1}} />);
    const img = screen.getByRole('img', {name: /DDJ-1000/i}) as HTMLImageElement;
    expect(img.style.width).toBe('200%');
    expect(img.style.left).toBe('-100%');
  });

  it('renders children above the image', () => {
    render(
      <Stage surface="hardware" rect={{x: 0, y: 0, w: 1, h: 1}}>
        <span data-testid="marker" />
      </Stage>,
    );
    expect(screen.getByTestId('marker')).toBeDefined();
  });
});
