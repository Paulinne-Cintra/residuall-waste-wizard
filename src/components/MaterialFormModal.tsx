
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSuppliers } from '@/hooks/useSuppliers';
import { useProjects } from '@/hooks/useProjects';
import { Plus } from 'lucide-react';

interface MaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
  projectId: string;
}

const materialTypes = [
  'Alvenaria',
  'Argamassa',
  'Agregado',
  'Acabamento',
  'Estrutural',
  'Hidráulico',
  'Elétrico',
  'Madeira',
  'Metal',
  'Tintas',
  'Outros'
];

const units = [
  'Unidade',
  'Metro (m)',
  'Metro² (m²)',
  'Metro³ (m³)',
  'Quilograma (kg)',
  'Tonelada (t)',
  'Litro (l)',
  'Saco',
  'Lata',
  'Galão',
  'Rolo',
  'Peça'
];

const MaterialFormModal: React.FC<MaterialFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { suppliers, createSupplier } = useSuppliers();
  const { projects } = useProjects();
  
  const [formData, setFormData] = useState({
    material_type_name: '',
    estimated_quantity: '',
    unit_of_measurement: '',
    cost_per_unit: '',
    stock_quantity: '',
    minimum_quantity: '',
    category: '',
    supplier_id: '',
    project_id: '',
    dimensions_specs: ''
  });
  
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_email: '',
    contact_phone: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSupplier = async () => {
    if (!newSupplier.name.trim()) return;
    
    const supplier = await createSupplier({
      name: newSupplier.name,
      contact_email: newSupplier.contact_email || null,
      contact_phone: newSupplier.contact_phone || null,
      address: null
    });
    
    if (supplier) {
      setFormData(prev => ({ ...prev, supplier_id: supplier.id }));
      setNewSupplier({ name: '', contact_email: '', contact_phone: '' });
      setShowNewSupplierForm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await onSubmit({
        material_type_name: formData.material_type_name,
        estimated_quantity: parseFloat(formData.estimated_quantity),
        unit_of_measurement: formData.unit_of_measurement,
        cost_per_unit: parseFloat(formData.cost_per_unit),
        stock_quantity: parseFloat(formData.stock_quantity),
        minimum_quantity: parseFloat(formData.minimum_quantity),
        category: formData.category,
        supplier_id: formData.supplier_id,
        project_id: formData.project_id,
        dimensions_specs: formData.dimensions_specs || undefined
      });
      
      if (success) {
        // Reset form
        setFormData({
          material_type_name: '',
          estimated_quantity: '',
          unit_of_measurement: '',
          cost_per_unit: '',
          stock_quantity: '',
          minimum_quantity: '',
          category: '',
          supplier_id: '',
          project_id: '',
          dimensions_specs: ''
        });
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const activeProjects = projects.filter(p => !p.arquivado);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Material</DialogTitle>
          <DialogDescription>
            Preencha os dados do material que será adicionado ao projeto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Material */}
          <div className="space-y-2">
            <Label htmlFor="material_name">Nome do Material *</Label>
            <Input
              id="material_name"
              value={formData.material_type_name}
              onChange={(e) => handleInputChange('material_type_name', e.target.value)}
              placeholder="Ex: Tijolo Cerâmico"
              required
            />
          </div>

          {/* Tipo/Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Tipo/Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantidade e Unidade */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                value={formData.estimated_quantity}
                onChange={(e) => handleInputChange('estimated_quantity', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade de Medida *</Label>
              <Select value={formData.unit_of_measurement} onValueChange={(value) => handleInputChange('unit_of_measurement', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custo e Estoque */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Custo por Unidade (R$) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost_per_unit}
                onChange={(e) => handleInputChange('cost_per_unit', e.target.value)}
                placeholder="0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Quantidade em Estoque</Label>
              <Input
                id="stock"
                type="number"
                step="0.01"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Quantidade Mínima */}
          <div className="space-y-2">
            <Label htmlFor="minimum">Quantidade Mínima em Estoque</Label>
            <Input
              id="minimum"
              type="number"
              step="0.01"
              value={formData.minimum_quantity}
              onChange={(e) => handleInputChange('minimum_quantity', e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Fornecedor */}
          <div className="space-y-2">
            <Label htmlFor="supplier">Fornecedor *</Label>
            <div className="flex gap-2">
              <Select value={formData.supplier_id} onValueChange={(value) => handleInputChange('supplier_id', value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowNewSupplierForm(!showNewSupplierForm)}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {/* Formulário de Novo Fornecedor */}
          {showNewSupplierForm && (
            <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <h4 className="font-medium">Novo Fornecedor</h4>
              <div className="space-y-2">
                <Label htmlFor="supplier_name">Nome *</Label>
                <Input
                  id="supplier_name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do fornecedor"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="supplier_email">Email</Label>
                  <Input
                    id="supplier_email"
                    type="email"
                    value={newSupplier.contact_email}
                    onChange={(e) => setNewSupplier(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier_phone">Telefone</Label>
                  <Input
                    id="supplier_phone"
                    value={newSupplier.contact_phone}
                    onChange={(e) => setNewSupplier(prev => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <Button type="button" onClick={handleCreateSupplier} className="w-full">
                Adicionar Fornecedor
              </Button>
            </div>
          )}

          {/* Projeto */}
          <div className="space-y-2">
            <Label htmlFor="project">Projeto *</Label>
            <Select value={formData.project_id} onValueChange={(value) => handleInputChange('project_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o projeto" />
              </SelectTrigger>
              <SelectContent>
                {activeProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Especificações */}
          <div className="space-y-2">
            <Label htmlFor="specs">Especificações/Dimensões</Label>
            <Textarea
              id="specs"
              value={formData.dimensions_specs}
              onChange={(e) => handleInputChange('dimensions_specs', e.target.value)}
              placeholder="Ex: 20x10x5cm, resistência 2.5MPa"
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-residuall-green hover:bg-residuall-green/90">
              {loading ? 'Cadastrando...' : 'Cadastrar Material'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialFormModal;
