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
  | { type: "SET_QUANTUM"; payload: { quantum: number } };

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

      case "SET_QUANTUM": {
        return {
          ...state,
          timeQuantum: action.payload.quantum,
        };
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

  const setQuantum = (quantum: number) => {
    dispatch({ type: "SET_QUANTUM", payload: { quantum } });
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
    setQuantum,
    simulateExecution,
  };
}
