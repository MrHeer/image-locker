import { type ForwardedRef, forwardRef, type ReactElement } from 'react';
import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
  IconButton,
} from '@chakra-ui/react';
import { useIsMobile } from '../hooks';

export type ButtonProps = ChakraButtonProps & {
  icon: ReactElement;
  children: string;
};

function InnerButton(
  { icon, children, ...rest }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
): JSX.Element {
  const isMobile = useIsMobile();
  return isMobile ? (
    <IconButton ref={ref} icon={icon} aria-label={children} {...rest} />
  ) : (
    <ChakraButton ref={ref} leftIcon={icon} {...rest}>
      {children}
    </ChakraButton>
  );
}

export const Button = forwardRef(InnerButton);
