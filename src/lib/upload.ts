export const upload = (acceptType: string) => {
  return new Promise<File>((resolve, reject) => {
    const uploadInput = document.createElement("input");
    uploadInput.type = "file";
    uploadInput.accept = acceptType;
    uploadInput.addEventListener("change", (event) => {
      event.preventDefault();
      const { files } = event.target as HTMLInputElement;
      if (files?.length === 1) {
        resolve(files[0]);
      } else {
        reject(new Error("No file selected."));
      }
    });
    uploadInput.addEventListener("cancel", () => {
      reject(new Error("No file selected."));
    });
    uploadInput.click();
  });
};
