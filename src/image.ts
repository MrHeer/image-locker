export const IMAGE_TYPE = "image/png";

export const convertImageToImageData = async (image: Blob) => {
  const bitmap = await createImageBitmap(image);
  const { width, height } = bitmap;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  return context.getImageData(0, 0, width, height);
};

export const convertImageDataToDataURL = async (
  imageData: ImageData,
  imageType = IMAGE_TYPE,
) => {
  const bitmap = await createImageBitmap(imageData);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  return canvas.toDataURL(imageType, 1);
};

export const convertImageDataToBase64 = async (imageData: ImageData) => {
  const dataURL = await convertImageDataToDataURL(imageData);
  return dataURL.split(",")[1];
};

export const convertDataURLToImageData = async (dataURL: string) => {
  const blob = await fetch(dataURL).then((res) => res.blob());
  return await convertImageToImageData(blob);
};

export const convertBase64ToImageData = async (
  base64: string,
  imageType = IMAGE_TYPE,
) => {
  const dataURL = `data:${imageType};base64,${base64}`;
  return await convertDataURLToImageData(dataURL);
};
