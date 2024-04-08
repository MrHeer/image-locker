import { useCallback, useLayoutEffect } from 'react';
import { useDropArea } from 'react-use';
import { Center, useToast } from '@chakra-ui/react';
import { uploadAction } from '../actions';
import { upload } from '../lib';
import { SUPPORTED_IMAGE_TYPE } from '../constant';

async function dropFileHandler(files: File[]): Promise<void> {
  if (files.length !== 1) {
    throw new Error('Only 1 file allowed.');
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Checked above
  const file = files[0]!;
  if (file.type !== SUPPORTED_IMAGE_TYPE) {
    throw new Error('Only PNG file allowed.');
  }

  await uploadAction(file);
}

async function dropUriHandler(uri: string): Promise<void> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const { type } = blob;
  if (type !== SUPPORTED_IMAGE_TYPE) {
    throw new Error('Only PNG file allowed.');
  }

  const file = new File([blob], 'image.png', { type });
  await uploadAction(file);
}

export function Upload(): JSX.Element {
  const toast = useToast();

  const toastError = useCallback(
    (message: string): void => {
      toast({ status: 'error', title: message });
    },
    [toast],
  );

  const [bond, { over }] = useDropArea({
    onFiles: (files) => {
      dropFileHandler(files).catch((error) => {
        toastError((error as Error).message);
      });
    },
    onUri: (uri) => {
      dropUriHandler(uri).catch((error) => {
        toastError((error as Error).message);
      });
    },
    onText: (): void => {
      toastError('Please drop a PNG file.');
    },
  });

  useLayoutEffect(() => {
    if (over) {
      document.body.classList.add('droppable');
    } else {
      document.body.classList.remove('droppable');
    }
  }, [over]);

  const handleUpload = useCallback(() => {
    void upload(SUPPORTED_IMAGE_TYPE)
      .then(uploadAction)
      .catch((error) => {
        toast({ status: 'error', title: (error as Error).message });
      });
  }, [toast]);

  return (
    <Center
      w={64}
      h={24}
      transition="all 250ms"
      border="solid 1px"
      color={over ? 'blue.400' : 'gray.500'}
      borderColor={over ? 'blue.400' : 'gray.500'}
      _hover={{ borderColor: 'blue.400', color: 'blue.400', cursor: 'pointer' }}
      borderRadius="xl"
      onClick={handleUpload}
      {...bond}
    >
      Click or drop to upload image
    </Center>
  );
}
