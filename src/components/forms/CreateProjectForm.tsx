
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Upload, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Constantes para as etapas da obra
const PROJECT_STAGES = [
  'Fundação',
  'Estrutura', 
  'Alvenaria',
  'Instalações (elétricas, hidráulicas, etc.)',
  'Revestimentos e Acabamentos (internos e externos)',
  'Cobertura',
  'Acabamento Final',
  'Limpeza e Entrega da Obra'
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
  tipo: string;
  quantidade: number | null;
  unidade: string;
  dimensoes: string;
}

interface ProjectFormData {
  nome: string;
  localizacao: string;
  dimensionamento: string;
  tipologia: string;
  status: string;
  dataInicio: string;
  previsaoFinalizacao: string;
  orcamento: number | null;
  equipeResponsavel: string;
  etapasSelecionadas: string[];
  materiais: Material[];
  documentos: File[];
  observacoes: string;
}

const CreateProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    nome: '',
    localizacao: '',
    dimensionamento: '',
    tipologia: '',
    status: 'planejamento',
    dataInicio: '',
    previsaoFinalizacao: '',
    orcamento: null,
    equipeResponsavel: '',
    etapasSelecionadas: [],
    materiais: [],
    documentos: [],
    observacoes: ''
  });

  const updateFormData = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materiais: [...prev.materiais, {
        tipo: '',
        quantidade: null,
        unidade: '',
        dimensoes: ''
      }]
    }));
  };

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    setFormData(prev => ({
      ...prev,
      materiais: prev.materiais.map((material, i) => 
        i === index ? { ...material, [field]: value } : material
      )
    }));
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materiais: prev.materiais.filter((_, i) => i !== index)
    }));
  };

  const handleStageToggle = (stage: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      etapasSelecionadas: checked
        ? [...prev.etapasSelecionadas, stage]
        : prev.etapasSelecionadas.filter(s => s !== stage)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      documentos: [...prev.documentos, ...files]
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentos: prev.documentos.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.nome && formData.localizacao && formData.tipologia && formData.status);
      case 2:
        return true; // Documentos são opcionais
      case 3:
        return formData.etapasSelecionadas.length > 0;
      case 4:
        return formData.materiais.every(material => 
          material.tipo && material.unidade
        );
      case 5:
        return true; // Observações são opcionais
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
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
    setIsSubmitting(true);
    try {
      // Simular salvamento do projeto
      console.log('Dados do projeto:', formData);
      
      toast({
        title: "Projeto criado com sucesso!",
        description: "Seu projeto foi registrado e está pronto para o acompanhamento.",
      });

      navigate('/dashboard/projetos');
    } catch (error: any) {
      console.error('Erro ao criar projeto:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro inesperado. Tente novamente.",
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
                <Label htmlFor="nome">Nome do Projeto *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => updateFormData('nome', e.target.value)}
                  placeholder="Ex: Edifício Aurora"
                />
              </div>
              
              <div>
                <Label htmlFor="localizacao">Localização da Obra *</Label>
                <Input
                  id="localizacao"
                  value={formData.localizacao}
                  onChange={(e) => updateFormData('localizacao', e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dimensionamento">Dimensionamento do Projeto</Label>
              <Textarea
                id="dimensionamento"
                value={formData.dimensionamento}
                onChange={(e) => updateFormData('dimensionamento', e.target.value)}
                placeholder="Ex: Área construída: 2.500m², 15 pavimentos, 60 apartamentos"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipologia">Tipologia do Projeto *</Label>
                <Select onValueChange={(value) => updateFormData('tipologia', value)}>
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
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => updateFormData('dataInicio', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="previsaoFinalizacao">Previsão de Finalização</Label>
                <Input
                  id="previsaoFinalizacao"
                  type="date"
                  value={formData.previsaoFinalizacao}
                  onChange={(e) => updateFormData('previsaoFinalizacao', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orcamento">Orçamento Previsto (R$)</Label>
                <Input
                  id="orcamento"
                  type="number"
                  value={formData.orcamento || ''}
                  onChange={(e) => updateFormData('orcamento', e.target.value ? Number(e.target.value) : null)}
                  placeholder="Ex: 5000000"
                />
              </div>
              
              <div>
                <Label htmlFor="equipe">Equipe Responsável</Label>
                <Input
                  id="equipe"
                  value={formData.equipeResponsavel}
                  onChange={(e) => updateFormData('equipeResponsavel', e.target.value)}
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
                  <Label htmlFor="documentos" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Clique para fazer upload ou arraste arquivos aqui
                    </span>
                    <span className="text-sm text-gray-500">PDF até 10MB</span>
                  </Label>
                  <Input
                    id="documentos"
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {formData.documentos.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Documentos Anexados:</h4>
                {formData.documentos.map((doc, index) => (
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
            <h3 className="text-lg font-semibold text-gray-900">Etapas da Obra</h3>
            <p className="text-gray-600">
              Selecione as etapas construtivas que se aplicam ao seu projeto. Isso ajudará a organizar 
              os dados e facilitar a análise de reaproveitamento de materiais em cada fase.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Categorias de Etapas Pré-definidas:</h4>
              <div className="space-y-3">
                {PROJECT_STAGES.map((stage, index) => (
                  <div key={stage} className="flex items-center space-x-2">
                    <Checkbox
                      id={`stage-${index}`}
                      checked={formData.etapasSelecionadas.includes(stage)}
                      onCheckedChange={(checked) => handleStageToggle(stage, checked as boolean)}
                    />
                    <Label htmlFor={`stage-${index}`} className="text-blue-800">
                      {index + 1}. {stage}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
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

            <div className="space-y-4">
              {formData.materiais.map((material, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label>Tipo de Material *</Label>
                        <Input
                          value={material.tipo}
                          onChange={(e) => updateMaterial(index, 'tipo', e.target.value)}
                          placeholder="Ex: Tijolo cerâmico, Cimento CPII"
                        />
                      </div>
                      
                      <div>
                        <Label>Quantidade Estimada</Label>
                        <Input
                          type="number"
                          value={material.quantidade || ''}
                          onChange={(e) => updateMaterial(index, 'quantidade', e.target.value ? Number(e.target.value) : null)}
                          placeholder="Ex: 1000"
                        />
                      </div>
                      
                      <div>
                        <Label>Unidade *</Label>
                        <Input
                          value={material.unidade}
                          onChange={(e) => updateMaterial(index, 'unidade', e.target.value)}
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
                      <Label>Dimensões (se aplicável)</Label>
                      <Input
                        value={material.dimensoes}
                        onChange={(e) => updateMaterial(index, 'dimensoes', e.target.value)}
                        placeholder="Ex: 14x19x29cm, dimensões de blocos/chapas"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {formData.materiais.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum material adicionado. Clique em "Adicionar Material" para começar.
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Descrição e Observações</h3>
            
            <div>
              <Label htmlFor="observacoes">Observações do Projeto</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => updateFormData('observacoes', e.target.value)}
                placeholder="Descreva análises adicionais, observações sobre o andamento, desafios ou particularidades do projeto..."
                rows={6}
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Resumo do Projeto:</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p><strong>Nome:</strong> {formData.nome}</p>
                <p><strong>Localização:</strong> {formData.localizacao}</p>
                <p><strong>Tipologia:</strong> {formData.tipologia}</p>
                <p><strong>Status:</strong> {formData.status}</p>
                <p><strong>Etapas selecionadas:</strong> {formData.etapasSelecionadas.length}</p>
                <p><strong>Materiais cadastrados:</strong> {formData.materiais.length}</p>
                <p><strong>Documentos anexados:</strong> {formData.documentos.length}</p>
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
            Etapa {currentStep} de 5: {
              currentStep === 1 ? 'Informações Básicas' :
              currentStep === 2 ? 'Documentos' :
              currentStep === 3 ? 'Etapas da Obra' :
              currentStep === 4 ? 'Materiais' : 'Observações'
            }
          </CardDescription>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
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
            
            {currentStep < 5 ? (
              <Button onClick={nextStep}>
                Próximo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
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
