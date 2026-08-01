import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {readFileSync} from 'node:fs';
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

  it('uses the crop width to request an appropriately sized image', () => {
    render(<Stage surface="hardware" rect={{x: 0.5, y: 0, w: 0.5, h: 1}} />);
    const img = screen.getByRole('img', {name: /DDJ-1000/i});
    expect(img.getAttribute('sizes')).toBe('200vw');
  });

  it('renders children', () => {
    render(
      <Stage surface="hardware" rect={{x: 0, y: 0, w: 1, h: 1}}>
        <span data-testid="marker" />
      </Stage>,
    );
    expect(screen.getByTestId('marker')).toBeDefined();
  });

  it('keeps the outer viewport budget stable while the inner crop canvas changes shape', () => {
    const {rerender} = render(
      <Stage surface="hardware" rect={{x: 0, y: 0, w: 1, h: 1}}>
        <span data-testid="marker" />
      </Stage>,
    );
    const stage = screen.getByTestId('stage');
    const initialStyle = stage.getAttribute('style');
    const canvas = screen.getByTestId('stage-canvas');

    expect(stage.getAttribute('data-stable-stage')).toBe('true');
    expect(canvas.style.aspectRatio).toBe(String(3129 / 1652));
    expect(canvas.contains(screen.getByTestId('marker'))).toBe(true);
    expect(canvas.querySelectorAll('img')).toHaveLength(1);

    rerender(
      <Stage surface="hardware" rect={{x: 0.5, y: 0, w: 0.5, h: 1}}>
        <span data-testid="marker" />
      </Stage>,
    );

    expect(stage.getAttribute('style')).toBe(initialStyle);
    expect(screen.getByTestId('stage-canvas').style.aspectRatio).toBe(String(3129 / (2 * 1652)));
    expect(stage.querySelectorAll('img')).toHaveLength(1);
  });

  it('gives the size-contained stage a definite block size for its crop canvas', () => {
    const css = readFileSync(`${process.cwd()}/src/components/Stage.module.css`, 'utf8');
    expect(css).toMatch(/\.stage\s*\{[\s\S]*\n\s+block-size:\s*clamp\(20rem, 56dvh, 46rem\)/);
  });
});
