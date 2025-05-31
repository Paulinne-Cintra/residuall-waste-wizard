
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WasteEntry {
  id: string;
  project_material_id: string;
  project_stage: string;
  wasted_quantity: number;
  waste_cause_category: string | null;
  entry_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface UseWasteEntriesResult {
  wasteEntries: WasteEntry[];
  loading: boolean;
  error: string | null;
}

export const useWasteEntries = (): UseWasteEntriesResult => {
  const { user } = useAuth();
  const [wasteEntries, setWasteEntries] = useState<WasteEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWasteEntries = async () => {
      setLoading(true);
      setError(null);

      if (!user) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando entradas de desperdício para o usuário:', user.id);
        const { data, error } = await supabase
          .from('waste_entries')
          .select(`
            *,
            project_materials!inner(
              project_id,
              projects!inner(user_id)
            )
          `)
          .eq('project_materials.projects.user_id', user.id);

        if (error) {
          console.error('Erro ao buscar entradas de desperdício:', error);
          throw error;
        }
        
        console.log('Entradas de desperdício encontradas:', data);
        setWasteEntries(data as WasteEntry[]);
      } catch (err: any) {
        console.error('Erro na busca de entradas de desperdício:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWasteEntries();
    } else {
      setWasteEntries([]);
      setLoading(false);
    }
  }, [user]);

  return { wasteEntries, loading, error };
};
