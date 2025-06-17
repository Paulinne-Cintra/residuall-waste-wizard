
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface TimelinePhase {
  id: string;
  stage_name: string;
  progress: number;
  status: string;
  waste_quantity: number;
  waste_cost: number;
  measurement_date: string;
}

export const useProjectTimeline = (projectId: string) => {
  const [timeline, setTimeline] = useState<TimelinePhase[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTimeline = async () => {
      if (!user || !projectId) {
        setTimeline([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando cronograma para projeto:', projectId);
        
        const { data, error } = await supabase
          .from('project_stage_waste')
          .select('*')
          .eq('project_id', projectId)
          .order('measurement_date', { ascending: true });

        if (error) {
          console.error('Erro ao buscar cronograma:', error);
          throw error;
        }

        const processedTimeline = (data || []).map(stage => {
          // Calcular progresso baseado na data e desperdício
          const progress = stage.waste_quantity > 0 ? 
            Math.min(100, Math.max(0, 100 - (stage.waste_quantity * 10))) : 
            Math.floor(Math.random() * 100); // Progresso simulado se não houver dados

          const status = progress === 100 ? 'Concluída' : 
                        progress > 0 ? 'Em andamento' : 'Pendente';

          return {
            id: stage.id,
            stage_name: stage.stage_name,
            progress,
            status,
            waste_quantity: stage.waste_quantity,
            waste_cost: stage.waste_cost || 0,
            measurement_date: stage.measurement_date
          };
        });

        setTimeline(processedTimeline);
      } catch (error) {
        console.error('Erro ao buscar cronograma do projeto:', error);
        setTimeline([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [user, projectId]);

  return { timeline, loading };
};
