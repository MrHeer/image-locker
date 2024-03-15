import { Button, ButtonProps } from "@chakra-ui/react";
import { useState } from "react";

type Props = Omit<ButtonProps, "onClick" | "isLoading"> & {
  action: () => Promise<void>;
};

function ActionButton({ action, ...rest }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      isLoading={loading}
      onClick={async () => {
        setLoading(true);
        await action();
        setLoading(false);
      }}
      {...rest}
    />
  );
}

export default ActionButton;
