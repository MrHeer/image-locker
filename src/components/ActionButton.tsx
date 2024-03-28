import { useState } from "react";
import { Button, ButtonProps } from "./Button";

type Props = {
  action?: () => Promise<void>;
} & ButtonProps;

function ActionButton({ action, ...rest }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await action?.();
    setLoading(false);
  };

  return <Button onClick={handleClick} isLoading={loading} {...rest} />;
}

export default ActionButton;
