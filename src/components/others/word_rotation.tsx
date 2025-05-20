import { AnimatePresence, motion, MotionProps } from "motion/react";
import { useEffect, useState } from "react";

interface WordColor {
  text: string;
  color: string;
}

interface WordRotateProps {
  items: WordColor[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
}

export function WordRotate({
  items,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, duration);

    return () => clearInterval(interval);
  }, [items, duration]);

  const current = items[index];

  return (
    <div className="overflow-hidden py-2">
      <AnimatePresence mode="wait">
        <motion.h1
          key={current.text + index}
          className={className}
          style={{ color: current.color }}
          {...motionProps}
        >
          {current.text}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
