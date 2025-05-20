import { useEffect, useRef } from "react";
import { HistoryEntry } from "../logic/operating_system";

interface HistoryProps {
  history: HistoryEntry[];
}

export default function History({ history }: HistoryProps) {
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  return (
    <div className="h-36 overflow-y-auto bg-gray-50 p-2 rounded text-xs">
      {history.map((entry, index) => (
        <div key={index} className="mb-1">
          <span className="text-gray-400">[{entry.time}]</span> {entry.event}
        </div>
      ))}
      <div ref={historyEndRef} />
    </div>
  );
}
