import { imageData$, actionDisabeled$ } from "./state";
import { grayscale } from "./grayscale";
import { downloadImage } from "./download";
import { convertBase64ToImageData, convertImageDataToBase64 } from "./image";
import { compress, decompress } from "./compress";
import { uploadImage } from "./upload";

const grayButton: HTMLButtonElement = document.querySelector("#gray")!;
const downloadButton: HTMLButtonElement = document.querySelector("#download")!;
const copyButton: HTMLButtonElement = document.querySelector("#copy")!;
const compressButton: HTMLButtonElement = document.querySelector("#compress")!;
const restoreButton: HTMLButtonElement = document.querySelector("#restore")!;

export const setupActions = () => {
  grayButton.addEventListener("click", () => {
    const imageData = imageData$.value!;
    const newImageData = grayscale(imageData);
    imageData$.next(newImageData);
  });
  downloadButton.addEventListener("click", () => {
    const imageData = imageData$.value!;
    downloadImage(imageData);
  });
  copyButton.addEventListener("click", async () => {
    const imageData = imageData$.value!;
    const base64 = convertImageDataToBase64(imageData);
    navigator.clipboard.writeText(base64);
    console.log("copied");
  });
  compressButton.addEventListener("click", async () => {
    const imageData = imageData$.value!;
    const base64 = convertImageDataToBase64(imageData);
    const compressedBase64 = compress(base64);
    const compressedImageData =
      await convertBase64ToImageData(compressedBase64);
    imageData$.next(compressedImageData);
  });
  restoreButton.addEventListener("click", async () => {
    const imageData = await uploadImage();
    const base64 = convertImageDataToBase64(imageData);
    try {
      const decompressedBase64 = await decompress(base64);
      const originalImageData =
        await convertBase64ToImageData(decompressedBase64);
      imageData$.next(originalImageData);
    } catch (error) {
      console.error(error);
    }
  });

  actionDisabeled$.subscribe((disabled) => {
    grayButton.disabled = disabled;
    downloadButton.disabled = disabled;
    copyButton.disabled = disabled;
    compressButton.disabled = disabled;
  });
};
