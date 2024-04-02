import { useCallback, useState } from 'react';
import { Button, type ButtonProps } from './button';

type Props = {
  action?: () => Promise<void> | void;
} & ButtonProps;

export function ActionButton({ action, ...rest }: Props): JSX.Element {
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    const promise = action?.();
    if (promise instanceof Promise) {
      setLoading(true);
      void promise.finally(() => {
        setLoading(false);
      });
    }
  }, [action]);

  return <Button onClick={handleClick} isLoading={loading} {...rest} />;
}
