import { test, expect, vi } from 'vitest';
import { decode, lock, unlock } from '../../src/lib';
import { SUPPORTED_IMAGE_TYPE } from '../../src/constant';

const image = new ImageData(1, 1);
('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC');

const lockedImage = new ImageData(
  new Uint8ClampedArray([
    32, 48, 0, 255, 24, 16, 44, 255, 56, 8, 40, 255, 16, 68, 204, 255, 96, 148,
    12, 255, 208, 160, 200, 255, 20, 112, 168, 255, 116, 252, 200, 255, 204,
    212, 112, 255, 228, 172, 172, 255, 44, 116, 32, 255, 84, 160, 176, 255, 160,
    8, 40, 255, 48, 252, 140, 255, 96, 160, 108, 255, 40, 224, 204, 255, 132,
    60, 180, 255, 124, 80, 244, 255, 0, 120, 132, 255, 164, 36, 56, 255, 196,
    248, 128, 255, 96, 148, 160, 255, 184, 236, 112, 255, 48, 4, 168, 255, 204,
    164, 108, 255, 60, 80, 108, 255, 232, 12, 220, 255, 140, 60, 4, 255, 68, 12,
    16, 255, 188, 8, 96, 255, 48, 124, 20, 255, 200, 240, 48, 255, 232, 252,
    220, 255, 28, 228, 8, 255, 192, 32, 112, 255, 152, 8, 128, 255, 172, 216,
    52, 255, 60, 96, 44, 255, 164, 32, 200, 255, 112, 160, 40, 255, 132, 124,
    52, 255, 208, 72, 236, 255, 108, 152, 64, 255, 112, 88, 232, 255, 144, 172,
    124, 255, 160, 76, 108, 255, 224, 228, 128, 255, 255, 255, 32, 255, 48, 0,
    24, 255, 16, 44, 56, 255, 8, 40, 16, 255, 68, 68, 156, 255, 220, 148, 236,
    255, 68, 200, 84, 255, 152, 120, 228, 255, 12, 96, 8, 255, 104, 144, 176,
    255, 76, 32, 216, 255, 184, 80, 92, 255, 148, 116, 92, 255, 76, 100, 232,
    255, 64, 144, 248, 255, 92, 100, 236, 255, 236, 112, 16, 255,
  ]),
  8,
  8,
);

const password = 'image-locker';

const encryptedBuffer = new Uint8Array([
  205, 137, 67, 210, 140, 133, 114, 167, 127, 203, 61, 92, 230, 186, 203, 116,
  133, 104, 178, 128, 138, 51, 248, 216, 161, 178, 184, 206, 19, 237, 125, 79,
  64, 122, 26, 73, 59, 31, 160, 98, 90, 46, 237, 195, 1, 171, 58, 91, 61, 70,
  250, 15, 120, 207, 5, 16, 196, 188, 38, 12, 124, 92, 188, 51, 175, 247, 31,
  144, 176, 33, 201, 130, 130, 189, 141, 61, 130, 233, 35, 39, 40, 42, 23, 205,
  209, 46, 219, 153, 7, 22, 234, 74, 223, 161, 54, 248, 230,
]);

test('lock with password', async () => {
  const locked = await lock(image, SUPPORTED_IMAGE_TYPE, password);

  const expected = await decode(locked);
  expect(expected).toStrictEqual(encryptedBuffer);
});

test('unlock with password', async () => {
  const expected = await unlock(lockedImage, SUPPORTED_IMAGE_TYPE, password);
  expect(expected).toStrictEqual(image);
});

test('unlock with not encrypted base64', async () => {
  await expect(() =>
    unlock(image, SUPPORTED_IMAGE_TYPE, password),
  ).rejects.toThrowError('This image is not locked.');
});

test('unlock with wrong password', async () => {
  await expect(() =>
    unlock(lockedImage, SUPPORTED_IMAGE_TYPE, 'wrong-password'),
  ).rejects.toThrowError('The password is incorrect.');
});

test('invalid base64', async () => {
  vi.stubGlobal('btoa', () => '-');
  await expect(() =>
    lock(lockedImage, SUPPORTED_IMAGE_TYPE, password),
  ).rejects.toThrowError('Invalid base64 character.');
  vi.unstubAllGlobals();
});

test('could not convert color to base64', async () => {
  const validImage = new ImageData(1, 1);
  validImage.data[0] = 25;
  validImage.data[1] = 25;
  validImage.data[2] = 25;
  validImage.data[3] = 255;
  await expect(() => decode(validImage)).rejects.toThrowError(
    'This image is not encoded.',
  );
});
