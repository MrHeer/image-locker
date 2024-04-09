import { Center } from '@chakra-ui/react';
import { useMeasure } from 'react-use';
import { useSignals } from '@preact/signals-react/runtime';
import { AnimatePresence, motion } from 'framer-motion';
import { imageDataSignal } from '../signal';
import { Upload } from './upload';
import { SpreadCanvas } from './canvas';

function ScaleFade({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <motion.div
      style={{ position: 'absolute' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', bounce: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function Stage(): JSX.Element {
  useSignals();
  const [ref, { width, height }] = useMeasure();
  const imageData = imageDataSignal.value;

  return (
    <Center
      ref={(element) => {
        if (element) ref(element);
      }}
      h="full"
    >
      <AnimatePresence>
        {imageData ? (
          <ScaleFade key="canvas">
            <SpreadCanvas
              width={Math.round(width)}
              height={Math.round(height)}
              imageData={imageData}
            />
          </ScaleFade>
        ) : (
          <ScaleFade key="upload">
            <Upload />
          </ScaleFade>
        )}
      </AnimatePresence>
    </Center>
  );
}
