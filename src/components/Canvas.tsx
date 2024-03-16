import { useCallback, useRef } from "react";
import { useAsync } from "react-use";
import { useSignals } from "@preact/signals-react/runtime";
import { imageData } from "../signal";

function Canvas({ width, height }: { width: number; height: number }) {
  useSignals();
  const ref = useRef<HTMLCanvasElement>(null);
  const data = imageData.value;

  const drawIamge = useCallback(
    async (context: CanvasRenderingContext2D, imageData: ImageData) => {
      const bitmap = await createImageBitmap(imageData);
      context.clearRect(0, 0, width, height);
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
      context.drawImage(bitmap, 0, 0);
      context.restore();
    },
    [height, width],
  );

  useAsync(async () => {
    const context = ref.current?.getContext("2d");
    if (context && data) {
      await drawIamge(context, data);
    }
  }, [width, height, drawIamge, data]);

  return <canvas ref={ref} width={width} height={height} />;
}

export default Canvas;
