import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  NumberInput,
} from "@heroui/react";
import {
  ComandLineIcon,
  CreateIcon,
  RandomIcon,
  SettingsIcon,
  SubmitIcon,
} from "../utils/icons";
import { useState } from "react";

interface ActionsParams {
  createProcess: (
    name: string,
    executionTime: number,
    memoryRequired: number,
    timeout: number
  ) => void;
  updateQuantum: (quantum: number) => void;
}

export default function Actions({
  createProcess,
  updateQuantum,
}: ActionsParams) {
  const [processName, setProcessName] = useState<string>("");
  const [processMemory, setProcessMemory] = useState<number>(100);
  const [executionTime, setExecutionTime] = useState<number>(7);
  const [processTimeout, setProcessTimeout] = useState<number>(0);
  const [quantumValue, setQuantumValue] = useState<number>(1);

  return (
    <Card className="row-span-2 flex flex-col gap-5 p-5">
      <CardHeader className="flex items-center gap-2 p-0 text-black/40">
        <ComandLineIcon className="size-5" />
        <h2 className="font-medium">Acciones</h2>
      </CardHeader>
      <CardBody className="p-0">
        <div className="flex gap-2">
          <Popover placement="bottom" radius="lg">
            <PopoverTrigger>
              <Button
                color="primary"
                startContent={<CreateIcon className="size-5" />}
              >
                Crear Proceso
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-2 py-3 w-full">
                <p className=" font-semibold text-foreground">Crear proceso</p>
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
                        <span className="text-default-400 text-small">
                          (cls)
                        </span>
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
                        <span className="text-default-400 text-small">
                          (mbs)
                        </span>
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
                        <span className="text-default-400 text-small">
                          (cls)
                        </span>
                      </div>
                    }
                    min={0}
                    value={processTimeout}
                    onValueChange={setProcessTimeout}
                    variant="bordered"
                  />
                </div>
                <Divider className="my-3" />
                <div className="flex gap-2">
                  <Button
                    onPress={() =>
                      createProcess(
                        processName,
                        Number(executionTime),
                        Number(processMemory),
                        Number(processTimeout || 0)
                      )
                    }
                    color="primary"
                    startContent={<CreateIcon className="size-5" />}
                    isDisabled={
                      !processName || !processMemory || !executionTime
                    }
                  >
                    Crear
                  </Button>
                  <Button
                    onPress={() =>
                      createProcess(
                        "Aleatorio",
                        Math.floor(Math.random() * 20),
                        Math.floor(Math.random() * 100),
                        Math.floor(Math.random() * 5)
                      )
                    }
                    color="default"
                    startContent={<RandomIcon className="size-5" />}
                  >
                    Crear Aleatorio
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                color="secondary"
                startContent={<SettingsIcon className="size-5" />}
              >
                Configuración
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="px-2 py-3 w-full">
                <p className=" font-semibold text-foreground">Configuración</p>
                <div className="mt-2 flex flex-col gap-2 w-full">
                  <NumberInput
                    type="number"
                    label="Quantum de tiempo"
                    placeholder="1"
                    value={quantumValue}
                    onValueChange={setQuantumValue}
                    variant="bordered"
                    min="1"
                  />
                </div>
                <Divider className="my-3" />
                <div className="flex gap-2">
                  <Button
                    onPress={() => updateQuantum(Number(quantumValue))}
                    color="secondary"
                    fullWidth
                    startContent={<SubmitIcon className="size-5" />}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardBody>
    </Card>
  );
}
