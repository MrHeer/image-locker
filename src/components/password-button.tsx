import {
  useState,
  useRef,
  type MutableRefObject,
  type ReactNode,
  useCallback,
} from 'react';
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
import { validators } from '../lib';
import { useRunAsync } from '../hooks';
import { PasswordInput } from './password-input';
import { Button, type ButtonProps } from './button';

interface PasswordFormProps {
  id: string;
  firstFieldRef: MutableRefObject<HTMLInputElement | null>;
  onOk: (password: string) => void;
  helpText?: ReactNode;
}

function PasswordForm({
  id,
  firstFieldRef,
  onOk,
  helpText,
}: PasswordFormProps): JSX.Element {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const isError = errorMessage !== null;

  const inputId = `${id}-password`;

  const checkPassword = useCallback(() => {
    try {
      const password = firstFieldRef.current?.value ?? '';
      const validatedPassword = validators
        .string()
        .isRequired('Password is required.')
        .min(6, 'Password must be at least 6 characters.')
        .regex(
          /^[A-Za-z0-9]+$/,
          'Password must contain only letters and numbers.',
        )
        .validate(password);
      setErrorMessage(null);
      return validatedPassword;
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
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
          helpText && <FormHelperText>{helpText}</FormHelperText>
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
  formHelpText?: ReactNode;
};

export function PasswordButton({
  id,
  action,
  formHelpText,
  ...buttonProps
}: PasswordButtonProps): JSX.Element {
  const firstFieldRef = useRef(null);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [loading, runAsync] = useRunAsync({
    pre: () => {
      onClose();
    },
  });

  const handleSubmit = useCallback(
    (password: string) => {
      runAsync(() => action(password));
    },
    [action, runAsync],
  );

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={firstFieldRef}
      onOpen={onOpen}
      onClose={onClose}
      isLazy
    >
      <PopoverTrigger>
        <Button isLoading={loading} {...buttonProps} />
      </PopoverTrigger>
      <PopoverContent p={5} w={380}>
        <FocusLock>
          <PopoverArrow />
          <PopoverCloseButton />
          <PasswordForm
            id={id}
            firstFieldRef={firstFieldRef}
            onOk={handleSubmit}
            helpText={formHelpText}
          />
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
}
