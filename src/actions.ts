import { map } from "rxjs";
import { imageData$, imageState$ } from "./state";
import { grayscale } from "./grayscale";
import { downloadImage } from "./download";
import { convertImageDataToBase64 } from "./image";

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
    imageState$.next("gray");
  });
  downloadButton.addEventListener("click", () => {
    const imageData = imageData$.value!;
    downloadImage(imageData);
  });
  copyButton.addEventListener("click", () => {
    const imageData = imageData$.value!;
    const base64 = convertImageDataToBase64(imageData);
    navigator.clipboard.writeText(base64);
    imageState$.next("copied");
  });
  compressButton.addEventListener("click", () => {
    console.log("compress");
  });
  restoreButton.addEventListener("click", () => {
    console.log("restore");
  });

  imageState$.pipe(map((state) => state !== "origin")).subscribe((disabled) => {
    grayButton.disabled = disabled;
  });
  imageState$.pipe(map((state) => state !== "gray")).subscribe((disabled) => {
    downloadButton.disabled = disabled;
    copyButton.disabled = disabled;
  });
  imageState$.pipe(map((state) => state !== "copied")).subscribe((disabled) => {
    compressButton.disabled = disabled;
  });
  imageState$
    .pipe(map((state) => state !== "compressed"))
    .subscribe((disabled) => {
      restoreButton.disabled = disabled;
    });
};
