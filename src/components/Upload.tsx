import { useDropArea } from "react-use";
import { Center, useToast } from "@chakra-ui/react";
import { IMAGE_TYPE, convertImageToImageData, uploadImage } from "../utils";
import { imageState } from "../signal";

const handleImage = async (file: File) => {
  const imageData = await convertImageToImageData(file);
  imageState.value = imageData;
};

const dropHandler = (files: File[]) => {
  if (files.length !== 1) {
    throw new Error("Only 1 file allowed");
  }

  const file = files[0];
  if (file.type !== IMAGE_TYPE) {
    throw new Error("Only PNG file allowed");
  }
  handleImage(file);
};

function Upload() {
  const toast = useToast();

  const toastMessage = () => {
    toast({ status: "warning", title: "Please drop a PNG file." });
  };

  const [bond, state] = useDropArea({
    onFiles: (files) => {
      try {
        dropHandler(files);
      } catch (error) {
        toast({ status: "warning", title: (error as Error).message });
      }
    },
    onUri: toastMessage,
    onText: toastMessage,
  });

  if (state.over) {
    document.body.classList.add("droppable");
  } else {
    document.body.classList.remove("droppable");
  }

  return (
    <Center
      w={64}
      h={24}
      transition="all 250ms"
      border="solid 1px"
      color={state.over ? "blue.400" : "gray.500"}
      borderColor={state.over ? "blue.400" : "gray.500"}
      _hover={{ borderColor: "blue.400", color: "blue.400", cursor: "pointer" }}
      borderRadius="xl"
      onClick={async () => {
        try {
          const image = await uploadImage();
          handleImage(image);
        } catch (error) {
          toast({ status: "error", title: (error as Error).message });
        }
      }}
      {...bond}
    >
      Click or drop to upload PNG
    </Center>
  );
}

export default Upload;
