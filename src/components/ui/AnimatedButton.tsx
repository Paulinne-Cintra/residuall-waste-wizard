// components/ui/AnimatedButton.tsx
import React from "react";

interface AnimatedButtonProps {
  label: string;
  onClick?: () => void;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
    >
      {label}
    </button>
  );
};

export default AnimatedButton;
