import { expect, test } from 'vitest';
import { base64ToBuffer, bufferToBase64 } from '../../src/lib';

const base64 = 'aGVsbG8=';
const buffer = new Uint8Array([104, 101, 108, 108, 111]);

test('base64 to buffer', () => {
  const expected = new Uint8Array(base64ToBuffer(base64));
  expect(expected).toStrictEqual(buffer);
});

test('buffer to base64', () => {
  const expected = bufferToBase64(buffer);
  expect(expected).toBe(base64);
});
