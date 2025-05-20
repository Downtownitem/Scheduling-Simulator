import {
  Button,
  Divider,
  NumberInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tab,
  Tabs,
} from "@heroui/react";
import { SettingsIcon, SubmitIcon } from "../../utils/icons";
import { useState } from "react";

interface Props {
  os: {
    timeQuantum: number;
    algorithm: string;
  };
  updateQuantum: (quantum: number) => void;
  updateAlgorithm: (algorithm: string) => void;
}

const schedulingAlgorithms = [
  { key: "round-robin", label: "Round Robin", needsQuantum: true },
  { key: "fcfs", label: "F.C.F.S.", needsQuantum: false, disabled: true },
  {
    key: "sjf",
    label: "Shortest Job First",
    needsQuantum: false,
    disabled: true,
  },
  {
    key: "priority",
    label: "Priority Scheduling",
    needsQuantum: false,
    disabled: true,
  },
  { key: "srtf", label: "S.R.T.F.", needsQuantum: true, disabled: true },
  {
    key: "multilevel",
    label: "Multilevel Queue",
    needsQuantum: true,
    disabled: true,
  },
];

export default function AlgorithmConfig({
  os,
  updateQuantum,
  updateAlgorithm,
}: Props) {
  const [quantumValue, setQuantumValue] = useState<number>(os.timeQuantum);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>(
    os.algorithm
  );

  const currentAlgorithm = schedulingAlgorithms.find(
    (alg) => alg.key === os.algorithm
  );

  return (
    <>
      <Tabs
        size="lg"
        color="secondary"
        radius="lg"
        selectedKey={selectedAlgorithm}
        onSelectionChange={(key) => {
          setSelectedAlgorithm(key as string);
        }}
        isVertical
        disabledKeys={schedulingAlgorithms
          .filter((alg) => alg.disabled)
          .map((alg) => alg.key)}
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
                      <span className="text-default-400 text-small">(ms)</span>
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
                    Este algoritmo usa la prioridad asignada a cada proceso.
                  </p>
                  <p>No requiere configuraciones adicionales.</p>
                </div>
              )}

              {selectedAlgorithm === "fcfs" && (
                <div className="text-sm text-gray-600">
                  <p>
                    First Come, First Served ejecuta los procesos en el orden de
                    llegada.
                  </p>
                  <p>No requiere configuraciones adicionales.</p>
                </div>
              )}

              {selectedAlgorithm === "sjf" && (
                <div className="text-sm text-gray-600">
                  <p>
                    Shortest Job First ejecuta primero los procesos más cortos.
                  </p>
                  <p>No requiere configuraciones adicionales.</p>
                </div>
              )}
            </div>

            {/* Solo mostrar botón aplicar si hay configuraciones que cambiar */}
            {(selectedAlgorithm !== os.algorithm ||
              (schedulingAlgorithms.find((alg) => alg.key === selectedAlgorithm)
                ?.needsQuantum &&
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
    </>
  );
}
