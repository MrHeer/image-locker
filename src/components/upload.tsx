import { useCallback, useLayoutEffect } from 'react';
import { useDropArea } from 'react-use';
import { Button, useToast } from '@chakra-ui/react';
import { uploadAction } from '../actions';
import { upload } from '../lib';
import { SUPPORTED_IMAGE_TYPE } from '../constant';
import { useRunAsync } from '../hooks';

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
  const blob = await fetch(uri).then((res) => res.blob());
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

  const [loading, runAsync] = useRunAsync({
    onError: (error) => {
      toastError((error as Error).message);
    },
  });

  const [bond, { over }] = useDropArea({
    onFiles: (files) => {
      runAsync(() => dropFileHandler(files));
    },
    onUri: (uri) => {
      runAsync(() => dropUriHandler(uri));
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
    runAsync(() => upload(SUPPORTED_IMAGE_TYPE).then(uploadAction));
  }, [runAsync]);

  return (
    <Button
      w={64}
      h={24}
      variant="outline"
      colorScheme="cyan"
      onClick={handleUpload}
      isLoading={loading}
      {...bond}
    >
      Click or drop to upload image
    </Button>
  );
}
