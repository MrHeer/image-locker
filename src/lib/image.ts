function getContext(
  width: number,
  height: number,
): OffscreenCanvasRenderingContext2D {
  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext('2d');
  if (context === null) {
    throw new Error('Failed to get 2D context');
  }
  return context;
}

async function blobToImageData(blob: Blob): Promise<ImageData> {
  const bitmap = await createImageBitmap(blob);
  const { width, height } = bitmap;
  const context = getContext(width, height);
  context.drawImage(bitmap, 0, 0);
  return context.getImageData(0, 0, width, height);
}

async function imageDataToBlob(data: ImageData, type: string): Promise<Blob> {
  const bitmap = await createImageBitmap(data);
  const { width, height } = bitmap;
  const context = getContext(width, height);
  context.drawImage(bitmap, 0, 0);
  return context.canvas.convertToBlob({ type });
}

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
}

async function imageDataToDataURL(
  data: ImageData,
  type: string,
): Promise<string> {
  const blob = await imageDataToBlob(data, type);
  return blobToDataURL(blob);
}

async function imageDataToBase64(
  data: ImageData,
  type: string,
): Promise<string> {
  const dataURL = await imageDataToDataURL(data, type);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- dataURL is valid
  return dataURL.split(',')[1]!;
}

async function dataURLToImageData(dataURL: string): Promise<ImageData> {
  const blob = await fetch(dataURL).then((res) => res.blob());
  return blobToImageData(blob);
}

async function base64ToImageData(
  base64: string,
  type: string,
): Promise<ImageData> {
  const dataURL = `data:${type};base64,${base64}`;
  return dataURLToImageData(dataURL);
}

export {
  blobToImageData,
  imageDataToBlob,
  imageDataToBase64,
  base64ToImageData,
};
