interface CssNamespaceWithEscape {
  escape?: (value: string) => string;
}

interface CssGlobalLike {
  CSS?: object;
}

export function cssEscape(value: string): string {
  const input = String(value);
  const firstCodeUnit = input.charCodeAt(0);
  let result = '';

  for (let index = 0; index < input.length; index += 1) {
    const codeUnit = input.charCodeAt(index);
    const character = input.charAt(index);

    if (codeUnit === 0) {
      result += '\uFFFD';
      continue;
    }
    if (
      (codeUnit >= 1 && codeUnit <= 31)
      || codeUnit === 127
      || (index === 0 && codeUnit >= 48 && codeUnit <= 57)
      || (index === 1 && codeUnit >= 48 && codeUnit <= 57 && firstCodeUnit === 45)
    ) {
      result += `\\${codeUnit.toString(16)} `;
      continue;
    }
    if (index === 0 && codeUnit === 45 && input.length === 1) {
      result += '\\-';
      continue;
    }
    if (
      codeUnit >= 128
      || codeUnit === 45
      || codeUnit === 95
      || (codeUnit >= 48 && codeUnit <= 57)
      || (codeUnit >= 65 && codeUnit <= 90)
      || (codeUnit >= 97 && codeUnit <= 122)
    ) {
      result += character;
      continue;
    }
    result += `\\${character}`;
  }

  return result;
}

export function installCssEscape<T extends CssGlobalLike>(
  target: T,
): asserts target is T & {CSS: object & {escape: (value: string) => string}} {
  const namespace = target.CSS as CssNamespaceWithEscape | undefined;
  if (typeof namespace?.escape === 'function') return;

  if (target.CSS === undefined) {
    Object.defineProperty(target, 'CSS', {
      configurable: true,
      writable: true,
      value: {},
    });
  }
  Object.defineProperty(target.CSS!, 'escape', {
    configurable: true,
    writable: true,
    value: cssEscape,
  });
}
