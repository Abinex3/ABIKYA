// src/components/common/Reveal.tsx

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
};

const Reveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) => {
  const initialPosition = {
    up: { y: 45, x: 0 },
    left: { x: -45, y: 0 },
    right: { x: 45, y: 0 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...initialPosition[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: false,
        amount: 0.2,
      }}
      transition={{
        duration: 0.85,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;