
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface TimelinePhase {
  id: string;
  stage_name: string;
  progress: number;
  status: string;
  measurement_date: string;
  waste_quantity: number;
}

export const useProjectTimeline = (projectId: string | undefined) => {
  const [timeline, setTimeline] = useState<TimelinePhase[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (projectId && user) {
      fetchProjectTimeline();
    } else {
      setTimeline([]);
      setLoading(false);
    }
  }, [projectId, user]);

  const fetchProjectTimeline = async () => {
    if (!projectId || !user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('project_stage_waste')
        .select('*')
        .eq('project_id', projectId)
        .order('measurement_date', { ascending: true });

      if (error) throw error;

      const phases: TimelinePhase[] = (data || []).map(stage => {
        // Calculate progress based on stage sequence
        let progress = 0;
        let status = 'Pendente';
        
        if (stage.waste_quantity > 0) {
          progress = 100;
          status = 'Concluída';
        } else {
          const daysSinceStart = Math.floor((new Date().getTime() - new Date(stage.measurement_date).getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceStart >= 0) {
            progress = Math.min(90, Math.max(10, daysSinceStart * 5));
            status = 'Em andamento';
          }
        }

        return {
          id: stage.id,
          stage_name: stage.stage_name,
          progress,
          status,
          measurement_date: stage.measurement_date,
          waste_quantity: stage.waste_quantity
        };
      });

      setTimeline(phases);
    } catch (error) {
      console.error('Erro ao buscar cronograma do projeto:', error);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  return { timeline, loading, refetch: fetchProjectTimeline };
};
