
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface GlobalSearchResult {
  result_type: string;
  result_id: string;
  title: string;
  description: string;
  additional_info: string;
  created_at: string;
  relevance_score: number;
}

interface UseGlobalSearchResult {
  results: GlobalSearchResult[];
  loading: boolean;
  error: string | null;
  search: (searchTerm: string) => Promise<void>;
  clearResults: () => void;
}

export const useGlobalSearch = (): UseGlobalSearchResult => {
  const { user } = useAuth();
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchTerm: string) => {
    if (!user || !searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Realizando busca global para:', searchTerm);
      
      const { data, error } = await supabase.rpc('global_search', {
        search_term: searchTerm.trim(),
        user_id_param: user.id
      });

      if (error) {
        console.error('Erro na busca global:', error);
        throw error;
      }

      console.log('Resultados da busca global:', data);
      setResults(data || []);
    } catch (err: any) {
      console.error('Erro na busca global:', err);
      setError(err.message || 'Erro ao realizar busca');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { 
    results, 
    loading, 
    error, 
    search, 
    clearResults 
  };
};
