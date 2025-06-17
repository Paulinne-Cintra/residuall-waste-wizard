
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, MapPin, Calendar, Users, FileText, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';
import { useFormPersistence } from '@/hooks/useFormPersistence';

const projectSchema = z.object({
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  location: z.string().min(1, 'Localização é obrigatória'),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  planned_end_date: z.string().min(1, 'Data prevista de término é obrigatória'),
  responsible_team_contacts: z.string().optional(),
  stage: z.enum(['planejamento', 'em_andamento', 'pausado', 'concluido']),
  materials: z.array(z.object({
    name: z.string().min(1, 'Nome do material é obrigatório'),
    quantity: z.number().min(0.01, 'Quantidade deve ser maior que 0'),
    unit: z.string().min(1, 'Unidade é obrigatória'),
    supplier: z.string().optional(),
    cost_per_unit: z.number().min(0, 'Custo deve ser maior ou igual a 0'),
  })),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Material {
  name: string;
  quantity: number;
  unit: string;
  supplier: string;
  cost_per_unit: number;
}

const STORAGE_KEY = 'create-project-form';

const CreateProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addProject } = useProjects();

  // Clear form data when accessing the form for a new project
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/projetos/novo')) {
      // Clear any existing form data
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem('editing-project-id');
      sessionStorage.removeItem('hasUnsavedData');
    }
  }, []);

  const defaultValues: ProjectFormData = {
    name: '',
    description: '',
    location: '',
    start_date: '',
    planned_end_date: '',
    responsible_team_contacts: '',
    stage: 'planejamento',
    materials: [] // Start with empty array
  };

  const { 
    formData, 
    updateFormData, 
    clearFormData, 
    markDataAsSaved,
    isLoading
  } = useFormPersistence<ProjectFormData>({
    key: STORAGE_KEY,
    defaultValues,
    storage: 'sessionStorage',
    debounceMs: 300
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: formData
  });

  // Sync form with persisted data
  useEffect(() => {
    if (!isLoading && formData) {
      Object.keys(formData).forEach((key) => {
        setValue(key as keyof ProjectFormData, formData[key as keyof ProjectFormData]);
      });
    }
  }, [formData, setValue, isLoading]);

  // Watch form changes and persist
  const watchedValues = watch();
  useEffect(() => {
    if (!isLoading) {
      updateFormData(watchedValues);
    }
  }, [watchedValues, updateFormData, isLoading]);

  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    if (formData.materials) {
      // Ensure all material properties are defined
      const validMaterials = formData.materials.map(material => ({
        name: material.name || '',
        quantity: material.quantity || 0,
        unit: material.unit || '',
        supplier: material.supplier || '',
        cost_per_unit: material.cost_per_unit || 0,
      }));
      setMaterials(validMaterials);
    }
  }, [formData.materials]);

  const addMaterial = () => {
    const newMaterial: Material = {
      name: '',
      quantity: 0,
      unit: '',
      supplier: '',
      cost_per_unit: 0,
    };
    const updatedMaterials = [...materials, newMaterial];
    setMaterials(updatedMaterials);
    updateFormData({ ...formData, materials: updatedMaterials });
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = materials.filter((_, i) => i !== index);
    setMaterials(updatedMaterials);
    updateFormData({ ...formData, materials: updatedMaterials });
  };

  const updateMaterial = (index: number, field: keyof Material, value: string | number) => {
    const updatedMaterials = materials.map((material, i) => 
      i === index ? { ...material, [field]: value } : material
    );
    setMaterials(updatedMaterials);
    updateFormData({ ...formData, materials: updatedMaterials });
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData = {
        ...data,
        materials: materials.filter(m => m.name.trim() !== ''), // Filter empty materials
        start_date: new Date(data.start_date).toISOString(),
        planned_end_date: new Date(data.planned_end_date).toISOString(),
      };

      await addProject(projectData);
      
      // Mark data as saved and clear
      markDataAsSaved();
      clearFormData();
      
      toast({
        title: "Projeto criado com sucesso!",
        description: "O projeto foi adicionado ao sistema.",
      });
      
      navigate('/dashboard/projetos');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Houve um problema ao salvar o projeto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleClearForm = () => {
    const confirmClear = window.confirm('Tem certeza que deseja limpar todos os dados do formulário?');
    if (confirmClear) {
      clearFormData();
      reset(defaultValues);
      setMaterials([]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-residuall-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Criar Novo Projeto</h2>
          <p className="text-gray-600">Preencha os detalhes do seu projeto de construção</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleClearForm}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          Limpar Formulário
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Projeto *
              </label>
              <Input
                {...register('name')}
                placeholder="Ex: Residencial Green Valley"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <Textarea
                {...register('description')}
                placeholder="Descreva o projeto, seus objetivos e características principais..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  {...register('location')}
                  placeholder="Ex: São Paulo, SP - Zona Sul"
                  className={`pl-10 ${errors.location ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.location && (
                <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cronograma */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Cronograma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <Input
                  type="date"
                  {...register('start_date')}
                  className={errors.start_date ? 'border-red-500' : ''}
                />
                {errors.start_date && (
                  <p className="text-sm text-red-600 mt-1">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Prevista de Término *
                </label>
                <Input
                  type="date"
                  {...register('planned_end_date')}
                  className={errors.planned_end_date ? 'border-red-500' : ''}
                />
                {errors.planned_end_date && (
                  <p className="text-sm text-red-600 mt-1">{errors.planned_end_date.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Inicial
              </label>
              <Select defaultValue="planejamento" onValueChange={(value) => setValue('stage', value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planejamento">Planejamento</SelectItem>
                  <SelectItem value="em_andamento">Em Andamento</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Equipe Responsável */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Equipe Responsável
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contatos da Equipe
              </label>
              <Textarea
                {...register('responsible_team_contacts')}
                placeholder="Ex: João Silva (Engenheiro) - joao@email.com, Maria Santos (Arquiteta) - maria@email.com"
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                Liste os principais responsáveis e seus contatos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Materiais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Materiais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {materials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum material adicionado ainda</p>
                <p className="text-sm">Clique no botão abaixo para adicionar materiais</p>
              </div>
            ) : (
              materials.map((material, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Material {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMaterial(index)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Material *
                      </label>
                      <Input
                        value={material.name}
                        onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                        placeholder="Ex: Cimento Portland"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantidade *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={material.quantity}
                        onChange={(e) => updateMaterial(index, 'quantity', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unidade *
                      </label>
                      <Input
                        value={material.unit}
                        onChange={(e) => updateMaterial(index, 'unit', e.target.value)}
                        placeholder="Ex: kg, m³, unidade"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fornecedor
                      </label>
                      <Input
                        value={material.supplier}
                        onChange={(e) => updateMaterial(index, 'supplier', e.target.value)}
                        placeholder="Nome do fornecedor"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Custo por Unidade (R$)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={material.cost_per_unit}
                        onChange={(e) => updateMaterial(index, 'cost_per_unit', parseFloat(e.target.value) || 0)}
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={addMaterial}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Material
            </Button>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 pt-6">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Criando...' : 'Criar Projeto'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/dashboard/projetos')}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
