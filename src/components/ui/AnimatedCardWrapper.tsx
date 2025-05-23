
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardWrapperProps {
  children: ReactNode;
  delay?: number; 
  animateOnView?: boolean; 
}

const AnimatedCardWrapper: React.FC<AnimatedCardWrapperProps> = ({ 
  children, 
  delay = 0, 
  animateOnView = true 
}) => {
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      {...(animateOnView && {
        whileInView: "visible",
        viewport: { once: true, amount: 0.5 },
      })}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCardWrapper;
