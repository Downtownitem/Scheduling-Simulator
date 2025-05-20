import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { MemoryStatus } from "../logic/memory";
import { StorageIcon } from "../utils/icons";

interface MemoryBarProps {
  memory: MemoryStatus;
}

export default function MemoryBar({ memory }: MemoryBarProps) {
  const percentageUsed = (memory.used / memory.total) * 100;

  return (
    <Card className="flex flex-col gap-5 p-5" shadow="lg" radius="lg">
      <CardHeader className="flex items-center gap-2 p-0 text-black/40">
        <StorageIcon className="size-5" />
        <h2 className="font-medium">Memoria</h2>
      </CardHeader>
      <CardBody className="p-0">
        <Progress
          value={percentageUsed}
          color="primary"
          size="lg"
          showValueLabel={true}
          label={`${memory.used}MB usado de ${memory.total}MB`}
          classNames={{
            label: "text-xs",
            value: "text-xs",
          }}
        />
      </CardBody>
    </Card>
  );
}
