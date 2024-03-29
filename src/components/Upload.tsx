import { useCallback, useLayoutEffect } from "react";
import { useDropArea } from "react-use";
import { Center, useToast } from "@chakra-ui/react";
import { blobToImageData, upload } from "../lib";
import { imageState } from "../signal";
import { SUPPORTED_IMAGE_TYPE } from "../constant";

const handleImage = async (file: File) => {
  const { name, type } = file;
  const data = await blobToImageData(file);
  imageState.value = { name, type, data };
};

const dropHandler = async (files: File[]) => {
  if (files.length !== 1) {
    throw new Error("Only 1 file allowed.");
  }

  const file = files[0];
  console.log(file.type);
  if (file.type !== SUPPORTED_IMAGE_TYPE) {
    throw new Error("Only PNG file allowed.");
  }

  await handleImage(file);
};

function Upload() {
  const toast = useToast();

  const toastMessage = () => {
    toast({ status: "warning", title: "Please drop a PNG file." });
  };

  const [bond, { over }] = useDropArea({
    onFiles: async (files) => {
      try {
        await dropHandler(files);
      } catch (error) {
        toast({ status: "warning", title: (error as Error).message });
      }
    },
    onUri: toastMessage,
    onText: toastMessage,
  });

  useLayoutEffect(() => {
    if (over) {
      document.body.classList.add("droppable");
    } else {
      document.body.classList.remove("droppable");
    }
  }, [over]);

  const handleUpload = useCallback(async () => {
    try {
      const image = await upload(SUPPORTED_IMAGE_TYPE);
      await handleImage(image);
    } catch (error) {
      toast({ status: "error", title: (error as Error).message });
    }
  }, [toast]);

  return (
    <Center
      w={64}
      h={24}
      transition="all 250ms"
      border="solid 1px"
      color={over ? "blue.400" : "gray.500"}
      borderColor={over ? "blue.400" : "gray.500"}
      _hover={{ borderColor: "blue.400", color: "blue.400", cursor: "pointer" }}
      borderRadius="xl"
      onClick={handleUpload}
      {...bond}
    >
      Click or drop to upload image
    </Center>
  );
}

export default Upload;
