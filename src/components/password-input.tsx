import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Input,
  InputGroup,
  type InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import { useState, type ForwardedRef, forwardRef, useCallback } from 'react';

type Props = Omit<InputProps, 'type'>;

function InnerPasswordInput(
  props: Props,
  ref: ForwardedRef<HTMLInputElement>,
): JSX.Element {
  const [show, setShow] = useState(false);
  const handleClick = useCallback(() => {
    setShow((prev) => !prev);
  }, []);

  return (
    <InputGroup>
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
        {...props}
      />
      <InputRightElement>
        <IconButton
          aria-label={show ? 'hidden password' : 'show password'}
          size="xs"
          variant="ghost"
          onClick={handleClick}
          icon={show ? <ViewOffIcon /> : <ViewIcon />}
        />
      </InputRightElement>
    </InputGroup>
  );
}

export const PasswordInput = forwardRef(InnerPasswordInput);
