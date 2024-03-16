import { Center, HStack, useToast } from "@chakra-ui/react";
import {
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { useSignals } from "@preact/signals-react/runtime";
import { actionDisabeled } from "../signal";
import {
  clearAction,
  copyAction,
  downloadAction,
  grayscaleAction,
  lockAction,
  unlockAction,
} from "../actions";
import ActionButton from "./ActionButton";

function Action() {
  useSignals();
  const disabled = actionDisabeled.value;
  const toast = useToast();

  return (
    <Center>
      <HStack spacing={4}>
        <ActionButton
          isDisabled={disabled}
          icon={<DeleteIcon />}
          action={clearAction}
          text="Clear"
        />
        <ActionButton
          isDisabled={disabled}
          icon={<EditIcon />}
          action={grayscaleAction}
          text="Grayscale"
        />
        <ActionButton
          isDisabled={disabled}
          icon={<DownloadIcon />}
          action={downloadAction}
          text="Download"
        />
        <ActionButton
          isDisabled={disabled}
          icon={<CopyIcon />}
          action={async () => {
            await copyAction();
            toast({ status: "success", title: "Copied" });
          }}
          text="Copy Base64"
        />
        <ActionButton
          isDisabled={disabled}
          icon={<LockIcon />}
          action={lockAction}
          text="Lock"
        />
        <ActionButton
          icon={<UnlockIcon />}
          action={async () => {
            try {
              await unlockAction();
            } catch (error) {
              toast({ status: "error", title: (error as Error).message });
            }
          }}
          text="Unlock"
        />
      </HStack>
    </Center>
  );
}

export default Action;
