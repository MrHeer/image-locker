import { IMAGE_TYPE, convertImageDataToDataURL } from "./image";

export const downloadImage = async (
  imageData: ImageData,
  imageType = IMAGE_TYPE,
) => {
  const dataURL = await convertImageDataToDataURL(imageData, imageType);

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "image";

  link.click();
};
