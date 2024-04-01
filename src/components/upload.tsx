import { useCallback, useLayoutEffect } from 'react';
import { useDropArea } from 'react-use';
import { Center, useToast } from '@chakra-ui/react';
import { uploadAction } from '../actions';
import { upload } from '../lib';
import { SUPPORTED_IMAGE_TYPE } from '../constant';

async function dropHandler(files: File[]): Promise<void> {
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

export function Upload(): JSX.Element {
  const toast = useToast();

  const toastMessage = (): void => {
    toast({ status: 'warning', title: 'Please drop a PNG file.' });
  };

  const [bond, { over }] = useDropArea({
    onFiles: (files) => {
      dropHandler(files).catch((error) => {
        toast({ status: 'warning', title: (error as Error).message });
      });
    },
    onUri: toastMessage,
    onText: toastMessage,
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
