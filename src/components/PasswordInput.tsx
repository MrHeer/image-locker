import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { useState, ForwardedRef, forwardRef } from "react";

type Props = Omit<InputProps, "type">;

const PasswordInput = forwardRef(
  (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow((show) => !show);

    return (
      <InputGroup>
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          placeholder="Enter password"
          {...props}
        />
        <InputRightElement>
          <IconButton
            aria-label={show ? "hidden password" : "show password"}
            size="xs"
            variant="ghost"
            onClick={handleClick}
            icon={show ? <ViewOffIcon /> : <ViewIcon />}
          />
        </InputRightElement>
      </InputGroup>
    );
  },
);

export default PasswordInput;
