import { convertToDataURL } from "./canvas";

export const download = (image: ImageData) => {
  const dataURL = convertToDataURL(image);

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "image.png";

  link.click();
};
