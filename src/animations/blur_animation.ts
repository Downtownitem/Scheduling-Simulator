export const blurAnimationVariants = {
  hidden: {
    opacity: 0,
    filter: "blur(6px)",
  },
  visible: (initial_delay: number = 0) => {
    return {
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: initial_delay, duration: 1 },
    };
  },
  exit: {
    opacity: 0,
    filter: "blur(6px)",
    transition: { duration: 0.2 },
  },
};
