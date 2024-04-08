import { expect, test, vi } from 'vitest';
import {
  base64ToImageData,
  blobToImageData,
  imageDataToBase64,
  imageDataToBlob,
} from '../../src/lib';
import { SUPPORTED_IMAGE_TYPE } from '../../src/constant';

const base64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC';

const imageBuffer = new Uint8Array([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0,
  0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 1, 115, 82, 71, 66, 0, 174,
  206, 28, 233, 0, 0, 0, 11, 73, 68, 65, 84, 24, 87, 99, 96, 0, 2, 0, 0, 5, 0,
  1, 170, 213, 200, 81, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
]);

const imageData = new ImageData(1, 1);

test('blob to image data', async () => {
  const blob = new Blob([imageBuffer], { type: SUPPORTED_IMAGE_TYPE });
  const expected = await blobToImageData(blob);
  expect(expected).toStrictEqual(imageData);
});

test('image data to blob', async () => {
  const blob = await imageDataToBlob(imageData, SUPPORTED_IMAGE_TYPE);
  const expected = new Uint8Array(await blob.arrayBuffer());
  expect(expected).toStrictEqual(imageBuffer);
});

test('base64 to image data', async () => {
  const expected = await base64ToImageData(base64, SUPPORTED_IMAGE_TYPE);
  expect(expected).toStrictEqual(imageData);
});

test('image data to base64', async () => {
  const expected = await imageDataToBase64(imageData, SUPPORTED_IMAGE_TYPE);
  expect(expected).toBe(base64);
});

class MockOffscreenCanvas {
  constructor(
    protected width: number,
    protected height: number,
  ) {}

  getContext(): null {
    return null;
  }
}

test('could not get context', async () => {
  vi.stubGlobal('OffscreenCanvas', MockOffscreenCanvas);
  await expect(() =>
    base64ToImageData(base64, SUPPORTED_IMAGE_TYPE),
  ).rejects.toThrowError('Failed to get 2D context');
  vi.unstubAllGlobals();
});
