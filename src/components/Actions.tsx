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
  filterAction,
  lockAction,
  unlockAction,
} from "../actions";
import ActionButton from "./ActionButton";
import FilterButton from "./FilterButton";
import { grayscale, invert, sepia } from "../filters";

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
        >
          Clear
        </ActionButton>
        <FilterButton
          isDisabled={disabled}
          icon={<EditIcon />}
          onGrayscale={() => filterAction(grayscale)}
          onInvert={() => filterAction(invert)}
          onSepia={() => filterAction(sepia)}
        >
          Filter
        </FilterButton>
        <ActionButton
          isDisabled={disabled}
          icon={<DownloadIcon />}
          action={downloadAction}
        >
          Download
        </ActionButton>
        <ActionButton
          isDisabled={disabled}
          icon={<CopyIcon />}
          action={async () => {
            await copyAction();
            toast({ status: "success", title: "Copied" });
          }}
        >
          Copy Base64
        </ActionButton>
        <ActionButton
          isDisabled={disabled}
          icon={<LockIcon />}
          action={lockAction}
        >
          Lock
        </ActionButton>
        <ActionButton
          icon={<UnlockIcon />}
          action={async () => {
            try {
              await unlockAction();
            } catch (error) {
              toast({ status: "error", title: (error as Error).message });
            }
          }}
        >
          Unlock
        </ActionButton>
      </HStack>
    </Center>
  );
}

export default Action;
