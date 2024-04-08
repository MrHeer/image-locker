import { expect, test } from 'vitest';
import { encrypt, decrypt } from '../../src/lib';

const buffer = new Uint8Array([129, 130, 227, 56, 240, 155, 156, 11, 114, 130]);
const password = 'image-locker';
const encrypted = new Uint8Array([
  197, 91, 238, 173, 113, 20, 244, 166, 13, 73, 21, 109, 191, 215, 86, 80, 106,
  102, 244, 66, 88, 38, 93, 48, 116, 152,
]);

test('encrypt with password', async () => {
  const expected = new Uint8Array(await encrypt(buffer, password));
  expect(expected).toStrictEqual(expected);
});

test('decrypt with password', async () => {
  const expected = new Uint8Array(await decrypt(encrypted, password));
  expect(expected).toStrictEqual(buffer);
});

test('decrypt should throw error when password is wrong', async () => {
  const wrongPassword = 'locker';
  await expect(() => decrypt(encrypted, wrongPassword)).rejects.toThrowError();
});
