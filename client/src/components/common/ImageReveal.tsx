// src/components/common/ImageReveal.tsx

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
};

const ImageReveal = ({
  children,
  className = "",
}: ImageRevealProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 1.06,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={{
        once: false,
        amount: 0.2,
      }}
      transition={{
        duration: 1.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ImageReveal;