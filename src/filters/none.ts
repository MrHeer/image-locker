import { type Filter } from './types';

export const none: Filter = (imageData: ImageData) => {
  return imageData;
};
