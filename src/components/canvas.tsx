import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useAsync, usePreviousDistinct } from 'react-use';

export function Canvas({
  width,
  height,
  imageData,
}: {
  width: number;
  height: number;
  imageData: ImageData;
}): JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null);

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
  }, [drawIamge, imageData]);

  return <canvas ref={ref} width={width} height={height} />;
}

export function SpreadCanvas({
  width,
  height,
  imageData,
}: {
  width: number;
  height: number;
  imageData: ImageData;
}): JSX.Element {
  const [motionKey, setMotionKey] = useState(0);
  const prevImageData = usePreviousDistinct(imageData);

  useLayoutEffect(() => {
    if (prevImageData) {
      setMotionKey((prevKey) => prevKey + 1);
    }
  }, [prevImageData]);

  return (
    <Box width={width} height={height}>
      <Box position="absolute">
        {prevImageData ? (
          <Canvas width={width} height={height} imageData={prevImageData} />
        ) : null}
      </Box>
      <motion.div
        key={motionKey}
        style={{
          position: 'absolute',
          backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'spring', bounce: 0 }}
      >
        <Canvas width={width} height={height} imageData={imageData} />
      </motion.div>
    </Box>
  );
}
