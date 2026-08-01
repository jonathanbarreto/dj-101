import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {PageFrame} from '../PageFrame';

describe('PageFrame', () => {
  it('composes page content without adding a main landmark', () => {
    render(<PageFrame><p>Lesson content</p></PageFrame>);

    const frames = screen.getAllByTestId('page-frame');
    expect(frames).toHaveLength(1);
    expect(screen.getByText('Lesson content')).toBeDefined();
    expect(frames[0].getAttribute('data-layout-height')).toBe('auto');
    expect(screen.queryByRole('main')).toBeNull();
  });
});
