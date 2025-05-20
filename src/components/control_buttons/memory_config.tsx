import { Button, NumberInput } from "@heroui/react";
import { MemoryIcon } from "../../utils/icons";
import { useState } from "react";

interface Props {
  updateMemory: (totalMemory: number) => void;
  initialMemory: number;
}

export default function MemoryConfig({ updateMemory, initialMemory }: Props) {
  const [memory, setMemory] = useState(initialMemory);

  return (
    <>
      <NumberInput
        label="Total disponible"
        placeholder="Memoria disponible"
        endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">(MBs)</span>
          </div>
        }
        min={1}
        value={memory}
        onValueChange={setMemory}
        variant="bordered"
      />
      <Button
        startContent={<MemoryIcon className="size-5" />}
        onPress={() => updateMemory(memory)}
      >
        Aplicar Memoria
      </Button>
    </>
  );
}
