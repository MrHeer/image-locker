import { test, expect, vi } from 'vitest';
import { imageDataToBase64, lock, unlock } from '../../src/lib';
import { SUPPORTED_IMAGE_TYPE } from '../../src/constant';

const base64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';

const password = 'image-locker';

const lockedBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAORJREFUKFNdjRFww2AYQN9/NywUArnr7vZjIBAoDAKBQaEQKBQLg8AgEAgUBoVBITAoBAo/DIKB3q1QLAQCvVtgEIxtMAjk7tsNu2fvyVPaQ/rWRfcDjW8Iw4B4dOShblltNaq6xGI3PrNzguNmzKOU7OcRz7ScgxVq45fSWwEbJ8MUJfoyI881y2VNat+jKvMkcQHFMcZ4Dod6RDqEJEnJLrlFdcOnTDsX40c03RirLsleeqJTTvX8t1hPZV4dyMMFN6c39OKV8f6bYGdxN9mjPGxpXU0/NPgfX7xzjRIR+deu9BewQVghGy63sAAAAABJRU5ErkJggg==';

test('lock with password', async () => {
  const expected = await lock(base64, SUPPORTED_IMAGE_TYPE, password);
  expect(lockedBase64).toBe(expected);
});

test('unlock with password', async () => {
  const expected = await unlock(lockedBase64, SUPPORTED_IMAGE_TYPE, password);
  expect(base64).toBe(expected);
});

test('unlock with not encrypted base64', async () => {
  await expect(() =>
    unlock(base64, SUPPORTED_IMAGE_TYPE, password),
  ).rejects.toThrowError('This image is not locked');
});

test('unlock with wrong password', async () => {
  await expect(() =>
    unlock(lockedBase64, SUPPORTED_IMAGE_TYPE, 'wrong-password'),
  ).rejects.toThrowError('The password is incorrect.');
});

test('invalid base64', async () => {
  vi.stubGlobal('btoa', () => '-');
  await expect(() =>
    lock(lockedBase64, SUPPORTED_IMAGE_TYPE, password),
  ).rejects.toThrowError('Invalid base64 character.');
  vi.unstubAllGlobals();
});

test('could not convert color to base64', async () => {
  const image = new ImageData(1, 1);
  image.data[0] = 25;
  image.data[1] = 25;
  image.data[2] = 25;
  image.data[3] = 255;
  const invalidBase64 = await imageDataToBase64(image, SUPPORTED_IMAGE_TYPE);
  await expect(() =>
    unlock(invalidBase64, SUPPORTED_IMAGE_TYPE, password),
  ).rejects.toThrowError('Could not convert color to base64 character.');
});
