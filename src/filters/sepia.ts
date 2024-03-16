import { Filter } from "./types";

export const sepia: Filter = (imageData: ImageData) => {
  const newImageData = new ImageData(imageData.width, imageData.height);
  const { data } = newImageData;
  for (let i = 0; i < data.length; i += 4) {
    const red = imageData.data[i],
      green = imageData.data[i + 1],
      blue = imageData.data[i + 2],
      alpha = imageData.data[i + 3];

    data[i] = Math.min(
      Math.round(0.393 * red + 0.769 * green + 0.189 * blue),
      255,
    );
    data[i + 1] = Math.min(
      Math.round(0.349 * red + 0.686 * green + 0.168 * blue),
      255,
    );
    data[i + 2] = Math.min(
      Math.round(0.272 * red + 0.534 * green + 0.131 * blue),
      255,
    );
    data[i + 3] = alpha;
  }
  return newImageData;
};
