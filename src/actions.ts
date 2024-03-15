import { imageState } from "./signal";
import { grayscale } from "./filters";
import {
  compress,
  convertBase64ToImageData,
  convertImageDataToBase64,
  convertImageToImageData,
  decompress,
  downloadImage,
  uploadImage,
} from "./utils";

export const grayscaleAction = async () => {
  const imageData = imageState.value!;
  const newImageData = grayscale(imageData);
  imageState.value = newImageData;
};

export const downloadAction = async () => {
  const imageData = imageState.value!;
  await downloadImage(imageData);
};

export const copyAction = async () => {
  const imageData = imageState.value!;
  const base64 = await convertImageDataToBase64(imageData);
  await navigator.clipboard.writeText(base64);
};

export const compressAction = async () => {
  const imageData = imageState.value!;
  const base64 = await convertImageDataToBase64(imageData);
  const compressedBase64 = await compress(base64);
  const compressedImageData = await convertBase64ToImageData(compressedBase64);
  imageState.value = compressedImageData;
};

export const restoreAction = async () => {
  const image = await uploadImage();
  const imageData = await convertImageToImageData(image);
  const base64 = await convertImageDataToBase64(imageData);
  const decompressedBase64 = await decompress(base64);
  const originalImageData = await convertBase64ToImageData(decompressedBase64);
  imageState.value = originalImageData;
};
