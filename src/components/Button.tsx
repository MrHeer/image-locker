import { ForwardedRef, forwardRef } from "react";
import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  IconButton,
} from "@chakra-ui/react";
import { ReactElement } from "react";
import { useIsMobile } from "../hooks";

export type ButtonProps = ChakraButtonProps & {
  icon: ReactElement;
  children: string;
};

function InnerButton(
  { icon, children, ...rest }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <IconButton ref={ref} icon={icon} aria-label={children} {...rest} />
  ) : (
    <ChakraButton ref={ref} leftIcon={icon} children={children} {...rest} />
  );
}

export const Button = forwardRef(InnerButton);
