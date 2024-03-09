import { imageData$ } from "./state";

const stage: HTMLElement = document.querySelector("#stage")!;
const canvasElement: HTMLCanvasElement = document.querySelector("#canvas")!;

const context = canvasElement.getContext("2d")!;

export const showCanvas = () => {
  canvasElement.classList.remove("hidden");
};

export const hiddenCanvas = () => {
  canvasElement.classList.add("hidden");
};

const resizeCanvas = () => {
  canvasElement.width = stage.clientWidth;
  canvasElement.height = stage.clientHeight;
  if (imageData$.value) {
    drawIamge(imageData$.value);
  }
};

export const clearCanvas = () => {
  context.clearRect(0, 0, canvasElement.width, canvasElement.height);
};

const drawIamge = async (image: ImageData) => {
  clearCanvas();
  context.save();
  const canvasAspect = canvasElement.width / canvasElement.height;
  const imageAspect = image.width / image.height;
  if (canvasAspect > imageAspect) {
    const scale = canvasElement.height / image.height;
    context.translate(canvasElement.width / 2 - (image.width * scale) / 2, 0);
    context.scale(scale, scale);
  } else {
    const scale = canvasElement.width / image.width;
    context.translate(0, canvasElement.height / 2 - (image.height * scale) / 2);
    context.scale(scale, scale);
  }
  const bitmap = await createImageBitmap(image);
  context.drawImage(bitmap, 0, 0);
  context.restore();
};

export const convertImageFileToImageData = async (file: File) => {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  const imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
  return imageData;
};

export const convertToDataURL = (image: ImageData) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d")!;
  context.putImageData(image, 0, 0);
  return canvas.toDataURL("image/png");
};

export const convertToBase64 = (image: ImageData) => {
  const dataURL = convertToDataURL(image);
  return dataURL.split(",")[1];
};

export const setupCanvas = () => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  imageData$.subscribe((image) => {
    if (image) {
      drawIamge(image);
    }
  });
};
