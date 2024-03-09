export const grayscale = (image: ImageData) => {
  const newImage = new ImageData(image.width, image.height);
  const { data } = newImage;
  for (let i = 0; i < data.length; i += 4) {
    const gray =
      0.299 * image.data[i] +
      0.587 * image.data[i + 1] +
      0.114 * image.data[i + 2];
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    data[i + 3] = image.data[i + 3];
  }
  return newImage;
};
