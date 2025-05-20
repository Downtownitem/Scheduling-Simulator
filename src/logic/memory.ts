import { OperatingSystemInterface } from "./operating_system";

export interface MemoryStatus {
  total: number;
  used: number;
  available: number;
}

export const getMemoryStatus = (os: OperatingSystemInterface): MemoryStatus => {
  return {
    total: os.totalMemory,
    used: os.totalMemory - os.availableMemory,
    available: os.availableMemory,
  };
};
