export const grayscale = (imageData: ImageData) => {
  const newImageData = new ImageData(imageData.width, imageData.height);
  const { data } = newImageData;
  for (let i = 0; i < data.length; i += 4) {
    const gray =
      0.299 * imageData.data[i] +
      0.587 * imageData.data[i + 1] +
      0.114 * imageData.data[i + 2];
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
    data[i + 3] = imageData.data[i + 3];
  }
  return newImageData;
};
