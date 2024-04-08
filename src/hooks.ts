import { useBreakpointValue } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

function useIsMobile(): boolean {
  return useBreakpointValue({ lg: false, base: true }) ?? false;
}

interface UseRunAsyncOptions {
  pre?: () => void;
  post?: () => void;
  onError?: (err: unknown) => void;
}

type UserRunAsyncReturn = [boolean, (asyncFn: () => Promise<void>) => void];

function useRunAsync(options?: UseRunAsyncOptions): UserRunAsyncReturn {
  const [loading, setLoading] = useState(false);
  const runAsync = useCallback(
    (asyncFn: () => Promise<void>) => {
      const fn = async (): Promise<void> => {
        setLoading(true);
        options?.pre?.();
        try {
          await asyncFn();
        } catch (error) {
          options?.onError?.(error);
        }
        options?.post?.();
        setLoading(false);
      };
      return fn();
    },
    [options],
  );
  return [loading, runAsync] as const;
}

export { useIsMobile, useRunAsync };
