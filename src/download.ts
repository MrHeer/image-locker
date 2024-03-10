import { IMAGE_TYPE, convertImageDataToDataURL } from "./image";

export const downloadImage = (imageData: ImageData, imageType = IMAGE_TYPE) => {
  const dataURL = convertImageDataToDataURL(imageData, imageType);

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "image";

  link.click();
};
