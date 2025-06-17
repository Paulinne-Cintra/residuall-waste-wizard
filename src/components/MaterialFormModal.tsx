
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from '@/hooks/useProjects';
import { useFormPersistence } from '@/hooks/useFormPersistence';

interface MaterialFormData {
  material_type_name: string;
  project_id: string;
  estimated_quantity: string;
  unit_of_measurement: string;
  cost_per_unit: string;
  category: string;
  dimensions_specs: string;
  stock_quantity: string;
  minimum_quantity: string;
}

interface MaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
}

const MaterialFormModal: React.FC<MaterialFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { projects } = useProjects();
  const [loading, setLoading] = useState(false);

  const { formData, updateFormData, clearFormData, setFormData } = useFormPersistence<MaterialFormData>({
    key: 'materialForm_data',
    defaultValues: {
      material_type_name: '',
      project_id: '',
      estimated_quantity: '',
      unit_of_measurement: '',
      cost_per_unit: '',
      category: '',
      dimensions_specs: '',
      stock_quantity: '',
      minimum_quantity: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const materialData = {
        material_type_name: formData.material_type_name,
        project_id: formData.project_id,
        estimated_quantity: formData.estimated_quantity ? parseFloat(formData.estimated_quantity) : null,
        unit_of_measurement: formData.unit_of_measurement || null,
        cost_per_unit: formData.cost_per_unit ? parseFloat(formData.cost_per_unit) : null,
        category: formData.category || null,
        dimensions_specs: formData.dimensions_specs || null,
        stock_quantity: formData.stock_quantity ? parseFloat(formData.stock_quantity) : 0,
        minimum_quantity: formData.minimum_quantity ? parseFloat(formData.minimum_quantity) : 0
      };

      const success = await onSubmit(materialData);
      
      if (success) {
        // Limpar dados do formulário após sucesso
        clearFormData();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof MaterialFormData, value: string) => {
    updateFormData({
      [field]: value
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Material</DialogTitle>
          <DialogDescription>
            Preencha as informações do material que será adicionado ao projeto
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material_name">Nome do Material *</Label>
              <Input
                id="material_name"
                placeholder="Ex: Cimento Portland"
                value={formData.material_type_name}
                onChange={(e) => handleInputChange('material_type_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_id">Projeto *</Label>
              <Select 
                value={formData.project_id} 
                onValueChange={(value) => handleInputChange('project_id', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_quantity">Quantidade Estimada</Label>
              <Input
                id="estimated_quantity"
                type="number"
                step="0.01"
                placeholder="0"
                value={formData.estimated_quantity}
                onChange={(e) => handleInputChange('estimated_quantity', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit_of_measurement">Unidade de Medida</Label>
              <Select 
                value={formData.unit_of_measurement} 
                onValueChange={(value) => handleInputChange('unit_of_measurement', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Quilograma (kg)</SelectItem>
                  <SelectItem value="unidade">Unidade</SelectItem>
                  <SelectItem value="m">Metro (m)</SelectItem>
                  <SelectItem value="m2">Metro² (m²)</SelectItem>
                  <SelectItem value="m3">Metro³ (m³)</SelectItem>
                  <SelectItem value="litro">Litro (l)</SelectItem>
                  <SelectItem value="saco">Saco</SelectItem>
                  <SelectItem value="tonelada">Tonelada (t)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_per_unit">Custo por Unidade (R$)</Label>
              <Input
                id="cost_per_unit"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.cost_per_unit}
                onChange={(e) => handleInputChange('cost_per_unit', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alvenaria">Alvenaria</SelectItem>
                  <SelectItem value="estrutural">Estrutural</SelectItem>
                  <SelectItem value="acabamento">Acabamento</SelectItem>
                  <SelectItem value="hidraulico">Hidráulico</SelectItem>
                  <SelectItem value="eletrico">Elétrico</SelectItem>
                  <SelectItem value="madeira">Madeira</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="tintas">Tintas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Estoque Atual</Label>
              <Input
                id="stock_quantity"
                type="number"
                step="0.01"
                placeholder="0"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimum_quantity">Quantidade Mínima</Label>
              <Input
                id="minimum_quantity"
                type="number"
                step="0.01"
                placeholder="0"
                value={formData.minimum_quantity}
                onChange={(e) => handleInputChange('minimum_quantity', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions_specs">Especificações/Dimensões</Label>
            <Textarea
              id="dimensions_specs"
              placeholder="Descreva especificações técnicas, dimensões ou características especiais"
              rows={3}
              value={formData.dimensions_specs}
              onChange={(e) => handleInputChange('dimensions_specs', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.material_type_name || !formData.project_id}
              className="bg-residuall-green hover:bg-residuall-green/90"
            >
              {loading ? 'Adicionando...' : 'Adicionar Material'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialFormModal;
