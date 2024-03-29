import { useState, useRef, MutableRefObject, useCallback } from "react";
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
} from "@chakra-ui/react";
import { useDebounceCallback } from "usehooks-ts";
import PasswordInput from "./password-input";
import { Button, ButtonProps } from "./button";

function passwordChecker(password: string) {
  if (password.length === 0) {
    throw new Error("Password is required.");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
  const regex = new RegExp("^[A-Za-z0-9]+$");
  if (regex.test(password) === false) {
    throw new Error("Password must contain only letters and numbers.");
  }
}

type PasswordFormProps = {
  id: string;
  firstFieldRef: MutableRefObject<HTMLInputElement>;
  onOk: (password: string) => void;
};

const PasswordForm = ({ id, firstFieldRef, onOk }: PasswordFormProps) => {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const isError = errorMessage !== null;

  const inputId = `${id}-password`;

  const checkPassword = useCallback(() => {
    const password = firstFieldRef?.current?.value ?? "";
    try {
      passwordChecker(password);
    } catch (error) {
      setErrorMessage((error as Error).message);
      return;
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
            Enter the password you'd like to unlock the image.
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
};

type PasswordButtonProps = ButtonProps & {
  id: string;
  action: (password: string) => Promise<void>;
};

const PasswordButton = ({
  id,
  action,
  ...buttonProps
}: PasswordButtonProps) => {
  const firstFieldRef = useRef(null!);
  const [loading, setLoading] = useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleSubmit = useCallback(
    async (password: string) => {
      onClose();
      setLoading(true);
      await action(password);
      setLoading(false);
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
};

export default PasswordButton;
