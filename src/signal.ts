import { signal, computed } from "@preact/signals-react";

type ImageState = {
  name: string;
  type: string;
  data: ImageData;
};

export const imageState = signal<ImageState | null>(null);

export const imageData = computed(() => imageState.value?.data);

export const showCanvas = computed(() => imageState.value !== null);

export const actionDisabeled = computed(() => imageState.value === null);

export const updateImageData = (data: ImageData) => {
  const value = imageState.value;
  if (value) {
    imageState.value = {
      ...value,
      data,
    };
  }
};
