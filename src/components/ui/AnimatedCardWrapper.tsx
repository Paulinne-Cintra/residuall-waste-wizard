// src/components/AnimatedCardWrapper.tsx
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardWrapperProps {
  children: ReactNode;
  delay?: number; // Atraso para a animação deste item específico
  // Adicionar props para controlar o comportamento da animação, se necessário
  animateOnView?: boolean; // Nova prop para ativar a animação ao entrar na view
}

const AnimatedCardWrapper: React.FC<AnimatedCardWrapperProps> = ({ children, delay = 0, animateOnView = true }) => {
  // Define as variantes para a animação de entrada
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={variants} // Usa as variantes
      initial="hidden"    // Começa no estado 'hidden'
      animate="visible"   // Anima para o estado 'visible'
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}

      // Se animateOnView for true, a animação será acionada quando estiver na viewport
      {...(animateOnView && {
        whileInView: "visible", // Anima para 'visible' quando na viewport
        viewport: { once: true, amount: 0.5 }, // Apenas uma vez e quando 50% visível
      })}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCardWrapper;
