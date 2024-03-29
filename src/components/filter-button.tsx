import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { Button, ButtonProps } from "./button";

type Props = ButtonProps & {
  onGrayscale: () => void;
  onInvert: () => void;
  onSepia: () => void;
};

function FilterButton({ onGrayscale, onInvert, onSepia, ...rest }: Props) {
  return (
    <Menu>
      <MenuButton as={Button} {...rest} />
      <MenuList>
        <MenuItem onClick={onGrayscale}>Grayscale</MenuItem>
        <MenuItem onClick={onInvert}>Invert</MenuItem>
        <MenuItem onClick={onSepia}>Speia</MenuItem>
      </MenuList>
    </Menu>
  );
}

export default FilterButton;
