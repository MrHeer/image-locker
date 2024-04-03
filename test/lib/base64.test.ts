import { expect, test } from 'vitest';
import { base64ToBuffer } from '../../src/lib';

test('base64 to buffer', () => {
  const base64 = 'aGVsbG8=';
  const buffer = base64ToBuffer(base64);
  const expected = new Uint8Array([104, 101, 108, 108, 111]);
  expect(buffer).toStrictEqual(expected);
});

test.todo('buffer to base64');
