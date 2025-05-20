import { useState, useEffect } from "react";
import { createOperatingSystem } from "../logic/operating_system";
import { useOSReducer } from "../logic/operating_system";
import { simulateRoundRobinExecution, SystemState } from "../logic/round_robin";
import { getMemoryStatus } from "../logic/memory";
import MemoryBar from "../components/memory_bar";
import RunQueue from "../components/run_queue";
import ProcessList from "../components/process_list";
import Actions from "../components/actions";
import Simulator from "../components/simulator";

export default function MainSimulation() {
  const initialOs = createOperatingSystem(1024);
  const {
    os,
    createProcess,
    removeProcess,
    editProcess,
    setQuantum,
    modifyMemory,
  } = useOSReducer(initialOs);

  const [simulationStates, setSimulationStates] = useState<SystemState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [algorithm, setAlgorithm] = useState("round-robin");
  const [dynamic, setDynamic] = useState(false);

  const processes = os.processes;
  const actualMemoryStatus = getMemoryStatus(os);
  const runQueue = os.runQueue;
  const currentState =
    simulationStates.length > 0 && currentStateIndex < simulationStates.length
      ? simulationStates[currentStateIndex]
      : null;
  const displayProcesses = currentState ? currentState.processes : processes;
  const displayMemory = currentState
    ? {
        total: currentState.totalMemory,
        used: currentState.totalMemory - currentState.availableMemory,
        available: currentState.availableMemory,
      }
    : actualMemoryStatus;
  const displayQueue = currentState
    ? [
        ...(currentState.runningProcess ? [currentState.runningProcess] : []),
        ...currentState.readyQueue,
      ]
    : runQueue;

  useEffect(() => {
    if (processes.length > 0) {
      let newSimulation: SystemState[] = [];

      if (algorithm === "round-robin") {
        newSimulation = simulateRoundRobinExecution(
          os.processes,
          os.totalMemory,
          os.timeQuantum
        );
      }

      setSimulationStates(newSimulation);
      if (!isRunning) {
        setCurrentStateIndex(0);
      }
    } else {
      setSimulationStates([]);
      setCurrentStateIndex(0);
    }
  }, [processes, os.timeQuantum]);

  return (
    <div className="h-screen flex flex-grow flex-col bg-gray-100">
      <header className="bg-foreground text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Simulador de Sistema Operativo
          </h1>
          <div className="flex space-x-5 text-sm">
            <div className="flex items-center">
              <span>
                Procesos:{" "}
                {displayProcesses.filter((p) => p.state !== "finished").length}
              </span>
            </div>
            <div className="flex items-center">
              <span>Memoria: {displayMemory.available}MB disponible</span>
            </div>
          </div>
        </div>
      </header>

      <section className="flex-1 grid grid-cols-3 p-3 gap-3 overflow-auto">
        <div className="flex flex-col gap-3">
          <Actions
            createProcess={createProcess}
            updateQuantum={setQuantum}
            os={{
              timeQuantum: os.timeQuantum,
              algorithm: algorithm,
            }}
            updateAlgorithm={setAlgorithm}
            editProcess={editProcess}
            deleteProcess={removeProcess}
            processes={os.processes}
            dynamic={dynamic}
            setDynamic={setDynamic}
            memory={os.totalMemory}
            setMemory={modifyMemory}
          />
          <MemoryBar memory={displayMemory} />
          <RunQueue queue={displayQueue} />
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <ProcessList
            processes={displayProcesses}
            removeProcess={removeProcess}
          />
          <Simulator
            timeQuantum={os.timeQuantum}
            simulationStates={simulationStates}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            currentStateIndex={currentStateIndex}
            setCurrentStateIndex={setCurrentStateIndex}
            dynamic={dynamic}
          />
        </div>
      </section>
    </div>
  );
}
