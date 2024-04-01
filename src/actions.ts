import { imageState, originalImageState, updateImageData } from "./signal";
import { Filter } from "./filters";
import {
  base64ToImageData,
  blobToImageData,
  download,
  imageDataToBase64,
  imageDataToBlob,
  lock,
  unlock,
} from "./lib";

export const uploadAction = async (file: File) => {
  const { name, type } = file;
  const data = await blobToImageData(file);
  const state = { name, type, data };
  originalImageState.value = state;
  imageState.value = state;
};

export const clearAction = async () => {
  originalImageState.value = null;
  imageState.value = null;
};

export const filterAction = (filter: Filter) => {
  const data = originalImageState.value!.data;
  const newData = filter(data);
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

export const lockAction = async (password: string) => {
  const { data, type } = imageState.value!;
  const base64 = await imageDataToBase64(data, type);
  const lockedBase64 = await lock(base64, type, password);
  const lockedData = await base64ToImageData(lockedBase64, type);
  updateImageData(lockedData, true);
};

export const unlockAction = async (password: string) => {
  const { data, type } = imageState.value!;
  const base64 = await imageDataToBase64(data, type);
  const unlockedBase64 = await unlock(base64, type, password);
  const unlockedData = await base64ToImageData(unlockedBase64, type);
  updateImageData(unlockedData, true);
};
