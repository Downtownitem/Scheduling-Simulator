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
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  ComandLineIcon,
  CreateIcon,
  RandomIcon,
  SettingsIcon,
  SubmitIcon,
  EditIcon,
  DeleteIcon,
} from "../utils/icons";
import { useState } from "react";

// Algoritmos de scheduling disponibles
const schedulingAlgorithms = [
  { key: "round-robin", label: "Round Robin", needsQuantum: true },
  { key: "fcfs", label: "F.C.F.S.", needsQuantum: false },
  { key: "sjf", label: "Shortest Job First", needsQuantum: false },
  { key: "priority", label: "Priority Scheduling", needsQuantum: false },
  { key: "srtf", label: "S.R.T.F.", needsQuantum: true },
  { key: "multilevel", label: "Multilevel Queue", needsQuantum: true },
];

interface ProcessControlsParams {
  // Propiedades del sistema operativo
  os: {
    timeQuantum: number;
    algorithm: string;
  };

  // Funciones de proceso
  createProcess: (
    name: string,
    executionTime: number,
    memoryRequired: number,
    timeout: number
  ) => void;
  updateQuantum: (quantum: number) => void;
  updateAlgorithm: (algorithm: string) => void;
  editProcess: (
    processId: string,
    name: string,
    executionTime: number,
    memoryRequired: number,
    timeout: number
  ) => void;
  deleteProcess: (processId: string) => void;

  // Lista de procesos actuales
  processes: Array<{
    id: string;
    name: string;
    executionTime: number;
    memoryRequired: number;
    timeout: number;
  }>;
}

