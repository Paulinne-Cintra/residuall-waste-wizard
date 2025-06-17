
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import ProgressSteps from '@/components/ProgressSteps';

const STORAGE_KEY = 'residuall_create_project_form';

const projectSchema = z.object({
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  location: z.string().min(1, 'Localização é obrigatória'),
  description: z.string().optional(),
  stage: z.string().min(1, 'Estágio é obrigatório'),
  start_date: z.string().optional(),
  planned_end_date: z.string().optional(),
  responsible_team_contacts: z.string().optional(),
});

interface Material {
  name: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  supplier: string;
}

const CreateProjectForm = () => {
  const { addProject } = useProjects();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear localStorage on component mount
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      stage: '',
      start_date: '',
      planned_end_date: '',
      responsible_team_contacts: '',
    }
  });

  const addMaterial = () => {
    setMaterials([...materials, { 
      name: '', 
      quantity: 0, 
      unit: 'kg', 
      cost_per_unit: 0, 
      supplier: '' 
    }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (values: z.infer<typeof projectSchema>) => {
    setIsSubmitting(true);
    try {
      await addProject({
        ...values,
        materials: materials.filter(m => m.name.trim() !== '')
      });
      
      toast({
        title: "Sucesso!",
        description: "Projeto criado com sucesso!",
        duration: 3000,
      });
      
      // Clear form and navigate
      form.reset();
      setMaterials([]);
      localStorage.removeItem(STORAGE_KEY);
      navigate('/dashboard/projetos');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Informações Básicas" },
    { number: 2, title: "Materiais" },
    { number: 3, title: "Revisão e Confirmação" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Criar Novo Projeto</h1>
        <p className="text-gray-600 mt-2">Configure seu projeto para controlar desperdício de materiais</p>
      </div>

      <ProgressSteps steps={steps} currentStep={currentStep} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Informações do Projeto</CardTitle>
                <CardDescription>Dados básicos sobre o projeto de construção</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Projeto *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Edifício Residencial Alpha" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localização *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: São Paulo, SP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva brevemente o projeto..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estágio Atual *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estágio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="planejamento">Planejamento</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="execução">Execução</SelectItem>
                            <SelectItem value="concluído">Concluído</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="planned_end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conclusão Prevista</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="responsible_team_contacts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsáveis/Contatos da Equipe</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: João Silva (Gerente), Maria Santos (Arquiteta)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Materiais do Projeto</CardTitle>
                <CardDescription>Adicione os materiais que serão utilizados no projeto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {materials.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">Nenhum material adicionado ainda</p>
                    <Button type="button" onClick={addMaterial} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Material
                    </Button>
                  </div>
                ) : (
                  <>
                    {materials.map((material, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Material {index + 1}</h4>
                          <Button
                            type="button"
                            onClick={() => removeMaterial(index)}
                            variant="ghost"
                            size="sm"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                          <Input
                            placeholder="Nome do material"
                            value={material.name}
                            onChange={(e) => updateMaterial(index, 'name', e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Quantidade"
                            value={material.quantity || ''}
                            onChange={(e) => updateMaterial(index, 'quantity', Number(e.target.value))}
                          />
                          <Select
                            value={material.unit}
                            onValueChange={(value) => updateMaterial(index, 'unit', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="ton">ton</SelectItem>
                              <SelectItem value="m³">m³</SelectItem>
                              <SelectItem value="m²">m²</SelectItem>
                              <SelectItem value="un">un</SelectItem>
                              <SelectItem value="sac">sac</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Custo/unidade"
                            value={material.cost_per_unit || ''}
                            onChange={(e) => updateMaterial(index, 'cost_per_unit', Number(e.target.value))}
                          />
                          <Input
                            placeholder="Fornecedor"
                            value={material.supplier}
                            onChange={(e) => updateMaterial(index, 'supplier', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button type="button" onClick={addMaterial} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Mais Material
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Revisão e Confirmação</CardTitle>
                <CardDescription>Revise as informações antes de criar o projeto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Informações do Projeto</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Nome:</strong> {form.getValues('name')}</p>
                    <p><strong>Localização:</strong> {form.getValues('location')}</p>
                    <p><strong>Estágio:</strong> {form.getValues('stage')}</p>
                    {form.getValues('description') && (
                      <p><strong>Descrição:</strong> {form.getValues('description')}</p>
                    )}
                  </div>
                </div>

                {materials.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Materiais ({materials.length})</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {materials.map((material, index) => (
                        <div key={index} className="mb-2 last:mb-0">
                          {material.name} - {material.quantity} {material.unit}
                          {material.cost_per_unit > 0 && ` - R$ ${material.cost_per_unit}/un`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="outline"
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentStep < 3 ? (
              <Button type="button" onClick={handleNext}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Criando...' : 'Criar Projeto'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateProjectForm;
