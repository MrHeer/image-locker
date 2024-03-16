import { useBreakpointValue } from "@chakra-ui/react";

export const useIsMobile = () => {
  return useBreakpointValue({ lg: false, base: true }) ?? false;
};
