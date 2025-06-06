import { ProcessInterface } from "../logic/processes";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { DeleteIcon, ElectronicsIcon } from "../utils/icons";

interface ProcessListProps {
  processes: ProcessInterface[];
  removeProcess: (pid: number) => void;
}

export default function ProcessList({
  processes,
  removeProcess,
}: ProcessListProps) {
  return (
    <Card
      className="flex flex-col gap-5 p-5 flex-grow h-full"
      shadow="none"
      radius="lg"
    >
      <CardHeader className="flex items-center gap-2 p-0 text-black/40 shrink-0">
        <ElectronicsIcon className="size-5 " />
        <h2 className="font-medium">Procesos</h2>
      </CardHeader>
      <CardBody className="p-0 overflow-hidden flex flex-col">
        <div className="flex-grow overflow-hidden">
          <Table
            removeWrapper
            isHeaderSticky
            aria-label="Tabla de procesos"
            classNames={{
              base: "h-full max-h-full overflow-auto",
              wrapper: "min-h-[200px] max-h-full overflow-auto",
            }}
          >
            <TableHeader>
              <TableColumn>PID</TableColumn>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Estado</TableColumn>
              <TableColumn>Memoria</TableColumn>
              <TableColumn>Progreso</TableColumn>
              <TableColumn>Timeout</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody
              items={processes}
              emptyContent={"No hay procesos en el sistema"}
            >
              {(process) => (
                <TableRow key={process.pid} className="h-12">
                  <TableCell>{process.pid}</TableCell>
                  <TableCell>{process.name}</TableCell>
                  <TableCell>
                    <Chip
                      color={
                        process.state === "running"
                          ? "success"
                          : process.state === "finished"
                          ? "default"
                          : process.state === "ready"
                          ? "warning"
                          : "primary"
                      }
                      size="sm"
                      variant="flat"
                    >
                      {process.state === "running"
                        ? "Ejecutando"
                        : process.state === "finished"
                        ? "Terminado"
                        : process.state === "ready"
                        ? "En cola"
                        : "Esperando"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <p className="flex items-center gap-1">
                      {process.memoryRequired}{" "}
                      <span className="text-xs text-gray-500">MB</span>
                    </p>
                  </TableCell>
                  <TableCell>
                    <Progress
                      value={
                        (process.currentExecution / process.executionTime) * 100
                      }
                      size="sm"
                      color="primary"
                      className="max-w-md"
                    />
                    <div className="text-xs mt-1">
                      {process.currentExecution}/{process.executionTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="flex items-center gap-1">
                      {process.timeout}
                      <span className="text-xs text-gray-500">ms</span>
                    </p>
                  </TableCell>
                  <TableCell>
                    {process.state !== "finished" && (
                      <Button
                        color="danger"
                        variant="bordered"
                        size="sm"
                        onPress={() => removeProcess(process.pid)}
                        startContent={<DeleteIcon className="size-4" />}
                      >
                        Eliminar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
}
