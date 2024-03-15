import { Button, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { ReactElement, useState } from "react";

type Props = {
  icon: ReactElement;
  isDisabled?: boolean;
  text: string;
  action: () => Promise<void>;
};

function ActionButton({ icon, isDisabled, text, action }: Props) {
  const [loading, setLoading] = useState(false);
  const isMobile = useBreakpointValue({ lg: false, base: true });

  const handleClick = async () => {
    setLoading(true);
    await action();
    setLoading(false);
  };

  return isMobile ? (
    <IconButton
      aria-label={text}
      isLoading={loading}
      icon={icon}
      isDisabled={isDisabled}
      onClick={handleClick}
    />
  ) : (
    <Button
      isLoading={loading}
      leftIcon={icon}
      isDisabled={isDisabled}
      onClick={handleClick}
      children={text}
    />
  );
}

export default ActionButton;
