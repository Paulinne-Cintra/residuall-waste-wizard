
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectStageWaste } from '@/hooks/useProjectStageWaste';

interface StageWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const StageWasteModal: React.FC<StageWasteModalProps> = ({ isOpen, onClose, projectId }) => {
  const { createStageWaste } = useProjectStageWaste(projectId);
  const [formData, setFormData] = useState({
    stage_name: '',
    waste_quantity: '',
    waste_cost: '',
    measurement_unit: 'kg',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createStageWaste({
      project_id: projectId,
      stage_name: formData.stage_name,
      waste_quantity: parseFloat(formData.waste_quantity),
      waste_cost: formData.waste_cost ? parseFloat(formData.waste_cost) : undefined,
      measurement_unit: formData.measurement_unit,
      measurement_date: new Date().toISOString().split('T')[0],
      notes: formData.notes || undefined
    });

    setFormData({
      stage_name: '',
      waste_quantity: '',
      waste_cost: '',
      measurement_unit: 'kg',
      notes: ''
    });
    
    onClose();
  };

  const stages = [
    'Fundação',
    'Estrutura',
    'Alvenaria', 
    'Acabamento',
    'Instalações',
    'Cobertura',
    'Pintura'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Desperdício por Etapa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="stage_name">Etapa da Obra</Label>
            <Select value={formData.stage_name} onValueChange={(value) => setFormData({...formData, stage_name: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma etapa" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="waste_quantity">Quantidade de Desperdício</Label>
            <Input
              id="waste_quantity"
              type="number"
              step="0.01"
              value={formData.waste_quantity}
              onChange={(e) => setFormData({...formData, waste_quantity: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="measurement_unit">Unidade de Medida</Label>
            <Select value={formData.measurement_unit} onValueChange={(value) => setFormData({...formData, measurement_unit: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Quilogramas (kg)</SelectItem>
                <SelectItem value="m³">Metros Cúbicos (m³)</SelectItem>
                <SelectItem value="m²">Metros Quadrados (m²)</SelectItem>
                <SelectItem value="unidades">Unidades</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="waste_cost">Custo do Desperdício (R$)</Label>
            <Input
              id="waste_cost"
              type="number"
              step="0.01"
              value={formData.waste_cost}
              onChange={(e) => setFormData({...formData, waste_cost: e.target.value})}
              placeholder="Opcional"
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Observações sobre o desperdício..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Registrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StageWasteModal;
