// components/ui/AnimatedButton.tsx
import React from "react";
import { Loader2 } from 'lucide-react'; // Importe o ícone de carregamento

interface AnimatedButtonProps {
  label: string;
  onClick?: () => void;
  isLoading?: boolean; // Nova prop para indicar estado de carregamento
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ label, onClick, isLoading = false }) => {
  return (
    <button
      onClick={onClick}
      // As classes agora dependem do estado 'isLoading'
      className={`
        bg-green-600 text-white font-semibold py-2 px-4 rounded-xl
        transition-all duration-300
        ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700 transform hover:scale-105 shadow-md hover:shadow-lg'}
        flex items-center justify-center gap-2 // Para centralizar o ícone e o texto
      `}
      disabled={isLoading} // Desabilita o botão enquanto estiver carregando para evitar cliques múltiplos
    >
      {isLoading && <Loader2 size={20} className="animate-spin" />} {/* Mostra o ícone girando se isLoading for true */}
      {label}
    </button>
  );
};

export default AnimatedButton;
