import { test, expect, vi } from 'vitest';
import {
  extractEncryptedBase64,
  imageDataToBase64,
  lock,
  unlock,
} from '../../src/lib';
import { SUPPORTED_IMAGE_TYPE } from '../../src/constant';

const base64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';

const password = 'image-locker';

const lockedBase64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAP1JREFUKFMVzZFzw1AAwOHfuxsUCoVC7ra7PRgEAoHCIBAoBAqBQrEQCBQeBAqDQWEwCAwKgcKDQaAQKBQCg0IgUAgMgoFBYRDI3dvt+wc+IV1M3zrIfqDxNGHoo8Zn5nXL+l0iqqsyVuMRXBJsJ2URb0l/I1zdcvHXiJ1XmH7qs7NTdF4grwFZJlmtarbWM6LSG6NyyM8K7dqc6jHbISRJCvbJA6Ibvs2sc9BeTNNNmNYF6VtPXGZUr//Fy8wsqhNZuOSu/EQuP5gcbvj7KY/3B4SLZVpH0g8NXhbwlJdYcwh+RmQqRkRfezPmRnGsiFqFb19QI81qs6E4RvwBkIFkBx0oQroAAAAASUVORK5CYII=';

const encryptedBase64 =
  'zYlD0oyFcqd/yz1c5rrLdIVosoCKM/jYobK4zhPtfU9AehpJOx+gYlou7cMBqzpbPUb6D3jPBRDEvCYMfFy8M6/3H5CwIcmCgr2NPYLpIycoKhfN0S7bmQcW6krfoTb45g==';

test('lock with password', async () => {
  const locked = await lock(base64, SUPPORTED_IMAGE_TYPE, password);
  const expected = await extractEncryptedBase64(locked, SUPPORTED_IMAGE_TYPE);

  expect(expected).toBe(encryptedBase64);
});

test('unlock with password', async () => {
  const expected = await unlock(lockedBase64, SUPPORTED_IMAGE_TYPE, password);
  expect(expected).toBe(base64);
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
