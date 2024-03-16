import { Filter } from "./types";

export const invert: Filter = (imageData: ImageData) => {
  const newImageData = new ImageData(imageData.width, imageData.height);
  const { data } = newImageData;
  for (let i = 0; i < data.length; i += 4) {
    const red = imageData.data[i],
      green = imageData.data[i + 1],
      blue = imageData.data[i + 2],
      alpha = imageData.data[i + 3];

    data[i] = 255 - red;
    data[i + 1] = 255 - green;
    data[i + 2] = 255 - blue;
    data[i + 3] = alpha;
  }
  return newImageData;
};
