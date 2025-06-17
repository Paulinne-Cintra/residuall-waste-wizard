import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ProgressSteps } from "@/components/ProgressSteps";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const STORAGE_KEY = 'create_project_form';

const CreateProjectForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Clear localStorage on component mount to ensure clean form
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Form state - initialized with empty values
  const [formData, setFormData] = useState({
    name: '',
    description_notes: '',
    location: '',
    project_type: '',
    budget: '',
    start_date: undefined as Date | undefined,
    planned_end_date: undefined as Date | undefined,
    responsible_team_contacts: [] as string[]
  });

  const [materials, setMaterials] = useState<Array<{
    type: string;
    quantity: string;
    unit: string;
    cost: string;
  }>>([]);

  const [newContact, setNewContact] = useState('');

  const addMaterial = () => {
    setMaterials([...materials, { type: '', quantity: '', unit: '', cost: '' }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: string, value: string) => {
    const updatedMaterials = materials.map((material, i) => 
      i === index ? { ...material, [field]: value } : material
    );
    setMaterials(updatedMaterials);
  };

  const addContact = () => {
    if (newContact.trim() && !formData.responsible_team_contacts.includes(newContact)) {
      setFormData({
        ...formData,
        responsible_team_contacts: [...formData.responsible_team_contacts, newContact.trim()]
      });
      setNewContact('');
    }
  };

  const removeContact = (contact: string) => {
    setFormData({
      ...formData,
      responsible_team_contacts: formData.responsible_team_contacts.filter(c => c !== contact)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsLoading(true);

    try {
      // Create project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: formData.name,
          description_notes: formData.description_notes,
          location: formData.location,
          project_type: formData.project_type,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          start_date: formData.start_date?.toISOString(),
          planned_end_date: formData.planned_end_date?.toISOString(),
          responsible_team_contacts: formData.responsible_team_contacts,
          user_id: user.id,
          status: 'planejamento',
          progress_percentage: 0
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create materials if any
      if (materials.length > 0) {
        const materialPromises = materials.map(material => 
          supabase.from('project_materials').insert({
            project_id: project.id,
            material_type_name: material.type,
            estimated_quantity: parseFloat(material.quantity) || 0,
            unit_of_measurement: material.unit,
            cost_per_unit: parseFloat(material.cost) || 0
          })
        );

        await Promise.all(materialPromises);
      }

      toast.success('Projeto criado com sucesso!');
      localStorage.removeItem(STORAGE_KEY);
      navigate('/dashboard/projetos');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Erro ao criar projeto. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProgressSteps currentStep={1} totalSteps={3} />
      
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Projeto</CardTitle>
          <CardDescription>Preencha as informações básicas do seu projeto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Edifício Residencial Centro"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Ex: São Paulo, SP"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description_notes}
                onChange={(e) => setFormData({...formData, description_notes: e.target.value})}
                placeholder="Descreva os objetivos e características do projeto..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Projeto</Label>
                <Select onValueChange={(value) => setFormData({...formData, project_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residencial">Residencial</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento (R$)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  placeholder="Ex: 1500000"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.start_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? format(formData.start_date, "dd/MM/yyyy") : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) => setFormData({...formData, start_date: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data de Conclusão Prevista</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.planned_end_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.planned_end_date ? format(formData.planned_end_date, "dd/MM/yyyy") : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.planned_end_date}
                      onSelect={(date) => setFormData({...formData, planned_end_date: date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Materials Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-base font-medium">Materiais do Projeto</Label>
                <Button type="button" onClick={addMaterial} variant="outline" size="sm">
                  Adicionar Material
                </Button>
              </div>

              {materials.map((material, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Tipo de Material</Label>
                    <Input
                      value={material.type}
                      onChange={(e) => updateMaterial(index, 'type', e.target.value)}
                      placeholder="Ex: Cimento"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input
                      type="number"
                      value={material.quantity}
                      onChange={(e) => updateMaterial(index, 'quantity', e.target.value)}
                      placeholder="Ex: 100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Unidade</Label>
                    <Select onValueChange={(value) => updateMaterial(index, 'unit', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="m³">m³</SelectItem>
                        <SelectItem value="m²">m²</SelectItem>
                        <SelectItem value="unidade">unidade</SelectItem>
                        <SelectItem value="saco">saco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Custo por Unidade (R$)</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={material.cost}
                        onChange={(e) => updateMaterial(index, 'cost', e.target.value)}
                        placeholder="Ex: 25.50"
                      />
                      <Button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Contacts */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Contatos da Equipe Responsável</Label>
              
              <div className="flex gap-2">
                <Input
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="Email ou nome do responsável"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addContact())}
                />
                <Button type="button" onClick={addContact} variant="outline">
                  Adicionar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.responsible_team_contacts.map((contact, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {contact}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeContact(contact)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/projetos')}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar Projeto'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectForm;
