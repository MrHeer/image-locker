import { effect } from "@preact/signals-core";
import { imageState } from "./signal";

const stage: HTMLElement = document.querySelector("#stage")!;
const canvasElement: HTMLCanvasElement = document.querySelector("#canvas")!;

const context = canvasElement.getContext("2d")!;

export const showCanvasElement = () => {
  canvasElement.classList.remove("hidden");
};

export const hiddenCanvasElement = () => {
  canvasElement.classList.add("hidden");
};

const resizeCanvas = () => {
  canvasElement.width = stage.clientWidth;
  canvasElement.height = stage.clientHeight;
  if (imageState.value) {
    drawIamge(imageState.value);
  }
};

export const clearCanvas = () => {
  context.clearRect(0, 0, canvasElement.width, canvasElement.height);
};

const drawIamge = async (imageData: ImageData) => {
  clearCanvas();
  context.save();
  const canvasAspect = canvasElement.width / canvasElement.height;
  const imageAspect = imageData.width / imageData.height;
  if (canvasAspect > imageAspect) {
    const scale = canvasElement.height / imageData.height;
    context.translate(
      canvasElement.width / 2 - (imageData.width * scale) / 2,
      0,
    );
    context.scale(scale, scale);
  } else {
    const scale = canvasElement.width / imageData.width;
    context.translate(
      0,
      canvasElement.height / 2 - (imageData.height * scale) / 2,
    );
    context.scale(scale, scale);
  }
  const bitmap = await createImageBitmap(imageData);
  context.drawImage(bitmap, 0, 0);
  context.restore();
};

export const setupCanvas = () => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  effect(() => {
    const imageData = imageState.value;
    if (imageData) {
      drawIamge(imageData);
    }
  });
};
