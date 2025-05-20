import React, { useState, useEffect, useRef } from "react";
import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import { createOperatingSystem } from "../logic/operating_system";
import { useOSReducer } from "../logic/operating_system";
import { SystemState } from "../logic/round_robin";
import { getMemoryStatus } from "../logic/memory";
import MemoryBar from "../components/memory_bar";
import RunQueue from "../components/run_queue";
import ProcessList from "../components/process_list";
import Actions from "../components/actions";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  RunningIcon,
  SimulationIcon,
  SkipForwardIcon,
  SkipToStart,
  SnailIcon,
} from "../utils/icons";

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-teal-500",
];

const OSSimulator: React.FC = () => {
  const initialOs = createOperatingSystem(1024);

  const { os, createProcess, killProcess, simulateExecution, setQuantum } =
    useOSReducer(initialOs);

  const [simulationStates, setSimulationStates] = useState<SystemState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000);

  const processes = os.processes;
  const memory = getMemoryStatus(os);
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
    : memory;
  const displayQueue = currentState
    ? [
        ...(currentState.runningProcess ? [currentState.runningProcess] : []),
        ...currentState.readyQueue,
      ]
    : runQueue;

  const timerRef = useRef<number | null>(null);

  const generateGanttData = () => {
    if (simulationStates.length <= 1) return { blocks: [], switchTimes: [] };

    const ganttData: {
      processId: string;
      processName: string;
      startTime: number;
      endTime: number;
      color: string;
    }[] = [];

    const processColors = new Map<number, string>();

    const uniqueProcesses = new Set<number>();
    simulationStates.forEach((state) => {
      if (state.runningProcess) {
        uniqueProcesses.add(state.runningProcess.pid);
      }
    });

    let colorIndex = 0;
    uniqueProcesses.forEach((pid) => {
      processColors.set(pid, colors[colorIndex % colors.length]);
      colorIndex++;
    });

    let currentPid: number | null = null;
    let blockStartTime = 0;

    for (let i = 0; i < simulationStates.length; i++) {
      const state = simulationStates[i];

      // Si hay un proceso en ejecución
      if (state.runningProcess) {
        const runningPid = state.runningProcess.pid;

        // Si es un nuevo proceso o el primer proceso
        if (currentPid !== runningPid) {
          // Finalizar el bloque anterior si existe
          if (currentPid !== null) {
            ganttData.push({
              processId: `P${currentPid}`,
              processName:
                simulationStates.find(
                  (s) => s.runningProcess?.pid === currentPid
                )?.runningProcess?.name || `P${currentPid}`,
              startTime: blockStartTime,
              endTime: state.time,
              color: processColors.get(currentPid) || "bg-gray-500",
            });
          }

          // Iniciar un nuevo bloque
          currentPid = runningPid;
          blockStartTime = state.time;
        }
      } else if (currentPid !== null) {
        // Si no hay proceso en ejecución pero había uno antes, cerramos el bloque
        ganttData.push({
          processId: `P${currentPid}`,
          processName:
            simulationStates.find((s) => s.runningProcess?.pid === currentPid)
              ?.runningProcess?.name || `P${currentPid}`,
          startTime: blockStartTime,
          endTime: state.time,
          color: processColors.get(currentPid) || "bg-gray-500",
        });
        currentPid = null;
      }
    }

    // Cerrar el último bloque si es necesario
    if (currentPid !== null && simulationStates.length > 0) {
      ganttData.push({
        processId: `P${currentPid}`,
        processName:
          simulationStates.find((s) => s.runningProcess?.pid === currentPid)
            ?.runningProcess?.name || `P${currentPid}`,
        startTime: blockStartTime,
        endTime: simulationStates[simulationStates.length - 1].time,
        color: processColors.get(currentPid) || "bg-gray-500",
      });
    }

    // Generar tiempos de cambio para las marcas
    const switchTimes: number[] = [];
    ganttData.forEach((block) => {
      switchTimes.push(block.startTime);
      switchTimes.push(block.endTime);
    });

    // Eliminar duplicados y ordenar
    const uniqueSwitchTimes = [...new Set(switchTimes)].sort((a, b) => a - b);

    return {
      blocks: ganttData,
      switchTimes: uniqueSwitchTimes,
    };
  };

  // Diagrama de Gantt - Componente para visualizar el diagrama
  const renderGanttChart = () => {
    if (simulationStates.length <= 1) {
      return (
        <div className="text-gray-400 p-4 text-center">
          No hay suficientes datos para generar el diagrama
        </div>
      );
    }

    const ganttData = generateGanttData();
    const totalTime = simulationStates[simulationStates.length - 1].time;

    return (
      <div className="relative w-full h-14 bg-gray-100 rounded overflow-hidden">
        {ganttData.blocks.map((block, index) => {
          const startPercent = (block.startTime / totalTime) * 100;
          const widthPercent =
            ((block.endTime - block.startTime) / totalTime) * 100;

          return (
            <div
              key={index}
              className={`absolute h-10 top-0 ${block.color} rounded-md flex items-center justify-center text-white font-semibold text-sm`}
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`,
                minWidth: "30px",
              }}
            >
              {block.processName}
            </div>
          );
        })}

        {/* Línea de tiempo actual */}
        {currentState && (
          <div
            className="absolute top-0 h-14 border-l-2 border-red-500 z-10"
            style={{
              left: `${(currentState.time / Math.max(totalTime, 1)) * 100}%`,
            }}
          >
            <div className="bg-red-500 text-white text-xs px-1 rounded">
              {currentState.time}
            </div>
          </div>
        )}

        {/* Marcas de tiempo */}
        <div className="absolute bottom-0 w-full h-4 flex text-xs text-gray-500">
          {ganttData.switchTimes.map((time, i) => (
            <div
              key={i}
              className="absolute border-l border-gray-300"
              style={{ left: `${(time / totalTime) * 100}%` }}
            >
              <div className="pl-1">{time}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Ejecutar simulación cuando cambian los procesos
  useEffect(() => {
    if (processes.length > 0) {
      const newSimulation = simulateExecution();
      setSimulationStates(newSimulation);
      if (!isRunning) {
        setCurrentStateIndex(0);
      }
    } else {
      setSimulationStates([]);
      setCurrentStateIndex(0);
    }
  }, [processes, os.timeQuantum]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDirectKillProcess = (pid: number) => {
    killProcess(pid);
  };

  // Manejadores para la navegación en la simulación
  const goToNextState = () => {
    if (currentStateIndex < simulationStates.length - 1) {
      setCurrentStateIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPreviousState = () => {
    if (currentStateIndex > 0) {
      setCurrentStateIndex((prevIndex) => prevIndex - 1);
    }
  };

  const goToFirstState = () => {
    setCurrentStateIndex(0);
  };

  const goToLastState = () => {
    setCurrentStateIndex(simulationStates.length - 1);
  };

  // Manejadores para auto-reproducción
  const startAutoPlayForward = () => {
    setIsRunning(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setCurrentStateIndex((prevIndex) => {
        if (prevIndex >= simulationStates.length - 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            setIsRunning(false);
          }
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, speed);
  };

  const stopAutoPlay = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const [selectedSpeed, setSelectedSpeed] = useState("normal");
  const [algorithm, setAlgorithm] = useState("");

  useEffect(() => {
    console.log(selectedSpeed);
    if (selectedSpeed === "normal") {
      setNormalSpeed();
    } else if (selectedSpeed === "fast") {
      setFastSpeed();
    }
  }, [selectedSpeed]);

  const setFastSpeed = () => {
    setSpeed(300);
    if (isRunning) {
      stopAutoPlay();
      setTimeout(() => startAutoPlayForward(), 250);
    }
  };

  const setNormalSpeed = () => {
    setSpeed(1000);
    if (isRunning) {
      stopAutoPlay();
      setTimeout(() => startAutoPlayForward(), 500);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
            editProcess={function (
              processId: string,
              name: string,
              executionTime: number,
              memoryRequired: number,
              timeout: number
            ): void {
              throw new Error("Function not implemented.");
            }}
            deleteProcess={function (processId: string): void {
              throw new Error("Function not implemented.");
            }}
            processes={[]}
          />
          <MemoryBar memory={displayMemory} />
          <RunQueue queue={displayQueue} />
        </div>

        <div className="col-span-2 flex flex-col gap-3">
          <ProcessList
            processes={displayProcesses}
            onKillProcess={handleDirectKillProcess}
          />

          <Card className="flex flex-col gap-5 p-5">
            <CardHeader className="flex gap-2 justify-between p-0 items-center">
              <div className="flex gap-2 items-center text-black/40">
                <SimulationIcon className="size-5" />
                <h2 className="font-medium">Simulación</h2>
              </div>
              <div className="font-medium text-black/40">
                Tiempo CPU: {currentState?.time || 0}
              </div>
            </CardHeader>
            <CardBody className="p-0 flex flex-col gap-2">
              {renderGanttChart()}

              <section className="flex gap-2 justify-center">
                <div className="flex flex-col justify-center items-center gap-3 p-4 bg-gray-50 rounded-3xl w-40">
                  <div>
                    <p className="text-xs text-center text-black/30 font-semibold">
                      Algoritmo
                    </p>
                    <p className="text-center text-sm">Round Robin</p>
                  </div>
                  <div>
                    <p className="text-xs text-center text-black/30 font-semibold">
                      Quantum
                    </p>
                    <p className="text-center text-sm">{os.timeQuantum} ms</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-3xl">
                  <p className="text-xs text-center text-black/30 font-semibold">
                    Controles
                  </p>
                  <div className="grid grid-cols-2 grid-rows-2 gap-1">
                    <Button
                      onPress={goToPreviousState}
                      color="primary"
                      startContent={<SkipToStart className="size-5" />}
                      isDisabled={currentStateIndex === 0 || isRunning}
                    >
                      Anterior
                    </Button>
                    <Button
                      onPress={goToNextState}
                      endContent={<SkipForwardIcon className="size-5" />}
                      color="primary"
                      isDisabled={
                        currentStateIndex === simulationStates.length - 1 ||
                        isRunning
                      }
                    >
                      Siguiente
                    </Button>
                    <Button
                      onPress={goToFirstState}
                      color="default"
                      startContent={<RewindIcon className="size-5 " />}
                      variant="flat"
                      isDisabled={currentStateIndex === 0 || isRunning}
                    >
                      Inicio
                    </Button>
                    <Button
                      onPress={goToLastState}
                      color="default"
                      endContent={<FastForwardIcon className="size-5" />}
                      variant="flat"
                      isDisabled={
                        currentStateIndex === simulationStates.length - 1 ||
                        isRunning
                      }
                    >
                      Final
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-3xl">
                  <p className="text-xs text-center text-black/30 font-semibold">
                    Automatico
                  </p>
                  <div className="flex flex-col gap-1">
                    {!isRunning ? (
                      <Button
                        onPress={startAutoPlayForward}
                        color="success"
                        isDisabled={
                          simulationStates.length <= 1 ||
                          currentStateIndex === simulationStates.length - 1
                        }
                        startContent={<PlayIcon className="size-5" />}
                        className="sm:col-span-1"
                      >
                        Auto
                      </Button>
                    ) : (
                      <Button
                        onPress={stopAutoPlay}
                        color="danger"
                        className="sm:col-span-1"
                        startContent={<PauseIcon className="size-5" />}
                      >
                        Parar
                      </Button>
                    )}

                    <Tabs
                      color="warning"
                      radius="lg"
                      size="lg"
                      selectedKey={selectedSpeed}
                      onSelectionChange={(key) =>
                        setSelectedSpeed(key as string)
                      }
                    >
                      <Tab
                        key="normal"
                        title={
                          <div className="flex items-center gap-2">
                            <SnailIcon className="size-5" />
                            <span className="text-sm">Normal</span>
                          </div>
                        }
                      />
                      <Tab
                        key="fast"
                        title={
                          <div className="flex items-center gap-2">
                            <RunningIcon className="size-5" />
                            <span className="text-sm">Rápido</span>
                          </div>
                        }
                      />
                    </Tabs>
                  </div>
                </div>
              </section>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default OSSimulator;
