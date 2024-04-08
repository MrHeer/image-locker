import { useCallback } from 'react';
import { useRunAsync } from '../hooks';
import { Button, type ButtonProps } from './button';

type Props = {
  action?: () => Promise<void> | void;
} & ButtonProps;

export function ActionButton({ action, ...rest }: Props): JSX.Element {
  const [loading, runAsync] = useRunAsync();

  const handleClick = useCallback(() => {
    const promise = action?.();
    if (promise instanceof Promise) {
      runAsync(() => promise);
    }
  }, [action, runAsync]);

  return <Button onClick={handleClick} isLoading={loading} {...rest} />;
}
