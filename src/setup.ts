import { setupBody } from "./body";
import { imageData$ } from "./state";
import { hiddenCanvas, setupCanvas, showCanvas } from "./canvas";
import { setupUpload, showUpload, hiddenUpload } from "./upload";
import { setupActions } from "./actions";

const subscribeImageData = () => {
  imageData$.subscribe((imageData) => {
    if (imageData) {
      hiddenUpload();
      showCanvas();
    } else {
      hiddenCanvas();
      showUpload();
    }
  });
};

export const setup = () => {
  setupBody();
  setupCanvas();
  setupUpload();
  setupActions();
  subscribeImageData();
};
