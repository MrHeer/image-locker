export const blobToImageData = async (blob: Blob) => {
  const bitmap = await createImageBitmap(blob);
  const { width, height } = bitmap;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  return context.getImageData(0, 0, width, height);
};

export const imageDataToBlob = async (data: ImageData, type: string) => {
  const bitmap = await createImageBitmap(data);
  const { width, height } = bitmap;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  return canvas.convertToBlob({ type });
};

export const blobToDataURL = async (blob: Blob) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

export const imageDataToDataURL = async (data: ImageData, type: string) => {
  const blob = await imageDataToBlob(data, type);
  return blobToDataURL(blob);
};

export const imageDataToBase64 = async (data: ImageData, type: string) => {
  const dataURL = await imageDataToDataURL(data, type);
  return dataURL.split(",")[1];
};

export const dataURLToImageData = async (dataURL: string) => {
  const blob = await fetch(dataURL).then((res) => res.blob());
  return blobToImageData(blob);
};

export const base64ToImageData = async (base64: string, type: string) => {
  const dataURL = `data:${type};base64,${base64}`;
  return dataURLToImageData(dataURL);
};
