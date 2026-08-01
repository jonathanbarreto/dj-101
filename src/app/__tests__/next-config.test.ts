import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';

describe('Next configuration', () => {
  it('sets a deterministic project-scoped output tracing root from the config URL', () => {
    const source = readFileSync(join(process.cwd(), 'next.config.mjs'), 'utf8');

    expect(source).toMatch(/fileURLToPath/);
    expect(source).toMatch(/new URL\(['"]\.['"], import\.meta\.url\)/);
    expect(source).toMatch(/outputFileTracingRoot/);
    expect(source).not.toMatch(/process\.cwd/);
  });
});
