import {
  imageStateSignal,
  originalImageStateSignal,
  initImageState,
  clearImageState,
  getImageState,
  updateImageState,
} from './signal';
import { type Filter } from './filters';
import {
  base64ToImageData,
  blobToImageData,
  download,
  imageDataToBase64,
  imageDataToBlob,
  lock,
  unlock,
} from './lib';

async function uploadAction(file: File): Promise<void> {
  const { name, type } = file;
  const data = await blobToImageData(file);
  const state = { name, type, data };
  initImageState(state);
}

function clearAction(): void {
  clearImageState();
}

function filterAction(filter: Filter): void {
  const { data } = getImageState(originalImageStateSignal);
  const newData = filter(data);
  updateImageState(imageStateSignal, { data: newData });
}

async function downloadAction(): Promise<void> {
  const state = getImageState(imageStateSignal);
  const { name, type, data } = state;
  const blob = await imageDataToBlob(data, type);
  download(blob, name);
}

async function copyAction(): Promise<void> {
  const state = getImageState(imageStateSignal);
  const { type, data } = state;
  const base64 = await imageDataToBase64(data, type);
  await navigator.clipboard.writeText(base64);
}

async function lockAction(password: string): Promise<void> {
  const state = getImageState(imageStateSignal);
  const { type, data } = state;
  const base64 = await imageDataToBase64(data, type);
  const lockedBase64 = await lock(base64, type, password);
  const lockedData = await base64ToImageData(lockedBase64, type);
  updateImageState(originalImageStateSignal, { data: lockedData });
  updateImageState(imageStateSignal, { data: lockedData });
}

async function unlockAction(password: string): Promise<void> {
  const state = getImageState(imageStateSignal);
  const { type, data } = state;
  const base64 = await imageDataToBase64(data, type);
  const unlockedBase64 = await unlock(base64, type, password);
  const unlockedData = await base64ToImageData(unlockedBase64, type);
  updateImageState(originalImageStateSignal, { data: unlockedData });
  updateImageState(imageStateSignal, { data: unlockedData });
}

export {
  uploadAction,
  clearAction,
  filterAction,
  downloadAction,
  copyAction,
  lockAction,
  unlockAction,
};
