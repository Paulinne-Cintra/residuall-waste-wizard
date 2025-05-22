// src/components/AnimatedNumber.tsx
import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  duration?: number; // Duração da animação do contador
  prefix?: string;   // Prefixo (ex: R$)
  suffix?: string;   // Sufixo (ex: %)
  decimals?: number; // Número de casas decimais
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1.5, // Duração padrão de 1.5 segundos
  prefix = "",
  suffix = "",
  decimals = 1, // Padrão para 1 casa decimal (como 2.5, 3.2, 1.3)
}) => {
  // `motionValue` representa o estado animado do número
  const count = useMotionValue(0);

  // `useTransform` formata o número para exibir o prefixo, sufixo e casas decimais
  const rounded = useTransform(count, latest => {
    // Formata o número para o número de casas decimais especificado
    return `${prefix}${latest.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    // Anima o `motionValue` de 0 para o `value` alvo
    const controls = animate(count, value, {
      duration: duration,
      ease: "easeOut",
    });

    // Retorna uma função de limpeza que interrompe a animação quando o componente é desmontado
    return controls.stop;
  }, [value, duration, count, decimals, prefix, suffix]); // Dependências do useEffect

  return <motion.span>{rounded}</motion.span>;
};

export default AnimatedNumber;
