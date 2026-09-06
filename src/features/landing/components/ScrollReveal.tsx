import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

type RevealDirection = "up" | "down" | "left" | "right" | "none";

interface ScrollRevealProps {
  children: ReactNode;
  /** Direction the element slides in from. Default: "up" */
  direction?: RevealDirection;
  /** Delay before animation starts (seconds). Default: 0 */
  delay?: number;
  /** Animation duration (seconds). Default: 0.6 */
  duration?: number;
  /** Distance in pixels the element travels. Default: 40 */
  distance?: number;
  /** Viewport threshold to trigger (0–1). Default: 0.15 */
  threshold?: number;
  /** Whether to animate only once. Default: true */
  once?: boolean;
  /** Additional className on the wrapper */
  className?: string;
}

const getVariants = (direction: RevealDirection, distance: number): Variants => {
  const offsets: Record<RevealDirection, { x: number; y: number }> = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
    none: { x: 0, y: 0 },
  };

  const { x, y } = offsets[direction];

  return {
    hidden: { opacity: 0, x, y, filter: "blur(6px)" },
    visible: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
  };
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 40,
  threshold = 0.15,
  once = true,
  className = "",
}: ScrollRevealProps) {
  return (
    <motion.div
      variants={getVariants(direction, distance)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container — wrap multiple ScrollReveal children
 * to animate them one after another.
 */
interface StaggerContainerProps {
  children: ReactNode;
  /** Delay between each child (seconds). Default: 0.1 */
  stagger?: number;
  /** Additional className */
  className?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: {
      staggerChildren: stagger,
    },
  }),
};

export function StaggerContainer({
  children,
  stagger = 0.1,
  className = "",
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      custom={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}
