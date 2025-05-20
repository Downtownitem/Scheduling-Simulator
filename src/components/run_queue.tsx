import { Card, CardBody, CardHeader, Tooltip, Badge } from "@heroui/react";
import { ProcessInterface } from "../logic/processes";
import { StackIcon } from "../utils/icons";
import { motion, AnimatePresence } from "framer-motion";

interface RunQueueProps {
  queue: ProcessInterface[];
}

export default function RunQueue({ queue }: RunQueueProps) {
  return (
    <Card className="flex-grow flex flex-col gap-5 p-5 relative overflow-hidden min-h-52">
      <CardHeader className="flex items-center justify-between p-0 text-black/40">
        <div className="flex items-center gap-2">
          <StackIcon className="size-5" />
          <h2 className="font-medium">Cola de ejecución</h2>
        </div>
        {queue.length > 0 && (
          <Badge color="primary" variant="flat" size="sm">
            {queue.length} {queue.length === 1 ? "proceso" : "procesos"}
          </Badge>
        )}
      </CardHeader>
      <CardBody className="p-0 flex-grow">
        {/* Contenedor principal sin overflow - solo para mantener la estructura */}
        <div className="relative w-full h-full">
          {/* Contenedor de desplazamiento horizontal único */}
          <div className="absolute inset-0 overflow-x-auto overflow-y-hidden pb-4 pt-2 px-1 no-scrollbar">
            {/* Contenedor de tarjetas con distancia entre ellas */}
            <div className="flex gap-4 min-w-full">
              {queue.filter((process) => process.state !== "finished").length >
              0 ? (
                queue
                  .filter((process) => process.state !== "finished")
                  .map((process, index) => (
                    <Tooltip
                      key={`${process.pid}-${index}`}
                      content={
                        <div className="py-1 px-2">
                          <div className="font-semibold">{process.name}</div>
                          <div>PID: {process.pid}</div>
                          <div>
                            Progreso: {process.currentExecution}/
                            {process.executionTime}
                          </div>
                          <div>Memoria: {process.memoryRequired} MB</div>
                          {process.timeout > 0 && (
                            <div>Timeout: {process.timeout}</div>
                          )}
                        </div>
                      }
                      placement="bottom"
                      delay={500}
                    >
                      <div className="my-1">
                        <motion.div
                          layout="position"
                          initial={{ opacity: 0, x: -20, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 20, scale: 0.9 }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                            mass: 0.5,
                            delay: index * 0.05,
                          }}
                        >
                          <Card
                            className={`w-36 flex-none border-2 ${
                              index === 0
                                ? "border-primary-400"
                                : "border-transparent"
                            }`}
                            shadow={index === 0 ? "md" : "sm"}
                          >
                            <CardBody className="p-2 text-xs flex flex-col justify-between">
                              <div>
                                <div
                                  className="font-semibold truncate"
                                  title={process.name}
                                >
                                  {process.name}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-tiny">
                                    PID: {process.pid}
                                  </span>
                                  {process.timeout > 0 && (
                                    <motion.div
                                      initial={{ scale: 0.9 }}
                                      animate={{ scale: 1 }}
                                      transition={{
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        duration: 1,
                                      }}
                                    >
                                      <Badge
                                        color="warning"
                                        variant="flat"
                                        className="text-tiny py-0 px-1"
                                      >
                                        T: {process.timeout}
                                      </Badge>
                                    </motion.div>
                                  )}
                                </div>
                              </div>

                              <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <motion.div
                                    className="bg-primary h-1.5 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${
                                        (process.currentExecution /
                                          process.executionTime) *
                                        100
                                      }%`,
                                    }}
                                    transition={{
                                      duration: 0.5,
                                      ease: "easeOut",
                                    }}
                                  />
                                </div>
                                <div className="text-tiny text-gray-500 text-right mt-1">
                                  {process.currentExecution}/
                                  {process.executionTime}
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      </div>
                    </Tooltip>
                  ))
              ) : (
                <p className="text-gray-400 p-4 text-center flex items-center justify-center w-full min-h-24">
                  Cola de ejecución vacía
                </p>
              )}
            </div>
          </div>

          {/* Indicadores de scroll */}
          {queue.length > 4 && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white to-transparent w-6 h-full pointer-events-none z-10" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white to-transparent w-6 h-full pointer-events-none z-10" />
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
