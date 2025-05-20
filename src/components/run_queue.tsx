import { Card, CardBody, CardHeader } from "@heroui/react";
import { ProcessInterface } from "../logic/processes";
import { StackIcon } from "../utils/icons";

interface RunQueueProps {
  queue: ProcessInterface[];
}

export default function RunQueue({ queue }: RunQueueProps) {
  return (
    <Card className="flex-grow flex flex-col gap-5 p-5">
      <CardHeader className="flex items-center gap-2 p-0 text-black/40">
        <StackIcon className="size-5" />
        <h2 className="font-medium">Cola de ejecución</h2>
      </CardHeader>
      <CardBody className="p-0">
        {queue.map((process, index) => (
          <Card key={`${process.pid}-${index}`} className="w-32 flex-none">
            <CardBody className="p-2 text-xs">
              <div className="font-semibold">{process.name}</div>
              <div>PID: {process.pid}</div>
              <div className="mt-1">
                {process.currentExecution}/{process.executionTime}
              </div>
              <div className="text-xs mt-1">Timeout: {process.timeout}</div>
            </CardBody>
          </Card>
        ))}
        {queue.length === 0 && (
          <div className="text-sm text-gray-500 p-2">
            Cola de ejecución vacía
          </div>
        )}
      </CardBody>
    </Card>
  );
}
