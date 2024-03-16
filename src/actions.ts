import { imageData, imageState, updateImageData } from "./signal";
import { grayscale } from "./filters";
import {
  base64ToImageData,
  blobToImageData,
  download,
  imageDataToBase64,
  imageDataToBlob,
  lock,
  unlock,
  upload,
} from "./lib";
import { SUPPORTED_IMAGE_TYPE } from "./constant";

export const clearAction = async () => {
  imageState.value = null;
};

export const grayscaleAction = async () => {
  const data = imageData.value!;
  const newData = grayscale(data);
  updateImageData(newData);
};

export const downloadAction = async () => {
  const { name, type, data } = imageState.value!;
  const blob = await imageDataToBlob(data, type);
  await download(blob, name);
};

export const copyAction = async () => {
  const { data, type } = imageState.value!;
  const base64 = await imageDataToBase64(data, type);
  await navigator.clipboard.writeText(base64);
};

export const lockAction = async () => {
  const { data, type } = imageState.value!;
  const base64 = await imageDataToBase64(data, type);
  const lockedBase64 = await lock(base64, type);
  const lockedData = await base64ToImageData(lockedBase64, type);
  updateImageData(lockedData);
};

export const unlockAction = async () => {
  const image = await upload(SUPPORTED_IMAGE_TYPE);
  const { name, type } = image;
  const data = await blobToImageData(image);
  const base64 = await imageDataToBase64(data, type);
  const unlockedBase64 = await unlock(base64, type);
  const unlockedData = await base64ToImageData(unlockedBase64, type);
  imageState.value = { name, type, data: unlockedData };
};
