import { IMAGE_TYPE, convertImageDataToDataURL } from "./image";

export const downloadImage = async (
  imageData: ImageData,
  imageType = IMAGE_TYPE,
  imageName = "image",
) => {
  const dataURL = await convertImageDataToDataURL(imageData, imageType);

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = imageName;

  link.click();
};
