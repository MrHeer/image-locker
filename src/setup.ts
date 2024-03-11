import { effect } from "@preact/signals-core";
import { setupBody } from "./body";
import { showCanvas } from "./signal";
import { hiddenCanvasElement, setupCanvas, showCanvasElement } from "./canvas";
import { setupUpload, showUploadElement, hiddenUploadElement } from "./upload";
import { setupActions } from "./actions";

const subscribeImageData = () => {
  effect(() => {
    if (showCanvas.value) {
      hiddenUploadElement();
      showCanvasElement();
    } else {
      hiddenCanvasElement();
      showUploadElement();
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
