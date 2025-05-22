
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Check, AlertCircle, Info } from "lucide-react";

const ToastExample = () => {
  const showSuccessToast = () => {
    toast({
      title: "Sucesso!",
      description: "Operação realizada com sucesso",
      variant: "default",
      className: "bg-green-50 border-green-200 text-green-800",
      action: <Check className="h-4 w-4 text-green-600" />
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Erro!",
      description: "Ocorreu um erro ao processar a operação",
      variant: "destructive"
    });
  };

  const showInfoToast = () => {
    toast({
      title: "Informação",
      description: "Esta é uma mensagem informativa",
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-800",
      action: <Info className="h-4 w-4 text-blue-600" />
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        onClick={showSuccessToast}
        className="bg-green-600 hover:bg-green-700"
      >
        Mostrar Sucesso
      </Button>
      <Button
        onClick={showErrorToast}
        className="bg-red-600 hover:bg-red-700"
      >
        Mostrar Erro
      </Button>
      <Button
        onClick={showInfoToast}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Mostrar Informação
      </Button>
    </div>
  );
};

export default ToastExample;
