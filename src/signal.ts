import { signal, computed, Signal } from "@preact/signals-react";

type ImageState = {
  name: string;
  type: string;
  data: ImageData;
};

export const originalImageState = signal<ImageState | null>(null);

export const imageState = signal<ImageState | null>(null);

export const imageData = computed(() => imageState.value?.data);

export const showCanvas = computed(() => imageState.value !== null);

export const actionDisabeled = computed(() => imageState.value === null);

export const updateImageData = (data: ImageData, overwriteOriginal = false) => {
  const updateState = (state: Signal<ImageState | null>) => {
    const value = state.value;
    if (value) {
      state.value = {
        ...value,
        data,
      };
    }
  };

  updateState(imageState);

  if (overwriteOriginal) {
    updateState(originalImageState);
  }
};
