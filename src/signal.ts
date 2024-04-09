import { signal, computed, type Signal } from '@preact/signals-react';

interface ImageState {
  name: string;
  type: string;
  data: ImageData;
}

const originalImageStateSignal = signal<ImageState | null>(null);

const imageStateSignal = signal<ImageState | null>(null);

const imageDataSignal = computed(() => {
  try {
    const state = getImageState(imageStateSignal);
    return state.data;
  } catch (error) {
    return null;
  }
});

const actionDisabeledSignal = computed(() => imageStateSignal.value === null);

function initImageState(state: ImageState): void {
  originalImageStateSignal.value = state;
  imageStateSignal.value = state;
}

function clearImageState(): void {
  originalImageStateSignal.value = null;
  imageStateSignal.value = null;
}

function getImageState(imageState: Signal<ImageState | null>): ImageState {
  const { value } = imageState;
  if (value === null) {
    throw new Error('Image not uploaded');
  }
  return value;
}

function updateImageState(
  imageState: Signal<ImageState | null>,
  state: Partial<ImageState>,
): void {
  const value = getImageState(imageState);
  imageState.value = {
    ...value,
    ...state,
  };
}

export {
  originalImageStateSignal,
  imageStateSignal,
  imageDataSignal,
  actionDisabeledSignal,
  initImageState,
  clearImageState,
  getImageState,
  updateImageState,
};
