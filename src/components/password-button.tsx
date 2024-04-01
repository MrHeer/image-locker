import { useState, useRef, type MutableRefObject, useCallback } from 'react';
import {
  Button as ChakraButton,
  ButtonGroup,
  FocusLock,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useDebounceCallback } from 'usehooks-ts';
import { PasswordInput } from './password-input';
import { Button, type ButtonProps } from './button';

function passwordChecker(password: string): void {
  if (password.length === 0) {
    throw new Error('Password is required.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
  const regex = /^[A-Za-z0-9]+$/;
  if (!regex.test(password)) {
    throw new Error('Password must contain only letters and numbers.');
  }
}

interface PasswordFormProps {
  id: string;
  firstFieldRef: MutableRefObject<HTMLInputElement | null>;
  onOk: (password: string) => void;
}

function PasswordForm({
  id,
  firstFieldRef,
  onOk,
}: PasswordFormProps): JSX.Element {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const isError = errorMessage !== null;

  const inputId = `${id}-password`;

  const checkPassword = useCallback(() => {
    const password = firstFieldRef.current?.value ?? '';
    try {
      passwordChecker(password);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
    setErrorMessage(null);
    return password;
  }, [firstFieldRef]);

  const debouncedCheckPassword = useDebounceCallback(checkPassword, 500, {
    leading: true,
  });

  return (
    <Stack spacing={4}>
      <FormControl isInvalid={isError}>
        <FormLabel htmlFor={inputId}>Password</FormLabel>
        <PasswordInput
          id={inputId}
          ref={firstFieldRef}
          onChange={debouncedCheckPassword}
        />
        {!isError ? (
          <FormHelperText>
            Enter the password you&apos;ad like to unlock the image.
          </FormHelperText>
        ) : (
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        )}
      </FormControl>
      <ButtonGroup display="flex" justifyContent="flex-end">
        <ChakraButton
          colorScheme="blue"
          size="sm"
          isDisabled={isError}
          onClick={() => {
            const password = debouncedCheckPassword();
            if (password) {
              onOk(password);
            }
          }}
        >
          Ok
        </ChakraButton>
      </ButtonGroup>
    </Stack>
  );
}

type PasswordButtonProps = ButtonProps & {
  id: string;
  action: (password: string) => Promise<void>;
};

export function PasswordButton({
  id,
  action,
  ...buttonProps
}: PasswordButtonProps): JSX.Element {
  const firstFieldRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleSubmit = useCallback(
    (password: string) => {
      onClose();
      setLoading(true);
      void action(password).finally(() => {
        setLoading(false);
      });
    },
    [action, onClose],
  );

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={firstFieldRef}
      onOpen={onOpen}
      onClose={onClose}
      closeOnBlur={false}
      isLazy
    >
      <PopoverTrigger>
        <Button isLoading={loading} {...buttonProps} />
      </PopoverTrigger>
      <PopoverContent p={5} w={380}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PasswordForm
            id={id}
            firstFieldRef={firstFieldRef}
            onOk={handleSubmit}
          />
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
}
