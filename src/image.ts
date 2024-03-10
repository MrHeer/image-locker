export const IMAGE_TYPE = "image/png";

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

export const convertImageDataToDataURL = (
  imageData: ImageData,
  imageType = IMAGE_TYPE,
) => {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const context = canvas.getContext("2d")!;
  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL(imageType);
};

export const convertImageDataToBase64 = (imageData: ImageData) => {
  const dataURL = convertImageDataToDataURL(imageData);
  return dataURL.split(",")[1];
};
