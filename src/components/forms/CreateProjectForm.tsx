
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Material {
  material_type_name: string;
  estimated_quantity: number;
  cost_per_unit: number;
  unit_of_measurement: string;
  category: string;
}

interface ProjectFormData {
  name: string;
  location: string;
  status: string;
  start_date: string;
  planned_end_date: string;
  budget: number;
  project_type: string;
  description_notes: string;
  responsible_team_contacts: string;
  dimensions_details: string;
}

const STORAGE_KEY = 'createProjectForm';

const CreateProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    location: '',
    status: 'planejamento',
    start_date: '',
    planned_end_date: '',
    budget: 0,
    project_type: '',
    description_notes: '',
    responsible_team_contacts: '',
    dimensions_details: ''
  });

  const [materials, setMaterials] = useState<Material[]>([]);

  // Limpar localStorage na montagem do componente
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleInputChange = (field: keyof ProjectFormData, value: string | number) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData: newFormData, materials }));
  };

  const addMaterial = () => {
    const newMaterial: Material = {
      material_type_name: '',
      estimated_quantity: 0,
      cost_per_unit: 0,
      unit_of_measurement: 'kg',
      category: ''
    };
    const newMaterials = [...materials, newMaterial];
    setMaterials(newMaterials);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, materials: newMaterials }));
  };

  const updateMaterial = (index: number, field: keyof Material, value: string | number) => {
    const newMaterials = materials.map((material, i) => 
      i === index ? { ...material, [field]: value } : material
    );
    setMaterials(newMaterials);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, materials: newMaterials }));
  };

  const removeMaterial = (index: number) => {
    const newMaterials = materials.filter((_, i) => i !== index);
    setMaterials(newMaterials);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, materials: newMaterials }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para criar um projeto.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome do projeto é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Criar o projeto
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            location: formData.location || null,
            status: formData.status,
            start_date: formData.start_date || null,
            planned_end_date: formData.planned_end_date || null,
            budget: formData.budget || null,
            project_type: formData.project_type || null,
            description_notes: formData.description_notes || null,
            responsible_team_contacts: formData.responsible_team_contacts || null,
            dimensions_details: formData.dimensions_details || null,
          }
        ])
        .select()
        .single();

      if (projectError) throw projectError;

      // Adicionar materiais se existirem
      if (materials.length > 0 && materials.some(m => m.material_type_name.trim())) {
        const materialsToInsert = materials
          .filter(material => material.material_type_name.trim())
          .map(material => ({
            project_id: project.id,
            material_type_name: material.material_type_name,
            estimated_quantity: material.estimated_quantity || 0,
            cost_per_unit: material.cost_per_unit || 0,
            unit_of_measurement: material.unit_of_measurement,
            category: material.category || null,
          }));

        const { error: materialsError } = await supabase
          .from('project_materials')
          .insert(materialsToInsert);

        if (materialsError) throw materialsError;
      }

      localStorage.removeItem(STORAGE_KEY);
      
      toast({
        title: "Projeto criado com sucesso!",
        description: `O projeto "${formData.name}" foi criado.`,
      });

      navigate('/dashboard/projetos');
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate('/dashboard/projetos');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados fundamentais do projeto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Edifício Residencial Centro"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status do Projeto</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="execução">Execução</SelectItem>
                    <SelectItem value="concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project_type">Tipo de Projeto</Label>
                <Input
                  id="project_type"
                  value={formData.project_type}
                  onChange={(e) => handleInputChange('project_type', e.target.value)}
                  placeholder="Ex: Residencial, Comercial, Industrial"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Data de Início</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="planned_end_date">Data Prevista de Conclusão</Label>
                <Input
                  id="planned_end_date"
                  type="date"
                  value={formData.planned_end_date}
                  onChange={(e) => handleInputChange('planned_end_date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="description_notes">Descrição do Projeto</Label>
              <Textarea
                id="description_notes"
                value={formData.description_notes}
                onChange={(e) => handleInputChange('description_notes', e.target.value)}
                placeholder="Descreva detalhes importantes do projeto..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="responsible_team_contacts">Responsáveis/Contatos</Label>
              <Input
                id="responsible_team_contacts"
                value={formData.responsible_team_contacts}
                onChange={(e) => handleInputChange('responsible_team_contacts', e.target.value)}
                placeholder="Ex: João Silva - Engenheiro (11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="dimensions_details">Detalhes de Dimensões</Label>
              <Textarea
                id="dimensions_details"
                value={formData.dimensions_details}
                onChange={(e) => handleInputChange('dimensions_details', e.target.value)}
                placeholder="Ex: Área total: 500m², 15 andares, 4 apartamentos por andar..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Materiais */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Materiais do Projeto</CardTitle>
                <CardDescription>Cadastre os materiais que serão utilizados</CardDescription>
              </div>
              <Button type="button" onClick={addMaterial} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Material
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {materials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum material adicionado.</p>
                <Button type="button" onClick={addMaterial} variant="outline" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Material
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {materials.map((material, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Material {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Nome do Material</Label>
                        <Input
                          value={material.material_type_name}
                          onChange={(e) => updateMaterial(index, 'material_type_name', e.target.value)}
                          placeholder="Ex: Concreto, Aço, Tijolos"
                        />
                      </div>
                      <div>
                        <Label>Quantidade Estimada</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={material.estimated_quantity || ''}
                          onChange={(e) => updateMaterial(index, 'estimated_quantity', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Unidade de Medida</Label>
                        <Select 
                          value={material.unit_of_measurement} 
                          onValueChange={(value) => updateMaterial(index, 'unit_of_measurement', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="m³">m³</SelectItem>
                            <SelectItem value="m²">m²</SelectItem>
                            <SelectItem value="ton">toneladas</SelectItem>
                            <SelectItem value="un">unidades</SelectItem>
                            <SelectItem value="sac">sacos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Custo por Unidade (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={material.cost_per_unit || ''}
                          onChange={(e) => updateMaterial(index, 'cost_per_unit', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Input
                          value={material.category}
                          onChange={(e) => updateMaterial(index, 'category', e.target.value)}
                          placeholder="Ex: Estrutural, Acabamento"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end">
          <Button type="button" onClick={handleCancel} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Criando...' : 'Criar Projeto'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