export default function ProcessControls({
  os,
  createProcess,
  updateQuantum,
  updateAlgorithm,
  editProcess,
  deleteProcess,
  processes,
}: ProcessControlsParams) {
  // Estados para crear proceso
  const [processName, setProcessName] = useState<string>("");
  const [processMemory, setProcessMemory] = useState<number>(100);
  const [executionTime, setExecutionTime] = useState<number>(7);
  const [processTimeout, setProcessTimeout] = useState<number>(0);

  // Estados para configuración
  const [quantumValue, setQuantumValue] = useState<number>(os.timeQuantum);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(
    os.algorithm
  );

  // Estados para editar proceso
  const [selectedProcessId, setSelectedProcessId] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editMemory, setEditMemory] = useState<number>(100);
  const [editExecutionTime, setEditExecutionTime] = useState<number>(7);
  const [editTimeout, setEditTimeout] = useState<number>(0);

  const currentAlgorithm = schedulingAlgorithms.find(
    (alg) => alg.key === os.algorithm
  );

  const handleEditProcess = (processId: string) => {
    const process = processes.find((p) => p.id === processId);
    if (process) {
      setSelectedProcessId(processId);
      setEditName(process.name);
      setEditMemory(process.memoryRequired);
      setEditExecutionTime(process.executionTime);
      setEditTimeout(process.timeout);
    }
  };

  const handleDeleteProcess = (processId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este proceso?")) {
      deleteProcess(processId);
    }
  };

  return (
    <Card className="flex flex-col gap-5 p-5">
      <CardHeader className="flex items-center gap-2 p-0 text-black/40">
        <ComandLineIcon className="size-5" />
        <h2 className="font-medium">Acciones</h2>
      </CardHeader>
      <CardBody className="p-0">
        <section className="flex gap-2 justify-center">
          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-3xl">
            <p className="text-xs text-center text-black/30 font-semibold">
              Algoritmo
            </p>
            <div className="flex flex-col gap-2">
              <Tabs
                size="lg"
                color="secondary"
                radius="lg"
                selectedKey={selectedAlgorithm}
                onSelectionChange={(key) => {
                  setSelectedAlgorithm(key as string);
                }}
                isVertical
              >
                {schedulingAlgorithms.map((algorithm) => (
                  <Tab
                    key={algorithm.key}
                    title={
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{algorithm.label}</span>
                      </div>
                    }
                  />
                ))}
              </Tabs>

              <Popover placement="bottom" radius="lg">
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
                    <p className="font-semibold text-foreground">
                      Configurar {currentAlgorithm?.label || selectedAlgorithm}
                    </p>
                    <div className="mt-2 flex flex-col gap-2 w-full">
                      {/* Configuraciones específicas según el algoritmo */}
                      {selectedAlgorithm === "round-robin" && (
                        <NumberInput
                          type="number"
                          label="Quantum de tiempo"
                          description="Tiempo máximo que cada proceso puede usar la CPU"
                          placeholder="1"
                          endContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                (ms)
                              </span>
                            </div>
                          }
                          value={quantumValue}
                          onValueChange={setQuantumValue}
                          variant="bordered"
                          min="1"
                        />
                      )}

                      {selectedAlgorithm === "srtf" && (
                        <>
                          <NumberInput
                            type="number"
                            label="Quantum de tiempo"
                            description="Tiempo máximo entre evaluaciones"
                            placeholder="1"
                            endContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">
                                  (ms)
                                </span>
                              </div>
                            }
                            value={quantumValue}
                            onValueChange={setQuantumValue}
                            variant="bordered"
                            min="1"
                          />
                        </>
                      )}

                      {selectedAlgorithm === "multilevel" && (
                        <>
                          <NumberInput
                            type="number"
                            label="Quantum de tiempo"
                            description="Quantum para la cola de alta prioridad"
                            placeholder="1"
                            endContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">
                                  (ms)
                                </span>
                              </div>
                            }
                            value={quantumValue}
                            onValueChange={setQuantumValue}
                            variant="bordered"
                            min="1"
                          />
                        </>
                      )}

                      {selectedAlgorithm === "priority" && (
                        <div className="text-sm text-gray-600">
                          <p>
                            Este algoritmo usa la prioridad asignada a cada
                            proceso.
                          </p>
                          <p>No requiere configuraciones adicionales.</p>
                        </div>
                      )}

                      {selectedAlgorithm === "fcfs" && (
                        <div className="text-sm text-gray-600">
                          <p>
                            First Come, First Served ejecuta los procesos en el
                            orden de llegada.
                          </p>
                          <p>No requiere configuraciones adicionales.</p>
                        </div>
                      )}

                      {selectedAlgorithm === "sjf" && (
                        <div className="text-sm text-gray-600">
                          <p>
                            Shortest Job First ejecuta primero los procesos más
                            cortos.
                          </p>
                          <p>No requiere configuraciones adicionales.</p>
                        </div>
                      )}
                    </div>

                    {/* Solo mostrar botón aplicar si hay configuraciones que cambiar */}
                    {(selectedAlgorithm !== os.algorithm ||
                      (schedulingAlgorithms.find(
                        (alg) => alg.key === selectedAlgorithm
                      )?.needsQuantum &&
                        quantumValue !== os.timeQuantum)) && (
                      <>
                        <Divider className="my-3" />
                        <div className="flex gap-2">
                          <Button
                            onPress={() => {
                              updateAlgorithm(selectedAlgorithm);
                              if (
                                schedulingAlgorithms.find(
                                  (alg) => alg.key === selectedAlgorithm
                                )?.needsQuantum
                              ) {
                                updateQuantum(Number(quantumValue));
                              }
                            }}
                            color="secondary"
                            fullWidth
                            startContent={<SubmitIcon className="size-5" />}
                          >
                            Aplicar Configuración
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex-grow flex flex-col gap-2">
            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-3xl">
              <p className="text-xs text-center text-black/30 font-semibold">
                Procesos
              </p>
              <div className="grid grid-cols-2 grid-rows-2 gap-1">
                {/* Crear Proceso */}
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
                      <p className="font-semibold text-foreground">
                        Crear proceso
                      </p>
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
                          isDisabled={
                            !processName || !processMemory || !executionTime
                          }
                          fullWidth
                        >
                          Crear
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Editar Proceso */}
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
                      <p className="font-semibold text-foreground">
                        Editar proceso
                      </p>
                      <div className="mt-2 flex flex-col gap-2 w-full">
                        <Select
                          label="Proceso a editar"
                          placeholder="Seleccionar proceso"
                          selectedKeys={
                            selectedProcessId ? [selectedProcessId] : []
                          }
                          onSelectionChange={(keys) => {
                            const key = Array.from(keys)[0] as string;
                            if (key) handleEditProcess(key);
                          }}
                          variant="bordered"
                        >
                          {processes.map((process) => (
                            <SelectItem key={process.id} textValue={process.id}>
                              {process.name}
                            </SelectItem>
                          ))}
                        </Select>

                        {selectedProcessId && (
                          <>
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
                                  <span className="text-default-400 text-small">
                                    (cls)
                                  </span>
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
                                  <span className="text-default-400 text-small">
                                    (mbs)
                                  </span>
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
                                  <span className="text-default-400 text-small">
                                    (cls)
                                  </span>
                                </div>
                              }
                              min={0}
                              value={editTimeout}
                              onValueChange={setEditTimeout}
                              variant="bordered"
                            />
                          </>
                        )}
                      </div>
                      <Divider className="my-3" />
                      <div className="flex gap-2">
                        <Button
                          onPress={() => {
                            if (selectedProcessId) {
                              editProcess(
                                selectedProcessId,
                                editName,
                                Number(editExecutionTime),
                                Number(editMemory),
                                Number(editTimeout || 0)
                              );
                              setSelectedProcessId("");
                            }
                          }}
                          color="warning"
                          startContent={<EditIcon className="size-5" />}
                          isDisabled={!selectedProcessId || !editName}
                        >
                          Actualizar
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Eliminar Proceso */}
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
                      <p className="font-semibold text-foreground">
                        Eliminar proceso
                      </p>
                      <div className="mt-2 flex flex-col gap-2 w-full">
                        <Select
                          label="Proceso a eliminar"
                          placeholder="Seleccionar proceso"
                          variant="bordered"
                        >
                          {processes.map((process) => (
                            <SelectItem
                              key={process.id}
                              textValue={process.id}
                              onPress={() => handleDeleteProcess(process.id)}
                            >
                              {process.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <Divider className="my-3" />
                      <p className="text-sm text-gray-500">
                        Selecciona un proceso para eliminarlo.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Proceso Aleatorio */}
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
                  Crear Aleatorio
                </Button>
              </div>
            </div>
            <div className="flex flex-col flex-grow gap-2 p-4 bg-gray-50 rounded-3xl">
              <p className="text-xs text-center text-black/30 font-semibold">
                Memoria
              </p>
              <div className="grid grid-cols-2 grid-rows-2 gap-1">

              </div>
            </div>
          </div>
        </section>
      </CardBody>
    </Card>
  );
}
