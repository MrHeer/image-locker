import { Center, HStack, useToast } from '@chakra-ui/react';
import {
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  LockIcon,
  UnlockIcon,
} from '@chakra-ui/icons';
import { useSignals } from '@preact/signals-react/runtime';
import { actionDisabeledSignal } from '../signal';
import {
  clearAction,
  copyAction,
  downloadAction,
  filterAction,
  lockAction,
  unlockAction,
} from '../actions';
import { grayscale, invert, sepia, none } from '../filters';
import { ActionButton } from './action-button';
import { FilterButton } from './filter-button';
import { PasswordButton } from './password-button';

export function Actions(): JSX.Element {
  useSignals();
  const disabled = actionDisabeledSignal.value;
  const toast = useToast();

  return (
    <Center>
      <HStack spacing={4}>
        <ActionButton
          isDisabled={disabled}
          icon={<DeleteIcon />}
          action={clearAction}
        >
          Clear
        </ActionButton>
        <FilterButton
          isDisabled={disabled}
          icon={<EditIcon />}
          onGrayscale={() => {
            filterAction(grayscale);
          }}
          onInvert={() => {
            filterAction(invert);
          }}
          onSepia={() => {
            filterAction(sepia);
          }}
          onNone={() => {
            filterAction(none);
          }}
        >
          Filter
        </FilterButton>
        <ActionButton
          isDisabled={disabled}
          icon={<DownloadIcon />}
          action={downloadAction}
        >
          Download
        </ActionButton>
        <ActionButton
          isDisabled={disabled}
          icon={<CopyIcon />}
          action={async () => {
            try {
              await copyAction();
              toast({ status: 'success', title: 'Copied' });
            } catch (error) {
              toast({ status: 'error', title: (error as Error).message });
            }
          }}
        >
          Copy Base64
        </ActionButton>
        <PasswordButton
          id="lock"
          isDisabled={disabled}
          icon={<LockIcon />}
          formHelpText="Enter the password you'd like to unlock the image."
          action={async (password) => {
            try {
              await lockAction(password);
            } catch (error) {
              toast({ status: 'error', title: (error as Error).message });
            }
          }}
        >
          Lock
        </PasswordButton>
        <PasswordButton
          id="unlock"
          isDisabled={disabled}
          icon={<UnlockIcon />}
          formHelpText="Enter the password to unlock the image."
          action={async (password) => {
            try {
              await unlockAction(password);
            } catch (error) {
              toast({ status: 'error', title: (error as Error).message });
            }
          }}
        >
          Unlock
        </PasswordButton>
      </HStack>
    </Center>
  );
}
