import { Card, CardBody, CardHeader } from "@heroui/react";
import { ComandLineIcon } from "../utils/icons";
import RandomButton from "./control_buttons/random_button";
import DeleteButton from "./control_buttons/delete_button";
import EditButton from "./control_buttons/edit_button";
import CreateButton from "./control_buttons/create_button";
import AlgorithmConfig from "./control_buttons/algorithm_config";
import MemoryConfig from "./control_buttons/memory_config";
import DynamicButton from "./control_buttons/dinamic_button";
import { ProcessInterface } from "../logic/processes";

interface ProcessControlsParams {
  os: {
    timeQuantum: number;
    algorithm: string;
  };
  createProcess: (
    name: string,
    executionTime: number,
    memoryRequired: number,
    timeout: number
  ) => void;
  updateQuantum: (quantum: number) => void;
  updateAlgorithm: (algorithm: string) => void;
  editProcess: (
    pid: number,
    updates: {
      name?: string;
      executionTime?: number;
      memoryRequired?: number;
      timeout?: number;
    }
  ) => void;
  deleteProcess: (pid: number) => void;
  processes: ProcessInterface[];
  dynamic: boolean;
  setDynamic: (dynamic: boolean) => void;
  memory: number;
  setMemory: (totalMemory: number) => void;
}

export default function ProcessControls({
  os,
  createProcess,
  updateQuantum,
  updateAlgorithm,
  editProcess,
  deleteProcess,
  processes,
  dynamic,
  setDynamic,
  memory,
  setMemory,
}: ProcessControlsParams) {
  return (
    <Card className="flex flex-col gap-5 p-5" shadow="none" radius="lg">
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
              <AlgorithmConfig
                os={os}
                updateQuantum={updateQuantum}
                updateAlgorithm={updateAlgorithm}
              />
            </div>
          </div>
          <div className="flex-grow flex flex-col gap-2">
            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-3xl">
              <p className="text-xs text-center text-black/30 font-semibold">
                Procesos
              </p>
              <div className="grid grid-cols-2 grid-rows-2 gap-1">
                <CreateButton createProcess={createProcess} />
                <EditButton editProcess={editProcess} processes={processes} />
                <DeleteButton
                  deleteProcess={deleteProcess}
                  processes={processes}
                />
                <RandomButton createProcess={createProcess} />
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-3xl">
              <p className="text-xs text-center text-black/30 font-semibold">
                Memoria
              </p>
              <div className="flex flex-col gap-1">
                <MemoryConfig updateMemory={setMemory} initialMemory={memory} />
              </div>
            </div>
            <DynamicButton value={dynamic} onValueChange={setDynamic} />
          </div>
        </section>
      </CardBody>
    </Card>
  );
}
