import { it, describe, expect } from 'vitest';

import { getYearByOffset, isValidKey } from './utils';

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


describe('getYearByOffset', ()=> {
  it('latest', () => {
    expect(getYearByOffset()).toBeGreaterThanOrEqual(2026)
  })
})