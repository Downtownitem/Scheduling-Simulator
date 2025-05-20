import { Button } from "@heroui/react";
import { RandomIcon } from "../../utils/icons";

interface Props {
  createProcess: (
    name: string,
    executionTime: number,
    memoryRequired: number,
    timeout: number
  ) => void;
}

export default function RandomButton({ createProcess }: Props) {
  return (
    <Button
      onPress={() =>
        createProcess(
          `Proceso ${Math.floor(Math.random() * 1000)}`,
          Math.floor(Math.random() * 20) + 1,
          Math.floor(Math.random() * 100) + 1,
          Math.floor(Math.random() * 5)
        )
      }
      color="default"
      startContent={<RandomIcon className="size-5" />}
      variant="flat"
    >
      Aleatorio
    </Button>
  );
}
