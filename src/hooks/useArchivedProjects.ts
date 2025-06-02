
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ArchivedProject {
  id: string;
  name: string;
  location: string | null;
  project_type: string | null;
  status: string;
  budget: number | null;
  start_date: string | null;
  planned_end_date: string | null;
  description_notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useArchivedProjects = () => {
  const [archivedProjects, setArchivedProjects] = useState<ArchivedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Dados fictícios para demonstração quando não há projetos arquivados reais
  const mockArchivedProjects: ArchivedProject[] = [
    {
      id: 'mock-1',
      name: 'Edifício Residencial Sustentável',
      location: 'São Paulo, SP',
      project_type: 'Residencial',
      status: 'concluído',
      budget: 2500000.00,
      start_date: '2023-01-15',
      planned_end_date: '2023-12-20',
      description_notes: 'Projeto de edifício residencial com foco em sustentabilidade e redução de desperdícios.',
      created_at: '2023-01-10T08:00:00Z',
      updated_at: '2024-01-15T17:30:00Z'
    },
    {
      id: 'mock-2',
      name: 'Centro Comercial EcoPlaza',
      location: 'Rio de Janeiro, RJ',
      project_type: 'Comercial',
      status: 'concluído',
      budget: 3800000.00,
      start_date: '2022-06-01',
      planned_end_date: '2023-08-30',
      description_notes: 'Centro comercial com conceito de construção verde e gestão inteligente de resíduos.',
      created_at: '2022-05-20T09:15:00Z',
      updated_at: '2023-09-10T14:45:00Z'
    },
    {
      id: 'mock-3',
      name: 'Galpão Industrial Verde',
      location: 'Campinas, SP',
      project_type: 'Industrial',
      status: 'finalização',
      budget: 1200000.00,
      start_date: '2023-03-01',
      planned_end_date: '2023-11-15',
      description_notes: 'Galpão industrial com tecnologias de redução de desperdício e otimização energética.',
      created_at: '2023-02-15T10:30:00Z',
      updated_at: '2023-12-01T16:20:00Z'
    }
  ];

  useEffect(() => {
    fetchArchivedProjects();
  }, [user]);

  const fetchArchivedProjects = async () => {
    if (!user) {
      setArchivedProjects(mockArchivedProjects);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('arquivado', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Se não há projetos arquivados reais, usar dados fictícios
      if (!data || data.length === 0) {
        setArchivedProjects(mockArchivedProjects);
      } else {
        setArchivedProjects(data);
      }
    } catch (err: any) {
      console.error('Erro ao buscar projetos arquivados:', err);
      setError(err.message);
      // Em caso de erro, mostrar dados fictícios
      setArchivedProjects(mockArchivedProjects);
    } finally {
      setLoading(false);
    }
  };

  const restoreProject = async (projectId: string) => {
    // Se for um projeto fictício, simular sucesso
    if (projectId.startsWith('mock-')) {
      toast({
        title: "Projeto restaurado!",
        description: "Este é um projeto de demonstração. Em uma aplicação real, seria restaurado com sucesso.",
      });
      return true;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ arquivado: false })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Projeto restaurado com sucesso!",
      });

      await fetchArchivedProjects();
      return true;
    } catch (err: any) {
      console.error('Erro ao restaurar projeto:', err);
      toast({
        title: "Erro",
        description: "Erro ao restaurar projeto.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProject = async (projectId: string) => {
    // Se for um projeto fictício, simular sucesso
    if (projectId.startsWith('mock-')) {
      toast({
        title: "Projeto excluído!",
        description: "Este é um projeto de demonstração. Em uma aplicação real, seria excluído permanentemente.",
      });
      return true;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Projeto excluído permanentemente!",
      });

      await fetchArchivedProjects();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir projeto:', err);
      toast({
        title: "Erro",
        description: "Erro ao excluir projeto.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    archivedProjects,
    loading,
    error,
    restoreProject,
    deleteProject,
    refetch: fetchArchivedProjects
  };
};
