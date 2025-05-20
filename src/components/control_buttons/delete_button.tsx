import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@heroui/react";
import { DeleteIcon } from "../../utils/icons";
import { ProcessInterface } from "../../logic/processes";
import { useEffect, useState } from "react";

interface Props {
  deleteProcess: (pid: number) => void;
  processes: ProcessInterface[];
}

export default function DeleteButton({ deleteProcess, processes }: Props) {
  const [selectedProcess, setSelectedProcess] = useState<string>("");

  useEffect(() => {
    if (processes.length > 0) {
      setSelectedProcess(processes[0].pid.toString());
    }
  }, [processes]);

  return (
    <Popover placement="bottom" radius="lg">
      <PopoverTrigger>
        <Button
          color="danger"
          startContent={<DeleteIcon className="size-5" />}
          isDisabled={processes.length === 0}
        >
          Eliminar
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-2 py-3 w-full">
          <p className="font-semibold text-foreground">Eliminar proceso</p>
          <div className="mt-2 flex flex-col gap-2 w-full min-w-48">
            <Select
              label="Proceso a eliminar"
              items={processes}
              placeholder="Seleccionar proceso"
              variant="bordered"
              selectedKeys={[selectedProcess]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string;
                if (key) setSelectedProcess(key);
              }}
            >
              {(process) => (
                <SelectItem key={process.pid} textValue={process.name}>
                  {process.name}
                </SelectItem>
              )}
            </Select>
          </div>
          <Divider className="my-3" />
          <Button
            color="danger"
            startContent={<DeleteIcon className="size-5" />}
            onPress={() => {
              if (selectedProcess) deleteProcess(parseInt(selectedProcess));
            }}
            isDisabled={processes.length === 0}
            fullWidth
          >
            Eliminar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
