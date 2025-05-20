import { cloneProcess, ProcessInterface } from "./processes";

export interface SystemState {
  time: number;
  availableMemory: number;
  totalMemory: number;
  runningProcess: ProcessInterface | null;
  processes: ProcessInterface[];
  readyQueue: ProcessInterface[];
  waitingQueue: ProcessInterface[];
  finishedProcesses: ProcessInterface[];
  events: string[];
}

export function simulateRoundRobinExecution(
  processes: ProcessInterface[],
  totalMemory: number = 1024,
  timeQuantum: number = 1
): SystemState[] {
  if (processes.length === 0) {
    return [];
  }

  // Clonamos los procesos para no modificar los originales
  const simulationProcesses = processes.map((p) => cloneProcess(p));

  // Preparamos la cola inicial y los procesos en espera
  const initialReadyQueue: ProcessInterface[] = [];
  const initialWaitingQueue: ProcessInterface[] = [];
  let availableMemory = totalMemory;

  // Colocamos los procesos con timeout 0 en la cola de listos y los demás en espera
  for (const process of simulationProcesses) {
    if (process.timeout === 0) {
      process.state = "ready";
      initialReadyQueue.push(process);
      availableMemory -= process.memoryRequired;
    } else {
      process.state = "waiting";
      initialWaitingQueue.push(process);
    }
  }

  // Estado inicial del sistema - tiempo 0
  let currentState: SystemState = {
    time: 0,
    availableMemory,
    totalMemory,
    runningProcess: null,
    processes: simulationProcesses.map((p) => cloneProcess(p)),
    readyQueue: initialReadyQueue.map((p) => cloneProcess(p)),
    waitingQueue: initialWaitingQueue.map((p) => cloneProcess(p)),
    finishedProcesses: [],
    events: ["Iniciando simulación"],
  };

  // Tomamos el primer proceso de la cola si hay alguno y lo marcamos como ejecutando
  if (initialReadyQueue.length > 0) {
    const firstProcess = initialReadyQueue[0];
    firstProcess.state = "running";
    currentState.runningProcess = cloneProcess(firstProcess);
    currentState.readyQueue = initialReadyQueue
      .slice(1)
      .map((p) => cloneProcess(p));
    currentState.events.push(
      `Proceso ${firstProcess.name} (PID: ${firstProcess.pid}) comienza a ejecutarse`
    );
  }

  // Colección de todos los estados del sistema
  const systemStates: SystemState[] = [
    {
      ...currentState,
      processes: currentState.processes.map((p) => cloneProcess(p)),
      readyQueue: currentState.readyQueue.map((p) => cloneProcess(p)),
      waitingQueue: currentState.waitingQueue.map((p) => cloneProcess(p)),
      finishedProcesses: [],
      runningProcess: currentState.runningProcess
        ? cloneProcess(currentState.runningProcess)
        : null,
    },
  ];

  // Variables para controlar la simulación
  let time = 0;
  let isSimulationComplete = false;
  let quantumCounter = 0; // Inicializar en 0 para que el primer proceso ejecute el quantum completo
  let currentRunningProcess: ProcessInterface | null =
    currentState.runningProcess;

  while (!isSimulationComplete) {
    time++;

    // Creamos un nuevo estado para este instante de tiempo
    currentState = {
      time: time,
      availableMemory: currentState.availableMemory,
      totalMemory: currentState.totalMemory,
      runningProcess: null,
      processes: currentState.processes.map((p) => cloneProcess(p)),
      readyQueue: currentState.readyQueue.map((p) => cloneProcess(p)),
      waitingQueue: [],
      finishedProcesses: currentState.finishedProcesses.map((p) =>
        cloneProcess(p)
      ),
      events: [],
    };

    // 1. Verificar procesos que han llegado a su timeout
    const arrivedProcesses: ProcessInterface[] = [];

    currentState.waitingQueue = [];
    for (const process of currentState.processes) {
      if (process.state === "waiting") {
        if (process.timeout <= time) {
          if (process.memoryRequired <= currentState.availableMemory) {
            process.state = "ready";
            currentState.availableMemory -= process.memoryRequired;
            arrivedProcesses.push(cloneProcess(process));
            currentState.events.push(
              `Proceso ${process.name} (PID: ${process.pid}) ha llegado a su timeout y está listo para ejecutar`
            );
          } else {
            currentState.waitingQueue.push(cloneProcess(process));
            currentState.events.push(
              `Proceso ${process.name} (PID: ${process.pid}) ha llegado a su timeout pero no hay memoria suficiente`
            );
          }
        } else {
          currentState.waitingQueue.push(cloneProcess(process));
        }
      }
    }

    // Añadimos los nuevos procesos listos a la cola
    currentState.readyQueue = [...currentState.readyQueue, ...arrivedProcesses];

    // 2. Ejecutar el proceso actual (Round Robin)
    if (currentRunningProcess) {
      quantumCounter++;

      // Encontramos el proceso original en processes y lo actualizamos
      const originalProcess = currentState.processes.find(
        (p) => p.pid === currentRunningProcess!.pid
      );

      if (originalProcess) {
        originalProcess.state = "running";
        originalProcess.currentExecution += 1;
        currentRunningProcess.currentExecution =
          originalProcess.currentExecution;
      }

      // Establecer el proceso en ejecución para este estado
      currentState.runningProcess = cloneProcess(currentRunningProcess);
      currentState.runningProcess.state = "running";

      // Verificamos si el proceso ha terminado
      if (
        currentRunningProcess.currentExecution >=
        currentRunningProcess.executionTime
      ) {
        currentRunningProcess.state = "finished";
        if (originalProcess) {
          originalProcess.state = "finished";
        }

        currentState.runningProcess.state = "finished";
        currentState.events.push(
          `Proceso ${currentRunningProcess.name} (PID: ${currentRunningProcess.pid}) ha terminado su ejecución`
        );
        currentState.finishedProcesses.push(
          cloneProcess(currentRunningProcess)
        );

        // Liberamos memoria
        currentState.availableMemory += currentRunningProcess.memoryRequired;
        currentState.events.push(
          `Memoria liberada: ${currentRunningProcess.memoryRequired}MB. Disponible: ${currentState.availableMemory}MB`
        );

        // Reiniciamos para obtener un nuevo proceso
        currentRunningProcess = null;
        quantumCounter = 0;

        // Verificamos si hay procesos esperando que ahora pueden entrar
        const newProcessesFromWaiting: ProcessInterface[] = [];
        const remainingWaitingQueue: ProcessInterface[] = [];

        for (const waitingProcess of currentState.waitingQueue) {
          if (
            waitingProcess.state === "waiting" &&
            waitingProcess.timeout <= time &&
            waitingProcess.memoryRequired <= currentState.availableMemory
          ) {
            waitingProcess.state = "ready";
            currentState.availableMemory -= waitingProcess.memoryRequired;
            newProcessesFromWaiting.push(cloneProcess(waitingProcess));
            currentState.events.push(
              `Proceso ${waitingProcess.name} (PID: ${waitingProcess.pid}) ahora tiene memoria suficiente y está listo`
            );
          } else {
            remainingWaitingQueue.push(cloneProcess(waitingProcess));
          }
        }

        currentState.waitingQueue = remainingWaitingQueue;
        currentState.readyQueue = [
          ...currentState.readyQueue,
          ...newProcessesFromWaiting,
        ];
      } else if (quantumCounter >= timeQuantum) {
        // Si se completó el quantum, el proceso vuelve a la cola
        currentRunningProcess.state = "ready";
        if (originalProcess) {
          originalProcess.state = "ready";
        }

        currentState.runningProcess.state = "ready";
        currentState.events.push(
          `Proceso ${currentRunningProcess.name} completa quantum de ${timeQuantum} y vuelve a la cola`
        );

        // Lo ponemos al final de la cola
        currentState.readyQueue.push(cloneProcess(currentRunningProcess));

        // Reiniciamos para obtener un nuevo proceso
        currentRunningProcess = null;
        quantumCounter = 0;
      }
    }

    // Si no tenemos proceso en ejecución y hay procesos en la cola de listos, tomamos el siguiente
    if (!currentRunningProcess && currentState.readyQueue.length > 0) {
      currentRunningProcess = currentState.readyQueue.shift()!;
      currentRunningProcess.state = "running";

      // Actualizamos el proceso en la lista de procesos
      const originalProcess = currentState.processes.find(
        (p) => p.pid === currentRunningProcess!.pid
      );
      if (originalProcess) {
        originalProcess.state = "running";
      }

      currentState.runningProcess = cloneProcess(currentRunningProcess);
      currentState.events.push(
        `Ejecutando proceso ${currentRunningProcess.name} (PID: ${currentRunningProcess.pid})`
      );

      // Reseteamos el contador de quantum para el nuevo proceso a 0
      // Para que en el próximo incremento sea 1 y ejecute el quantum completo
      quantumCounter = 0;
    }

    // Verificamos si la simulación ha terminado
    if (
      currentState.waitingQueue.length === 0 &&
      currentState.readyQueue.length === 0 &&
      !currentRunningProcess
    ) {
      isSimulationComplete = true;
      currentState.events.push(
        "Simulación completada. Todos los procesos han terminado."
      );
    }

    // Guardamos el estado actual
    systemStates.push({
      ...currentState,
      processes: currentState.processes.map((p) => cloneProcess(p)),
      readyQueue: currentState.readyQueue.map((p) => cloneProcess(p)),
      waitingQueue: currentState.waitingQueue.map((p) => cloneProcess(p)),
      finishedProcesses: currentState.finishedProcesses.map((p) =>
        cloneProcess(p)
      ),
      runningProcess: currentState.runningProcess
        ? cloneProcess(currentState.runningProcess)
        : null,
    });

    // Salida de seguridad
    if (time > 1000) {
      currentState.events.push("Simulación abortada: demasiados ciclos");
      break;
    }
  }

  return systemStates;
}
