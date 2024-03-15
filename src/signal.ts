import { signal, computed } from "@preact/signals-react";

export const imageState = signal<ImageData | null>(null);

export const showCanvas = computed(() => imageState.value !== null);

export const actionDisabeled = computed(() => imageState.value === null);
