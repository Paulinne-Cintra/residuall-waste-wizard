// src/components/AnimatedCardWrapper.tsx
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardWrapperProps {
  children: ReactNode;
  delay?: number; // Atraso para a animação deste item específico
}

const AnimatedCardWrapper: React.FC<AnimatedCardWrapperProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Estado inicial: invisível e 50px abaixo
      animate={{ opacity: 1, y: 0 }}   // Estado final: visível e na posição original
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }} // Duração, atraso e tipo de easing
      // whileInView={{ opacity: 1, y: 0 }} // Descomente esta linha se quiser que a animação dispare ao scroll
      // viewport={{ once: true, amount: 0.5 }} // Configuração do viewport para whileInView
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCardWrapper;
