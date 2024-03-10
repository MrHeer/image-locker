import { convertBase64ToImageData, convertImageDataToBase64 } from "./image";

const PREFIX = "MrHeer";
const BASE64_TABLE =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const base64CharToColor = (base64: string) => {
  if (base64.length !== 1) {
    throw new Error("only single character");
  }
  if (BASE64_TABLE.includes(base64)) {
    return BASE64_TABLE.indexOf(base64) * 4;
  }
  if (base64 === "=") {
    return 255;
  }
  throw new Error("invalid character");
};

const colorToBase64Char = (color: number) => {
  if (color === 255) return "=";
  return BASE64_TABLE[color / 4];
};

export const compress = async (base64: string, prefix = PREFIX) => {
  const length = base64.length + prefix.length * 2;
  const remainder = length % 4;
  const pixelLength = (length + remainder) / 4;
  const width = Math.ceil(Math.sqrt(pixelLength));
  const imageData = new ImageData(width, width);
  const paddedBase64 = `${prefix}${base64}${prefix}`.padEnd(
    width * width * 4,
    "=",
  );
  for (let i = 0; i < paddedBase64.length; i++) {
    imageData.data[i] = base64CharToColor(paddedBase64[i]);
  }
  return convertImageDataToBase64(imageData);
};

export const decompress = async (base64: string, prefix = PREFIX) => {
  const imageData = await convertBase64ToImageData(base64);
  const originBase64Array: string[] = [];
  imageData.data.forEach((color) => {
    originBase64Array.push(colorToBase64Char(color));
  });
  const regex = new RegExp(`^${prefix}(?<base64>.+)${prefix}(=*)$`);
  const originBase64 = originBase64Array.join().match(regex)?.groups?.base64;
  if (originBase64 === undefined) {
    throw new Error("invalid compressed base64");
  }
  return originBase64;
};
