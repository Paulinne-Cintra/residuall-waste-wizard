
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ProjectStageWaste {
  id: string;
  project_id: string;
  stage_name: string;
  waste_quantity: number;
  waste_cost?: number;
  measurement_unit?: string;
  measurement_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useProjectStageWaste = (projectId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: stageWaste = [], isLoading, error } = useQuery({
    queryKey: ['project-stage-waste', projectId],
    queryFn: async () => {
      let query = supabase
        .from('project_stage_waste')
        .select('*')
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar dados de desperdício por etapa:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });

  const createStageWaste = useMutation({
    mutationFn: async (newStageWaste: Omit<ProjectStageWaste, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('project_stage_waste')
        .insert([newStageWaste])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar desperdício por etapa:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-stage-waste'] });
    },
  });

  const updateStageWaste = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectStageWaste> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_stage_waste')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar desperdício por etapa:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-stage-waste'] });
    },
  });

  const deleteStageWaste = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('project_stage_waste')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar desperdício por etapa:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-stage-waste'] });
    },
  });

  // Agregação de dados por etapa para gráficos
  const wasteByStage = stageWaste.reduce((acc, entry) => {
    const existing = acc.find(item => item.name === entry.stage_name);
    
    if (existing) {
      existing.quantidade += entry.waste_quantity;
      existing.custo += entry.waste_cost || 0;
    } else {
      acc.push({
        name: entry.stage_name,
        quantidade: entry.waste_quantity,
        custo: entry.waste_cost || 0
      });
    }
    
    return acc;
  }, [] as Array<{name: string, quantidade: number, custo: number}>);

  return {
    stageWaste,
    wasteByStage,
    loading: isLoading,
    error,
    createStageWaste: createStageWaste.mutate,
    updateStageWaste: updateStageWaste.mutate,
    deleteStageWaste: deleteStageWaste.mutate,
  };
};
