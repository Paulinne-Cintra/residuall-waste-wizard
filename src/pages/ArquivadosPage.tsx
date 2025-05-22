
import React from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { File, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ArquivadosPage = () => {
  const { toast } = useToast();

  const handleRestore = (itemName: string) => {
    toast({
      title: "Sucesso!",
      description: `"${itemName}" restaurado com sucesso!`,
      duration: 3000,
    });
  };

  const handleDelete = (itemName: string) => {
    toast({
      title: "Excluído!",
      description: `"${itemName}" excluído permanentemente!`,
      duration: 3000,
      variant: "destructive",
    });
  };

  // Dados de exemplo para a tabela
  const archivedItems = [
    { id: '1', name: 'Projeto Alpha', type: 'Projeto', date: '15/01/2023' },
    { id: '2', name: 'Relatório Mensal Fev', type: 'Relatório', date: '28/02/2023' },
    { id: '3', name: 'Material X', type: 'Material', date: '10/03/2023' },
    { id: '4', name: 'Estudo de Viabilidade', type: 'Projeto', date: '22/04/2023' },
  ];

  return (
    <div className="flex-1 p-6 bg-residuall-gray-light">
      <DashboardHeader pageTitle="Itens Arquivados" />

      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-residuall-gray-dark">Lista de Itens Arquivados</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Item</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data de Arquivamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archivedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(item.name)}
                        className="flex items-center"
                      >
                        <File size={16} className="mr-1" /> Restaurar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 flex items-center"
                        onClick={() => handleDelete(item.name)}
                      >
                        <Trash2 size={16} className="mr-1" /> Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ArquivadosPage;
