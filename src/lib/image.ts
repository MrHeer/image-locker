const blobToImageData = async (blob: Blob) => {
  const bitmap = await createImageBitmap(blob);
  const { width, height } = bitmap;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  return context.getImageData(0, 0, width, height);
};

const imageDataToBlob = async (data: ImageData, type: string) => {
  const bitmap = await createImageBitmap(data);
  const { width, height } = bitmap;
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d")!;
  context.drawImage(bitmap, 0, 0);
  return canvas.convertToBlob({ type });
};

const blobToDataURL = async (blob: Blob) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

const imageDataToDataURL = async (data: ImageData, type: string) => {
  const blob = await imageDataToBlob(data, type);
  return blobToDataURL(blob);
};

const imageDataToBase64 = async (data: ImageData, type: string) => {
  const dataURL = await imageDataToDataURL(data, type);
  return dataURL.split(",")[1];
};

const dataURLToImageData = async (dataURL: string) => {
  const blob = await fetch(dataURL).then((res) => res.blob());
  return blobToImageData(blob);
};

const base64ToImageData = async (base64: string, type: string) => {
  const dataURL = `data:${type};base64,${base64}`;
  return dataURLToImageData(dataURL);
};

export {
  blobToImageData,
  imageDataToBlob,
  imageDataToBase64,
  base64ToImageData,
};
