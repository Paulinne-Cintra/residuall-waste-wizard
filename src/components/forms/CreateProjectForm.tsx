
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useProjects } from '@/hooks/useProjects';
import { Plus, Trash2 } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  description_notes: z.string().optional(),
  location: z.string().optional(),
  project_type: z.string().min(1, 'Tipo do projeto é obrigatório'),
  start_date: z.string().optional(),
  planned_end_date: z.string().optional(),
  budget: z.string().optional(),
  responsible_team_contacts: z.string().optional(),
  dimensions_details: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Material {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  cost: string;
  category: string;
}

const STORAGE_KEY = 'createProject_formData';

const CreateProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createProject, loading } = useProjects();
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: '', quantity: '', unit: '', cost: '', category: '' }
  ]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description_notes: '',
      location: '',
      project_type: '',
      start_date: '',
      planned_end_date: '',
      budget: '',
      responsible_team_contacts: '',
      dimensions_details: '',
    }
  });

  // Observar mudanças no formulário para persistência
  const watchedFields = watch();

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const { formData, materialsData } = JSON.parse(savedData);
        
        // Restaurar dados do formulário
        Object.keys(formData).forEach(key => {
          if (formData[key]) {
            setValue(key as keyof ProjectFormData, formData[key]);
          }
        });

        // Restaurar materiais
        if (materialsData && materialsData.length > 0) {
          setMaterials(materialsData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      }
    }
  }, [setValue]);

  // Salvar dados no localStorage quando houver mudanças
  useEffect(() => {
    const dataToSave = {
      formData: watchedFields,
      materialsData: materials
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [watchedFields, materials]);

  const addMaterial = () => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
      unit: '',
      cost: '',
      category: ''
    };
    setMaterials([...materials, newMaterial]);
  };

  const removeMaterial = (id: string) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(material => material.id !== id));
    }
  };

  const updateMaterial = (id: string, field: keyof Material, value: string) => {
    setMaterials(materials.map(material =>
      material.id === id ? { ...material, [field]: value } : material
    ));
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData = {
        ...data,
        budget: data.budget ? parseFloat(data.budget) : null,
        start_date: data.start_date || null,
        planned_end_date: data.planned_end_date || null,
      };

      const success = await createProject(projectData);
      
      if (success) {
        // Limpar dados salvos após sucesso
        localStorage.removeItem(STORAGE_KEY);
        
        toast({
          title: "Projeto criado com sucesso!",
          description: "Seu projeto foi cadastrado e você pode começar a adicionar materiais.",
        });
        navigate('/dashboard/projetos');
      }
    } catch (error) {
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const clearForm = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Projeto</CardTitle>
          <CardDescription>
            Preencha os dados básicos do seu novo projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome do projeto"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_type">Tipo do Projeto *</Label>
                <Select onValueChange={(value) => setValue('project_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residencial">Residencial</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="reforma">Reforma</SelectItem>
                  </SelectContent>
                </Select>
                {errors.project_type && (
                  <p className="text-sm text-red-600">{errors.project_type.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                placeholder="Cidade, Estado"
                {...register('location')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_notes">Descrição</Label>
              <Textarea
                id="description_notes"
                placeholder="Descreva o projeto, objetivos e características principais"
                rows={4}
                {...register('description_notes')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Data de Início</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="planned_end_date">Data Prevista de Conclusão</Label>
                <Input
                  id="planned_end_date"
                  type="date"
                  {...register('planned_end_date')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  {...register('budget')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsible_team_contacts">Responsável/Equipe</Label>
                <Input
                  id="responsible_team_contacts"
                  placeholder="Nome do responsável ou equipe"
                  {...register('responsible_team_contacts')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions_details">Detalhes das Dimensões</Label>
              <Textarea
                id="dimensions_details"
                placeholder="Área total, número de pavimentos, especificações técnicas"
                rows={3}
                {...register('dimensions_details')}
              />
            </div>

            {/* Seção de Materiais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Materiais do Projeto</CardTitle>
                <CardDescription>
                  Adicione os materiais que serão utilizados neste projeto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {materials.map((material, index) => (
                  <div key={material.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Material {index + 1}</h4>
                      {materials.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(material.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Nome do Material</Label>
                        <Input
                          placeholder="Ex: Tijolo cerâmico"
                          value={material.name}
                          onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(material.id, 'quantity', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Unidade</Label>
                        <Select 
                          value={material.unit}
                          onValueChange={(value) => updateMaterial(material.id, 'unit', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unidade">Unidade</SelectItem>
                            <SelectItem value="kg">Quilograma (kg)</SelectItem>
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
                        <Label>Categoria</Label>
                        <Select 
                          value={material.category}
                          onValueChange={(value) => updateMaterial(material.id, 'category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
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
                        <Label>Custo Unitário (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={material.cost}
                          onChange={(e) => updateMaterial(material.id, 'cost', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addMaterial}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar mais materiais
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={clearForm}
              >
                Limpar Formulário
              </Button>

              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/projetos')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-residuall-green hover:bg-residuall-green/90"
                >
                  {loading ? 'Criando...' : 'Criar Projeto'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectForm;
