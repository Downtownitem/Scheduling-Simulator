import React, { useEffect, useState } from "react";

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className = "",
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>(
    []
  );

  useEffect(() => {
    const styles = Array.from({ length: number }).map(() => ({
      "--angle": `${-angle}deg`,
      top: `${Math.floor(Math.random() * 30)}%`,
      left: `${Math.floor(Math.random() * 100)}%`,
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + "s",
      animationDuration:
        Math.random() * (maxDuration - minDuration) + minDuration + "s",
    }));
    setMeteorStyles(styles);
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          style={style as React.CSSProperties}
          className={
            "absolute size-0.5 rotate-[var(--angle)] animate-meteor rounded-full bg-white opacity-70 shadow-[0_0_6px_2px_#ffffff30] " +
            className
          }
        >
          <div className="absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-white to-transparent" />
        </span>
      ))}
    </div>
  );
};
