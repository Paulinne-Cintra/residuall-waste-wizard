
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Material {
  id: string;
  project_id: string;
  name: string;
  type: string | null;
  quantity: number | null;
  unit: string | null;
  cost_per_unit: number | null;
  reused_percentage: number | null;
  created_at: string;
}

interface UseMaterialsResult {
  materials: Material[];
  loading: boolean;
  error: string | null;
}

export const useMaterials = (): UseMaterialsResult => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      setError(null);

      if (!user) {
        setError("Usuário não autenticado.");
        setLoading(false);
        return;
      }

      try {
        console.log('Buscando materiais para o usuário:', user.id);
        const { data, error } = await supabase
          .from('materials')
          .select('*');

        if (error) {
          console.error('Erro ao buscar materiais:', error);
          throw error;
        }
        
        console.log('Materiais encontrados:', data);
        setMaterials(data as Material[]);
      } catch (err: any) {
        console.error('Erro na busca de materiais:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMaterials();
    } else {
      setMaterials([]);
      setLoading(false);
    }
  }, [user]);

  return { materials, loading, error };
};
