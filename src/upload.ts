import { body } from "./body";
import { convertImageFileToImageData } from "./canvas";
import { imageData, imageState } from "./state";

const uploadInput: HTMLInputElement = document.querySelector("#upload-input")!;
const uploadBox: HTMLElement = document.querySelector("#upload-box")!;

const handleFile = async (file: File) => {
  const image = await convertImageFileToImageData(file);
  imageData.next(image);
  imageState.next("origin");
};

const changeHandler = (event: Event) => {
  event.preventDefault();
  const { files } = event.target as HTMLInputElement;
  if (files?.length === 1) {
    handleFile(files[0]);
  }
};

const dropHandler = (event: DragEvent) => {
  // Prevent default behavior (Prevent file from being opened)
  event.preventDefault();
  body.classList.remove("droppable");

  const files: File[] = [];
  if (event.dataTransfer?.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...event.dataTransfer.items].forEach((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile()!;
        files.push(file);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...(event.dataTransfer?.files ?? [])].forEach((file) => {
      files.push(file);
    });
  }

  if (files.length !== 1) {
    console.log("only 1 file allowed");
    return;
  }

  const file = files[0];
  if (file.type !== "image/png") {
    console.log("only png allowed");
    return;
  }
  handleFile(file);
};

const dragOverHandler = (event: DragEvent) => {
  // Prevent default behavior (Prevent file from being opened)
  event.preventDefault();
  event.stopPropagation();
  uploadBox.classList.add("dragover");
  body.classList.remove("dragging");
  body.classList.add("droppable");
};

const dragLeaveHandler = (event: DragEvent) => {
  // Prevent default behavior (Prevent file from being opened)
  event.preventDefault();
  body.classList.add("dragging");
  body.classList.remove("droppable");
  uploadBox.classList.remove("dragover");
};

export const showUpload = () => {
  uploadBox.classList.remove("hidden");
};

export const hiddenUpload = () => {
  uploadBox.classList.add("hidden");
};

export const setupUpload = () => {
  uploadInput.addEventListener("change", changeHandler);
  uploadBox.addEventListener("drop", dropHandler);
  uploadBox.addEventListener("dragover", dragOverHandler);
  uploadBox.addEventListener("dragleave", dragLeaveHandler);
};
