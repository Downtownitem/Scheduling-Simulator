import {
  Button,
  Divider,
  Input,
  NumberInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@heroui/react";
import { EditIcon } from "../../utils/icons";
import { useEffect, useState } from "react";
import { ProcessInterface } from "../../logic/processes";

interface Props {
  editProcess: (
    pid: number,
    updates: {
      name?: string;
      executionTime?: number;
      memoryRequired?: number;
      timeout?: number;
    }
  ) => void;
  processes: ProcessInterface[];
}

export default function EditButton({ processes, editProcess }: Props) {
  const [selectedProcessId, setSelectedProcessId] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editMemory, setEditMemory] = useState<number>(100);
  const [editExecutionTime, setEditExecutionTime] = useState<number>(7);
  const [editTimeout, setEditTimeout] = useState<number>(0);

  useEffect(() => {
    if (processes.length > 0) {
      setSelectedProcessId(processes[0].pid.toString());
    }
  }, [processes]);

  useEffect(() => {
    const process = processes.find((p) => p.pid === Number(selectedProcessId));
    if (process) {
      setEditName(process.name);
      setEditMemory(process.memoryRequired);
      setEditExecutionTime(process.executionTime);
      setEditTimeout(process.timeout);
    }
  }, [selectedProcessId]);

  return (
    <Popover placement="bottom" radius="lg">
      <PopoverTrigger>
        <Button
          color="warning"
          startContent={<EditIcon className="size-5" />}
          isDisabled={processes.length === 0}
        >
          Editar
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-2 py-3 w-full">
          <p className="font-semibold text-foreground">Editar proceso</p>
          <div className="mt-2">
            <Select
              label="Proceso a editar"
              placeholder="Seleccionar proceso"
              items={processes}
              selectedKeys={[selectedProcessId]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string;
                if (key) setSelectedProcessId(key);
              }}
              variant="bordered"
            >
              {(process) => (
                <SelectItem key={process.pid} textValue={process.name}>
                  {process.name}
                </SelectItem>
              )}
            </Select>
            <Divider className="my-3" />
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                label="Nombre"
                value={editName}
                onValueChange={setEditName}
                variant="bordered"
              />
              <NumberInput
                type="number"
                label="Tiempo de Ejecución"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">(cls)</span>
                  </div>
                }
                min={1}
                value={editExecutionTime}
                onValueChange={setEditExecutionTime}
                variant="bordered"
              />
              <NumberInput
                type="number"
                label="Memoria"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">(mbs)</span>
                  </div>
                }
                min={1}
                value={editMemory}
                onValueChange={setEditMemory}
                variant="bordered"
              />
              <NumberInput
                type="number"
                label="Timeout"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">(cls)</span>
                  </div>
                }
                min={0}
                value={editTimeout}
                onValueChange={setEditTimeout}
                variant="bordered"
              />
            </div>
          </div>
          <Divider className="my-3" />
          <div className="flex gap-2">
            <Button
              onPress={() => {
                if (selectedProcessId) {
                  editProcess(Number(selectedProcessId), {
                    name: editName,
                    executionTime: editExecutionTime,
                    memoryRequired: editMemory,
                    timeout: editTimeout,
                  });
                  setSelectedProcessId("");
                }
              }}
              color="warning"
              startContent={<EditIcon className="size-5" />}
              isDisabled={!selectedProcessId || !editName}
              fullWidth
            >
              Actualizar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
