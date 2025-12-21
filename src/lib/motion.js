export const motionTransition = {
  duration: 0.22,
  ease: "easeInOut",
};

export const motionPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
  softPulse: {
    // single “breath” only (no loop)
    initial: { opacity: 0.7 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export function reducedMotionProps(reduce, preset) {
  if (reduce) {
    return { initial: false, animate: false, exit: undefined, transition: { duration: 0 } };
  }
  return {
    ...preset,
    transition: motionTransition,
  };
}


