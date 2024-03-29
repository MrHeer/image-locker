import { Center } from "@chakra-ui/react";
import { useMeasure } from "react-use";
import { useSignals } from "@preact/signals-react/runtime";
import Upload from "./Upload";
import Canvas from "./Canvas";
import { showCanvas } from "../signal";

function Stage() {
  useSignals();
  const [ref, { width, height }] = useMeasure();

  return (
    <Center
      ref={(element) => {
        if (element) ref(element);
      }}
      h="full"
    >
      {showCanvas.value ? (
        <Canvas width={Math.round(width)} height={Math.round(height)} />
      ) : (
        <Upload />
      )}
    </Center>
  );
}

export default Stage;
