
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { File, Trash2, Filter, Calendar, ChevronDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const ArquivadosPage = () => {
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState('Tipo');
  const [dateFilter, setDateFilter] = useState('Data');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    console.log('Busca projetos, relatórios...:', value);
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-residuall-gray-dark">Itens Arquivados</h1>
        <p className="text-residuall-gray">Gerencie itens arquivados e restaure quando necessário</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-4 items-center justify-between p-4">
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  <span>{typeFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTypeFilter('Todos')}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Projeto')}>Projeto</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Relatório')}>Relatório</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTypeFilter('Material')}>Material</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{dateFilter}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setDateFilter('Última semana')}>Última semana</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('Último mês')}>Último mês</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('Último trimestre')}>Último trimestre</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDateFilter('Último ano')}>Último ano</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div>
            <Input
              type="text"
              placeholder="Buscar projetos, relatórios..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-residuall-green focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

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
