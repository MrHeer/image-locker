import { useBreakpointValue } from '@chakra-ui/react';
import { useCallback, useState } from 'react';

function useIsMobile(): boolean {
  return useBreakpointValue({ lg: false, base: true }) ?? false;
}

interface UseRunAsyncOptions {
  pre?: () => void;
  post?: () => void;
  onError?: (error: unknown) => void;
  onFinally?: () => void;
}

type AsyncFn = () => Promise<void>;

type UseRunAsyncReturn = [boolean, (asyncFn: AsyncFn) => void];

function useRunAsync(options?: UseRunAsyncOptions): UseRunAsyncReturn {
  const [loading, setLoading] = useState(false);

  const runAsync = useCallback(
    (asyncFn: AsyncFn) => {
      const fn = async (): Promise<void> => {
        try {
          setLoading(true);
          options?.pre?.();
          await asyncFn();
          options?.post?.();
        } catch (error) {
          options?.onError?.(error);
        } finally {
          options?.onFinally?.();
          setLoading(false);
        }
      };
      return fn();
    },
    [options],
  );

  return [loading, runAsync] as const;
}

export { useIsMobile, useRunAsync };
