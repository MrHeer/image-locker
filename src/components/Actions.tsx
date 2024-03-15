import { Center, HStack, useToast } from "@chakra-ui/react";
import {
  CopyIcon,
  DownloadIcon,
  EditIcon,
  LockIcon,
  UnlockIcon,
} from "@chakra-ui/icons";
import { useSignals } from "@preact/signals-react/runtime";
import { actionDisabeled } from "../signal";
import {
  compressAction,
  copyAction,
  downloadAction,
  grayscaleAction,
  restoreAction,
} from "../actions";
import ActionButton from "./ActionButton";

function Action() {
  useSignals();
  const disabled = actionDisabeled.value;
  const toast = useToast();

  return (
    <Center>
      <HStack>
        <ActionButton
          isDisabled={disabled}
          leftIcon={<EditIcon />}
          action={grayscaleAction}
        >
          Grayscale
        </ActionButton>
        <ActionButton
          isDisabled={disabled}
          leftIcon={<DownloadIcon />}
          action={downloadAction}
        >
          Download
        </ActionButton>
        <ActionButton
          isDisabled={disabled}
          leftIcon={<CopyIcon />}
          action={async () => {
            await copyAction();
            toast({ status: "success", title: "Copied" });
          }}
        >
          Copy Base64
        </ActionButton>
        <ActionButton
          isDisabled={disabled}
          leftIcon={<LockIcon />}
          action={compressAction}
        >
          Compress
        </ActionButton>
        <ActionButton
          leftIcon={<UnlockIcon />}
          action={async () => {
            try {
              await restoreAction();
            } catch (error) {
              toast({ status: "error", title: (error as Error).message });
            }
          }}
        >
          Restore
        </ActionButton>
      </HStack>
    </Center>
  );
}

export default Action;
