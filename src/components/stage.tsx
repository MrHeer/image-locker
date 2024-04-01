import { Center } from '@chakra-ui/react';
import { useMeasure } from 'react-use';
import { useSignals } from '@preact/signals-react/runtime';
import { showCanvasSignal } from '../signal';
import { Upload } from './upload';
import { Canvas } from './canvas';

export function Stage(): JSX.Element {
  useSignals();
  const [ref, { width, height }] = useMeasure();

  return (
    <Center
      ref={(element) => {
        if (element) ref(element);
      }}
      h="full"
    >
      {showCanvasSignal.value ? (
        <Canvas width={Math.round(width)} height={Math.round(height)} />
      ) : (
        <Upload />
      )}
    </Center>
  );
}
