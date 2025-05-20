import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { DeleteIcon, RebootIcon } from "../../utils/icons";
import { ProcessInterface } from "../../logic/processes";

interface Props {
  deleteProcess: (pid: number) => void;
  processes: ProcessInterface[];
}

export default function DeleteButton({ deleteProcess, processes }: Props) {
  return (
    <Popover placement="bottom" radius="lg">
      <PopoverTrigger>
        <Button
          color="danger"
          startContent={<RebootIcon className="size-5" />}
          isDisabled={processes.length === 0}
        >
          Reiniciar
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-2 py-3 w-full">
          <p className="font-semibold text-foreground">Borrar todos los procesos</p>
          <Button
            color="danger"
            className="mt-2"
            startContent={<DeleteIcon className="size-5" />}
            onPress={() => {
              for (let i = 0; i < processes.length; i++) {
                deleteProcess(processes[i].pid);
              }
            }}
            isDisabled={processes.length === 0}
            fullWidth
          >
            Eliminar todos
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
