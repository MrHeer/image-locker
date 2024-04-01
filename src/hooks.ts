import { useBreakpointValue } from '@chakra-ui/react';

export function useIsMobile(): boolean {
  return useBreakpointValue({ lg: false, base: true }) ?? false;
}
