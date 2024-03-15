import { useCallback, useEffect, useRef } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { imageState } from "../signal";

function Canvas({ width, height }: { width: number; height: number }) {
  useSignals();
  const ref = useRef<HTMLCanvasElement>(null);
  const imageData = imageState.value;

  const clearCanvas = useCallback(
    (context: CanvasRenderingContext2D) => {
      context.clearRect(0, 0, width, height);
    },
    [width, height],
  );

  const drawIamge = useCallback(
    async (context: CanvasRenderingContext2D, imageData: ImageData) => {
      context.save();
      const canvasAspect = width / height;
      const imageAspect = imageData.width / imageData.height;
      if (canvasAspect > imageAspect) {
        const scale = height / imageData.height;
        context.translate(width / 2 - (imageData.width * scale) / 2, 0);
        context.scale(scale, scale);
      } else {
        const scale = width / imageData.width;
        context.translate(0, height / 2 - (imageData.height * scale) / 2);
        context.scale(scale, scale);
      }
      const bitmap = await createImageBitmap(imageData);
      clearCanvas(context);
      context.drawImage(bitmap, 0, 0);
      context.restore();
    },
    [clearCanvas, height, width],
  );

  useEffect(() => {
    const context = ref.current?.getContext("2d");
    if (context && imageData) {
      drawIamge(context, imageData);
    }
  }, [width, height, drawIamge, imageData]);

  return <canvas ref={ref} width={width} height={height} />;
}

export default Canvas;
