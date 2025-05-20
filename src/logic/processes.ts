import { OperatingSystemInterface } from "./operating_system";

export interface ProcessInterface {
  pid: number;
  name: string;
  state: "waiting" | "ready" | "running" | "finished";
  memoryRequired: number;
  executionTime: number;
  currentExecution: number;
  timeout: number;
  creationTime: number;
}

export const createProcess = (
  name: string,
  executionTime: number,
  memoryRequired: number,
  timeout: number = 0
): ProcessInterface => {
  return {
    pid: Math.floor(Math.random() * 10000),
    name,
    state: "waiting",
    memoryRequired,
    executionTime,
    currentExecution: 0,
    timeout,
    creationTime: Date.now(),
  };
};

export const addProcessToOS = (
  os: OperatingSystemInterface,
  name: string,
  executionTime: number,
  memoryRequired: number,
  timeout: number = 0
): OperatingSystemInterface => {
  const process = createProcess(name, executionTime, memoryRequired, timeout);

  if (process.memoryRequired > os.availableMemory) {
    return os; // No se pudo crear el proceso
  }

  return {
    ...os,
    processes: [...os.processes, process],
    runQueue: [...os.runQueue, process],
    availableMemory: os.availableMemory - process.memoryRequired,
  };
};

export const killProcessInOS = (
  os: OperatingSystemInterface,
  pid: number
): OperatingSystemInterface => {
  const processIndex = os.processes.findIndex((p) => p.pid === pid);
  if (processIndex === -1) {
    return os; // Proceso no encontrado
  }

  const process = os.processes[processIndex];
  const updatedProcesses = os.processes.map((p) =>
    p.pid === pid ? { ...p, state: "finished" as const } : p
  );

  const updatedRunQueue = os.runQueue.filter((p) => p.pid !== pid);

  return {
    ...os,
    processes: updatedProcesses,
    runQueue: updatedRunQueue,
    availableMemory: os.availableMemory + process.memoryRequired,
  };
};

export const cloneProcess = (process: ProcessInterface): ProcessInterface => {
  return { ...process };
};
