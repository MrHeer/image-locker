import { base64ToImageData, imageDataToBase64 } from "./image";

const IDENTITY = "IMAGELOCKER";
const BASE64_TABLE =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const base64CharToColor = (base64: string) => {
  if (base64.length !== 1) {
    throw new Error("Need a character.");
  }
  if (BASE64_TABLE.includes(base64)) {
    return BASE64_TABLE.indexOf(base64) * 4;
  }
  if (base64 === "=") {
    return 255;
  }
  throw new Error("Invalid base64 character.");
};

const colorToBase64Char = (color: number) => {
  if (color === 255) return "=";
  return BASE64_TABLE[color / 4];
};

/**
 * When RGBA data including transparent colors is obtained from Canvas usinggetImageData
 * getImageData, the RGB values may differ from the imagine values.
 * https://dev.to/yoya/canvas-getimagedata-premultiplied-alpha-150b
 */
const encode = async (base64: string, type: string, password: string) => {
  const length = base64.length + IDENTITY.length * 2 + password.length * 2;
  const remainder = length % 3;
  const pixelLength = (length + remainder) / 3;
  const width = Math.ceil(Math.sqrt(pixelLength));
  const imageData = new ImageData(width, width);
  const paddedBase64 =
    `${IDENTITY}${password}${base64}${password}${IDENTITY}`.padEnd(
      width * width * 3,
      "=",
    );
  for (let i = 0; i < width * width; i++) {
    imageData.data[i * 4] = base64CharToColor(paddedBase64[i * 3]);
    imageData.data[i * 4 + 1] = base64CharToColor(paddedBase64[i * 3 + 1]);
    imageData.data[i * 4 + 2] = base64CharToColor(paddedBase64[i * 3 + 2]);
    imageData.data[i * 4 + 3] = 255;
  }

  return imageDataToBase64(imageData, type);
};

const decode = async (base64: string, type: string) => {
  const imageData = await base64ToImageData(base64, type);
  const originBase64Array: string[] = [];
  imageData.data
    .filter((_, index) => index % 4 !== 3)
    .forEach((color) => {
      originBase64Array.push(colorToBase64Char(color));
    });
  return originBase64Array.join("");
};

export const lock = async (base64: string, type: string, password: string) => {
  return encode(base64, type, password);
};

export const isLocked = (decodedBase64: string) => {
  const regex = new RegExp(`^${IDENTITY}.+${IDENTITY}=*$`);
  return regex.test(decodedBase64);
};

export const unlock = async (
  base64: string,
  type: string,
  password: string,
) => {
  const decodedBase64 = await decode(base64, type);
  if (isLocked(decodedBase64) === false) {
    throw new Error("This image is not locked.");
  }

  const regex = new RegExp(
    `^${IDENTITY}${password}(?<base64>.+)${password}${IDENTITY}=*$`,
  );
  const originBase64 = decodedBase64.match(regex)?.groups?.base64;
  if (originBase64 === undefined) {
    throw new Error("Password is incorrect.");
  }
  return originBase64;
};
