
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Upload, Plus, Trash2 } from 'lucide-react';

// Constantes para as etapas da obra
const PROJECT_STAGES = [
  'Fundação',
  'Estrutura', 
  'Alvenaria',
  'Instalações',
  'Revestimentos e Acabamentos',
  'Cobertura',
  'Acabamento Final',
  'Limpeza e Entrega'
];

const PROJECT_TYPES = [
  'Residencial',
  'Comercial',
  'Industrial',
  'Institucional',
  'Infraestrutura'
];

const PROJECT_STATUS = [
  'planejamento',
  'execução',
  'finalização',
  'concluído'
];

interface Material {
  material_type_name: string;
  estimated_quantity: number | null;
  unit_of_measurement: string;
  dimensions_specs: string;
}

interface ProjectFormData {
  name: string;
  location: string;
  dimensions_details: string;
  project_type: string;
  status: string;
  start_date: string;
  planned_end_date: string;
  budget: number | null;
  responsible_team_contacts: string;
  description_notes: string;
  materials: Material[];
  documents: File[];
}

const CreateProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    location: '',
    dimensions_details: '',
    project_type: '',
    status: 'planejamento',
    start_date: '',
    planned_end_date: '',
    budget: null,
    responsible_team_contacts: '',
    description_notes: '',
    materials: [],
    documents: []
  });

  const updateFormData = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, {
        material_type_name: '',
        estimated_quantity: null,
        unit_of_measurement: '',
        dimensions_specs: ''
      }]
    }));
  };

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map((material, i) => 
        i === index ? { ...material, [field]: value } : material
      )
    }));
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.location && formData.project_type && formData.status);
      case 2:
        return true; // Documentos são opcionais
      case 3:
        return formData.materials.every(material => 
          material.material_type_name && material.unit_of_measurement
        );
      case 4:
        return true; // Descrição é opcional
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // 1. Criar o projeto
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: formData.name,
          location: formData.location,
          dimensions_details: formData.dimensions_details,
          project_type: formData.project_type,
          status: formData.status,
          start_date: formData.start_date || null,
          planned_end_date: formData.planned_end_date || null,
          budget: formData.budget,
          responsible_team_contacts: formData.responsible_team_contacts,
          description_notes: formData.description_notes
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // 2. Upload de documentos (se houver)
      for (const file of formData.documents) {
        const fileName = `${user.id}/${project.id}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('project-documents')
          .upload(fileName, file);

        if (!uploadError) {
          await supabase
            .from('project_documents')
            .insert({
              project_id: project.id,
              file_name: file.name,
              storage_path: fileName,
              file_type: file.type,
              description: `Documento: ${file.name}`
            });
        }
      }

      // 3. Criar materiais do projeto
      for (const material of formData.materials) {
        if (material.material_type_name) {
          await supabase
            .from('project_materials')
            .insert({
              project_id: project.id,
              material_type_name: material.material_type_name,
              estimated_quantity: material.estimated_quantity,
              unit_of_measurement: material.unit_of_measurement,
              dimensions_specs: material.dimensions_specs
            });
        }
      }

      toast({
        title: "Projeto criado com sucesso!",
        description: "Seu projeto foi registrado e está pronto para o acompanhamento de desperdícios.",
      });

      navigate('/dashboard/projetos');
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: error.message || "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Informações Básicas do Projeto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Ex: Edifício Aurora"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Localização da Obra *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dimensions">Dimensionamento do Projeto</Label>
              <Textarea
                id="dimensions"
                value={formData.dimensions_details}
                onChange={(e) => updateFormData('dimensions_details', e.target.value)}
                placeholder="Ex: Área construída: 2.500m², 15 pavimentos, 60 apartamentos"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipologia do Projeto *</Label>
                <Select onValueChange={(value) => updateFormData('project_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a tipologia" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status da Obra *</Label>
                <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUS.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => updateFormData('start_date', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">Previsão de Finalização</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.planned_end_date}
                  onChange={(e) => updateFormData('planned_end_date', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Orçamento Previsto (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget || ''}
                  onChange={(e) => updateFormData('budget', e.target.value ? Number(e.target.value) : null)}
                  placeholder="Ex: 5000000"
                />
              </div>
              
              <div>
                <Label htmlFor="team">Equipe Responsável</Label>
                <Input
                  id="team"
                  value={formData.responsible_team_contacts}
                  onChange={(e) => updateFormData('responsible_team_contacts', e.target.value)}
                  placeholder="Ex: João Silva (Eng. Civil), Maria Santos (Arquiteta)"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Documentos do Projeto</h3>
            <p className="text-gray-600">
              Anexe documentos relevantes ao projeto (PDF). Documentos suportados: estudos de viabilidade, 
              licenciamento ambiental, cronogramas, projetos básicos, relatórios e estimativas.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="documents" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Clique para fazer upload ou arraste arquivos aqui
                    </span>
                    <span className="text-sm text-gray-500">PDF até 10MB</span>
                  </Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {formData.documents.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Documentos Anexados:</h4>
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{doc.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Materiais do Projeto</h3>
              <Button onClick={addMaterial} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Material
              </Button>
            </div>
            
            <p className="text-gray-600">
              Registre os materiais planejados ou utilizados no projeto. Essas informações serão 
              usadas para acompanhar o desperdício por etapa da obra.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Etapas da Obra Pré-definidas:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-800">
                {PROJECT_STAGES.map((stage, index) => (
                  <div key={stage}>
                    {index + 1}. {stage}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {formData.materials.map((material, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label>Tipo de Material *</Label>
                        <Input
                          value={material.material_type_name}
                          onChange={(e) => updateMaterial(index, 'material_type_name', e.target.value)}
                          placeholder="Ex: Tijolo cerâmico"
                        />
                      </div>
                      
                      <div>
                        <Label>Quantidade Estimada</Label>
                        <Input
                          type="number"
                          value={material.estimated_quantity || ''}
                          onChange={(e) => updateMaterial(index, 'estimated_quantity', e.target.value ? Number(e.target.value) : null)}
                          placeholder="Ex: 1000"
                        />
                      </div>
                      
                      <div>
                        <Label>Unidade de Medida *</Label>
                        <Input
                          value={material.unit_of_measurement}
                          onChange={(e) => updateMaterial(index, 'unit_of_measurement', e.target.value)}
                          placeholder="Ex: un, kg, m², m³"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label>Dimensões/Especificações</Label>
                      <Input
                        value={material.dimensions_specs}
                        onChange={(e) => updateMaterial(index, 'dimensions_specs', e.target.value)}
                        placeholder="Ex: 14x19x29cm, CA50 Ø 12mm"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {formData.materials.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum material adicionado. Clique em "Adicionar Material" para começar.
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Descrição e Observações</h3>
            
            <div>
              <Label htmlFor="description">Observações do Projeto</Label>
              <Textarea
                id="description"
                value={formData.description_notes}
                onChange={(e) => updateFormData('description_notes', e.target.value)}
                placeholder="Descreva análises adicionais, observações sobre o andamento, desafios ou particularidades do projeto..."
                rows={6}
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Resumo do Projeto:</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p><strong>Nome:</strong> {formData.name}</p>
                <p><strong>Localização:</strong> {formData.location}</p>
                <p><strong>Tipo:</strong> {formData.project_type}</p>
                <p><strong>Status:</strong> {formData.status}</p>
                <p><strong>Materiais cadastrados:</strong> {formData.materials.length}</p>
                <p><strong>Documentos anexados:</strong> {formData.documents.length}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Projeto</CardTitle>
          <CardDescription>
            Etapa {currentStep} de 4: {
              currentStep === 1 ? 'Informações Básicas' :
              currentStep === 2 ? 'Documentos' :
              currentStep === 3 ? 'Materiais' : 'Observações'
            }
          </CardDescription>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-residuall-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStepContent()}
          
          <Separator />
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={nextStep}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-residuall-green hover:bg-residuall-green/90"
              >
                {isSubmitting ? 'Criando...' : 'Criar Projeto'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectForm;
