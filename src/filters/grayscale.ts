import { type Filter } from './types';

export const grayscale: Filter = (imageData: ImageData) => {
  const newImageData = new ImageData(imageData.width, imageData.height);
  const { data } = newImageData;
  for (let i = 0; i < data.length; i += 4) {
    const red = imageData.data[i] ?? 0,
      green = imageData.data[i + 1] ?? 0,
      blue = imageData.data[i + 2] ?? 0,
      alpha = imageData.data[i + 3] ?? 0;

    const gray = 0.299 * red + 0.587 * green + 0.114 * blue;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    data[i + 3] = alpha;
  }
  return newImageData;
};
