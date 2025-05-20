import { useReducer } from "react";
import { addProcessToOS, killProcessInOS, ProcessInterface } from "./processes";
import { simulateRoundRobinExecution } from "./round_robin";

export interface OperatingSystemInterface {
  totalMemory: number;
  availableMemory: number;
  processes: ProcessInterface[];
  runQueue: ProcessInterface[];
  currentProcess: ProcessInterface | null;
  timeQuantum: number;
}

export const createOperatingSystem = (
  totalMemory: number = 1024
): OperatingSystemInterface => {
  return {
    totalMemory,
    availableMemory: totalMemory,
    processes: [],
    runQueue: [],
    currentProcess: null,
    timeQuantum: 1,
  };
};

export type OSAction =
  | { type: "SET"; payload: OperatingSystemInterface }
  | { type: "UPDATE"; payload: Partial<OperatingSystemInterface> }
  | {
      type: "CREATE_PROCESS";
      payload: {
        name: string;
        executionTime: number;
        memoryRequired: number;
        timeout: number;
      };
    }
  | { type: "KILL_PROCESS"; payload: { pid: number } }
  | { type: "REMOVE_PROCESS"; payload: { pid: number } }
  | {
      type: "EDIT_PROCESS";
      payload: {
        pid: number;
        name?: string;
        executionTime?: number;
        memoryRequired?: number;
        timeout?: number;
      };
    }
  | { type: "SET_QUANTUM"; payload: { quantum: number } }
  | { type: "MODIFY_MEMORY"; payload: { totalMemory: number } };

// Función para modificar la memoria total del sistema
export const modifyMemoryInOS = (
  os: OperatingSystemInterface,
  newTotalMemory: number
): OperatingSystemInterface => {
  const memoryDifference = newTotalMemory - os.totalMemory;
  const newAvailableMemory = os.availableMemory + memoryDifference;

  return {
    ...os,
    totalMemory: newTotalMemory,
    availableMemory: newAvailableMemory,
  };
};

// Función para eliminar completamente un proceso del sistema
export const removeProcessFromOS = (
  os: OperatingSystemInterface,
  pid: number
): OperatingSystemInterface => {
  // Encontrar el proceso para obtener la memoria que liberará
  const processToRemove = os.processes.find((p) => p.pid === pid);

  // Si el proceso no existe, retornamos el estado sin cambios
  if (!processToRemove) {
    return os;
  }

  // Calculamos la nueva memoria disponible
  const newAvailableMemory =
    os.availableMemory + processToRemove.memoryRequired;

  // Filtramos el proceso de la lista de procesos
  const newProcesses = os.processes.filter((p) => p.pid !== pid);

  // Filtramos el proceso de la cola de ejecución
  const newRunQueue = os.runQueue.filter((p) => p.pid !== pid);

  // Actualizamos el proceso actual si es el que estamos eliminando
  const newCurrentProcess =
    os.currentProcess && os.currentProcess.pid === pid
      ? null
      : os.currentProcess;

  return {
    ...os,
    availableMemory: newAvailableMemory,
    processes: newProcesses,
    runQueue: newRunQueue,
    currentProcess: newCurrentProcess,
  };
};

