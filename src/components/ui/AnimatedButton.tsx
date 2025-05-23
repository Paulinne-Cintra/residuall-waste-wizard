
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface AnimatedButtonProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  onClick,
  isLoading = false,
  variant = "default"
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Button 
        onClick={onClick} 
        disabled={isLoading}
        variant={variant}
      >
        {label}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
