import { useCallback, useRef } from 'react';
import { useAsync } from 'react-use';
import { useSignals } from '@preact/signals-react/runtime';
import { imageDataSignal } from '../signal';

export function Canvas({
  width,
  height,
}: {
  width: number;
  height: number;
}): JSX.Element {
  useSignals();
  const ref = useRef<HTMLCanvasElement>(null);
  const imageData = imageDataSignal.value;

  const drawIamge = useCallback(
    async (context: CanvasRenderingContext2D, image: ImageData) => {
      const bitmap = await createImageBitmap(image);
      context.clearRect(0, 0, width, height);
      context.save();
      const canvasAspect = width / height;
      const imageAspect = image.width / image.height;
      if (canvasAspect > imageAspect) {
        const scale = height / image.height;
        context.translate(width / 2 - (image.width * scale) / 2, 0);
        context.scale(scale, scale);
      } else {
        const scale = width / image.width;
        context.translate(0, height / 2 - (image.height * scale) / 2);
        context.scale(scale, scale);
      }
      context.drawImage(bitmap, 0, 0);
      context.restore();
    },
    [height, width],
  );

  useAsync(async () => {
    const context = ref.current?.getContext('2d');
    if (context) {
      await drawIamge(context, imageData);
    }
  }, [width, height, drawIamge, imageData]);

  return <canvas ref={ref} width={width} height={height} />;
}
