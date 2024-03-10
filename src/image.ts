export const IMAGE_TYPE = "image/png";

export const convertImageToImageData = async (image: Blob) => {
  const bitmap = await createImageBitmap(image);
  const { width, height } = bitmap;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  return context.getImageData(0, 0, width, height);
};

export const blobToDataURL = async (blob: Blob) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

export const convertImageDataToDataURL = async (
  imageData: ImageData,
  imageType = IMAGE_TYPE,
) => {
  const bitmap = await createImageBitmap(imageData);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  const blob = await canvas.convertToBlob({ type: imageType, quality: 1 });
  return blobToDataURL(blob);
};

export const convertImageDataToBase64 = async (imageData: ImageData) => {
  const dataURL = await convertImageDataToDataURL(imageData);
  return dataURL.split(",")[1];
};

export const convertDataURLToImageData = async (dataURL: string) => {
  const blob = await fetch(dataURL).then((res) => res.blob());
  return convertImageToImageData(blob);
};

export const convertBase64ToImageData = async (
  base64: string,
  imageType = IMAGE_TYPE,
) => {
  const dataURL = `data:${imageType};base64,${base64}`;
  return convertDataURLToImageData(dataURL);
};
