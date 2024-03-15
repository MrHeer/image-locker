import { IMAGE_TYPE } from "./image";

export const uploadImage = (imageType = IMAGE_TYPE) => {
  return new Promise<File>((resolve, reject) => {
    const uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.accept = imageType;
    uploadInput.addEventListener("change", (event) => {
      event.preventDefault();
      const { files } = event.target as HTMLInputElement;
      if (files?.length === 1) {
        resolve(files[0]);
      } else {
        reject(new Error("No image selected"));
      }
    });
    uploadInput.addEventListener("cancel", () => {
      reject(new Error("No image selected"));
    });
    uploadInput.click();
  });
};
