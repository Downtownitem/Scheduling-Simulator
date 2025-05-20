import {
  Button,
  Divider,
  Input,
  NumberInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { CreateIcon } from "../../utils/icons";
import { useState } from "react";

interface Props {
  createProcess: (
    name: string,
    executionTime: number,
    memoryRequired: number,
    timeout: number
  ) => void;
}

export default function CreateButton({ createProcess }: Props) {
  const [processName, setProcessName] = useState<string>("");
  const [processMemory, setProcessMemory] = useState<number>(100);
  const [executionTime, setExecutionTime] = useState<number>(7);
  const [processTimeout, setProcessTimeout] = useState<number>(0);

  return (
    <Popover placement="bottom" radius="lg">
      <PopoverTrigger>
        <Button
          color="primary"
          startContent={<CreateIcon className="size-5" />}
        >
          Crear
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-2 py-3 w-full">
          <p className="font-semibold text-foreground">Crear proceso</p>
          <div className="mt-2 flex flex-col gap-2 w-full">
            <Input
              type="text"
              label="Nombre"
              placeholder="Abrir archivo.txt"
              value={processName}
              onValueChange={setProcessName}
              variant="bordered"
            />
            <NumberInput
              type="number"
              label="Tiempo de Ejecución"
              placeholder="Ciclos de CPU"
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">(cls)</span>
                </div>
              }
              min={1}
              value={executionTime}
              onValueChange={setExecutionTime}
              variant="bordered"
            />
            <NumberInput
              type="number"
              label="Memoria"
              placeholder="Cantidad de memoria"
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">(mbs)</span>
                </div>
              }
              min={1}
              value={processMemory}
              onValueChange={setProcessMemory}
              variant="bordered"
            />
            <NumberInput
              type="number"
              label="Timeout"
              placeholder="Ciclos de CPU"
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">(cls)</span>
                </div>
              }
              min={0}
              value={processTimeout}
              onValueChange={setProcessTimeout}
              variant="bordered"
            />
          </div>
          <Divider className="my-3" />
          <div>
            <Button
              onPress={() => {
                createProcess(
                  processName,
                  Number(executionTime),
                  Number(processMemory),
                  Number(processTimeout || 0)
                );
                setProcessName("");
              }}
              color="primary"
              startContent={<CreateIcon className="size-5" />}
              isDisabled={!processName || !processMemory || !executionTime}
              fullWidth
            >
              Crear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
