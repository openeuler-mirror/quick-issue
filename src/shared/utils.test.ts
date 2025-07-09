import { it, describe, expect } from 'vitest';

import { isValidKey } from './utils';

describe('isValidKey', () => {
  const obj = {
    key: true,
  }
  it('is valid', () => {
    expect(isValidKey('key', obj)).toBe(true);
  });
  it('is not valid', () => {
    expect(isValidKey('key2', obj)).not.toBe(true);
  });

});

