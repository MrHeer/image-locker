import { bufferToBase64, base64ToBuffer } from './base64';
import { decrypt, encrypt } from './crypto';
import { base64ToImageData, imageDataToBase64 } from './image';

const IDENTITY = 'IMAGELOCKER';
const BASE64_TABLE =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const REGEX = new RegExp(`^${IDENTITY}(?<base64>.+)${IDENTITY}.*$`);

function base64CharToColor(base64: string): number {
  if (base64.length === 1 && BASE64_TABLE.includes(base64)) {
    return BASE64_TABLE.indexOf(base64) * 4;
  }
  if (base64 === '=') {
    return 255;
  }
  throw new Error('Invalid base64 character.');
}

function colorToBase64Char(color: number): string {
  if (color === 255) return '=';
  const char = BASE64_TABLE[color / 4];
  if (char === undefined)
    throw new Error('Could not convert color to base64 character.');
  return char;
}

function paddingEnd(
  text: string,
  maxLength: number,
  random: () => string,
): string {
  const paddingLength = maxLength - text.length;
  let padding = '';
  for (let i = 0; i < paddingLength; i++) {
    const paddingChar = random()[0];
    padding += paddingChar;
  }
  return text + padding;
}

function randomBase64Char(): string {
  const randomIndex = Math.floor(Math.random() * BASE64_TABLE.length);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- randomIndex is in range
  return BASE64_TABLE[randomIndex]!;
}

/**
 * When RGBA data including transparent colors is obtained from Canvas usinggetImageData
 * getImageData, the RGB values may differ from the imagine values.
 * https://dev.to/yoya/canvas-getimagedata-premultiplied-alpha-150b
 */
async function encode(base64: string, type: string): Promise<string> {
  const length = base64.length + IDENTITY.length * 2;
  const remainder = length % 3;
  const pixelLength = (length + remainder) / 3;
  const width = Math.ceil(Math.sqrt(pixelLength));
  const imageData = new ImageData(width, width);
  const paddedBase64 = paddingEnd(
    `${IDENTITY}${base64}${IDENTITY}`,
    width * width * 3,
    randomBase64Char,
  );
  for (let i = 0; i < width * width; i++) {
    imageData.data[i * 4] = base64CharToColor(paddedBase64.charAt(i * 3));
    imageData.data[i * 4 + 1] = base64CharToColor(
      paddedBase64.charAt(i * 3 + 1),
    );
    imageData.data[i * 4 + 2] = base64CharToColor(
      paddedBase64.charAt(i * 3 + 2),
    );
    imageData.data[i * 4 + 3] = 255;
  }

  return imageDataToBase64(imageData, type);
}

async function decode(base64: string, type: string): Promise<string> {
  const imageData = await base64ToImageData(base64, type);
  const originBase64Array: string[] = [];
  imageData.data
    .filter((_, index) => index % 4 !== 3)
    .forEach((color) => {
      originBase64Array.push(colorToBase64Char(color));
    });
  return originBase64Array.join('');
}

async function lock(
  base64: string,
  type: string,
  password: string,
): Promise<string> {
  const buffer = base64ToBuffer(base64);
  const encryptedBuffer = await encrypt(buffer, password);
  const encryptedBase64 = bufferToBase64(encryptedBuffer);
  return encode(encryptedBase64, type);
}

function isLocked(decodedBase64: string): boolean {
  return REGEX.test(decodedBase64);
}

async function extractEncryptedBase64(
  lockedbase64: string,
  type: string,
): Promise<string> {
  const decodedBase64 = await decode(lockedbase64, type);
  if (!isLocked(decodedBase64)) {
    throw new Error('This image is not locked.');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked above
  return REGEX.exec(decodedBase64)!.groups!.base64!;
}

async function unlock(
  lockedBase64: string,
  type: string,
  password: string,
): Promise<string> {
  const encryptedBase64 = await extractEncryptedBase64(lockedBase64, type);
  const encryptedBuffer = base64ToBuffer(encryptedBase64);
  try {
    const decryptedBuffer = await decrypt(encryptedBuffer, password);
    const originBase64 = bufferToBase64(decryptedBuffer);
    return originBase64;
  } catch (error) {
    throw new Error('The password is incorrect.');
  }
}

export { lock, unlock, extractEncryptedBase64 };