// Función para editar un proceso existente
export const editProcessInOS = (
  os: OperatingSystemInterface,
  pid: number,
  updates: {
    name?: string;
    executionTime?: number;
    memoryRequired?: number;
    timeout?: number;
  }
): OperatingSystemInterface => {
  // Buscamos el proceso en la lista de procesos
  const processIndex = os.processes.findIndex((p) => p.pid === pid);

  // Si el proceso no existe, retornamos el estado sin cambios
  if (processIndex === -1) {
    return os;
  }

  // Hacemos una copia del proceso original
  const originalProcess = os.processes[processIndex];

  // Calculamos la diferencia de memoria si se modificó el requisito de memoria
  const memoryDifference =
    updates.memoryRequired !== undefined
      ? originalProcess.memoryRequired - updates.memoryRequired
      : 0;

  // Actualizamos el proceso con los nuevos valores
  const updatedProcess = {
    ...originalProcess,
    ...updates,
  };

  // Creamos la nueva lista de procesos con el proceso actualizado
  const newProcesses = [...os.processes];
  newProcesses[processIndex] = updatedProcess;

  // Actualizamos la cola de ejecución si el proceso está en ella
  const runQueueIndex = os.runQueue.findIndex((p) => p.pid === pid);
  let newRunQueue = [...os.runQueue];

  if (runQueueIndex !== -1) {
    newRunQueue[runQueueIndex] = updatedProcess;
  }

  // Actualizamos el proceso actual si es el que estamos editando
  const newCurrentProcess =
    os.currentProcess && os.currentProcess.pid === pid
      ? updatedProcess
      : os.currentProcess;

  // Calculamos la nueva memoria disponible si cambió el requisito de memoria
  const newAvailableMemory = os.availableMemory + memoryDifference;

  return {
    ...os,
    availableMemory: newAvailableMemory,
    processes: newProcesses,
    runQueue: newRunQueue,
    currentProcess: newCurrentProcess,
  };
};

export function useOSReducer(initialOS: OperatingSystemInterface) {
  const reducer = (
    state: OperatingSystemInterface,
    action: OSAction
  ): OperatingSystemInterface => {
    switch (action.type) {
      case "SET":
        return action.payload;

      case "UPDATE":
        return { ...state, ...action.payload };

      case "CREATE_PROCESS": {
        return addProcessToOS(
          state,
          action.payload.name,
          action.payload.executionTime,
          action.payload.memoryRequired,
          action.payload.timeout
        );
      }

      case "KILL_PROCESS": {
        return killProcessInOS(state, action.payload.pid);
      }

      case "REMOVE_PROCESS": {
        return removeProcessFromOS(state, action.payload.pid);
      }

      case "EDIT_PROCESS": {
        const { pid, ...updates } = action.payload;
        return editProcessInOS(state, pid, updates);
      }

      case "SET_QUANTUM": {
        return {
          ...state,
          timeQuantum: action.payload.quantum,
        };
      }

      case "MODIFY_MEMORY": {
        return modifyMemoryInOS(state, action.payload.totalMemory);
      }

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialOS);

  const update = (changes: Partial<OperatingSystemInterface>) => {
    dispatch({ type: "UPDATE", payload: changes });
  };

  const set = (newState: OperatingSystemInterface) => {
    dispatch({ type: "SET", payload: newState });
  };

  const createProcessAction = (
    name: string,
    executionTime: number,
    memoryRequired: number,
    timeout: number
  ) => {
    dispatch({
      type: "CREATE_PROCESS",
      payload: { name, executionTime, memoryRequired, timeout },
    });
  };

  const killProcess = (pid: number) => {
    dispatch({ type: "KILL_PROCESS", payload: { pid } });
  };

  const removeProcess = (pid: number) => {
    dispatch({ type: "REMOVE_PROCESS", payload: { pid } });
  };

  const editProcess = (
    pid: number,
    updates: {
      name?: string;
      executionTime?: number;
      memoryRequired?: number;
      timeout?: number;
    }
  ) => {
    dispatch({
      type: "EDIT_PROCESS",
      payload: { pid, ...updates },
    });
  };

  const setQuantum = (quantum: number) => {
    dispatch({ type: "SET_QUANTUM", payload: { quantum } });
  };

  const modifyMemory = (totalMemory: number) => {
    dispatch({ type: "MODIFY_MEMORY", payload: { totalMemory } });
  };

  const simulateExecution = () => {
    return simulateRoundRobinExecution(
      state.processes,
      state.totalMemory,
      state.timeQuantum
    );
  };

  return {
    os: state,
    update,
    set,
    createProcess: createProcessAction,
    killProcess,
    removeProcess,
    editProcess,
    setQuantum,
    modifyMemory,
    simulateExecution,
  };
}
