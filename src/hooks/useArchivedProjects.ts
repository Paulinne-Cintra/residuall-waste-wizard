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
      // Remove o projeto fictício da lista local
      setArchivedProjects(prev => prev.filter(project => project.id !== projectId));
      
      toast({
        title: "Projeto restaurado!",
        description: "Este é um projeto de demonstração. Em uma aplicação real, seria restaurado com sucesso.",
      });
      return true;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          arquivado: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Remove o projeto da lista local
      setArchivedProjects(prev => prev.filter(project => project.id !== projectId));

      toast({
        title: "Sucesso!",
        description: "Projeto restaurado com sucesso! O projeto agora está disponível na página de projetos.",
      });

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
      // Remove o projeto fictício da lista local
      setArchivedProjects(prev => prev.filter(project => project.id !== projectId));
      
      toast({
        title: "Projeto excluído!",
        description: "Este é um projeto de demonstração. Em uma aplicação real, seria excluído permanentemente.",
      });
      return true;
    }

    try {
      // Primeiro, buscar os IDs dos materiais do projeto
      const { data: projectMaterials } = await supabase
        .from('project_materials')
        .select('id')
        .eq('project_id', projectId);

      // Excluir entradas de desperdício relacionadas aos materiais do projeto
      if (projectMaterials && projectMaterials.length > 0) {
        const materialIds = projectMaterials.map(material => material.id);
        
        const { error: wasteError } = await supabase
          .from('waste_entries')
          .delete()
          .in('project_material_id', materialIds);

        if (wasteError) {
          console.error('Erro ao excluir entradas de desperdício:', wasteError);
        }
      }

      // Excluir materiais do projeto
      const { error: materialsError } = await supabase
        .from('project_materials')
        .delete()
        .eq('project_id', projectId);

      if (materialsError) {
        console.error('Erro ao excluir materiais do projeto:', materialsError);
      }

      // Excluir desperdício por etapa
      const { error: stageWasteError } = await supabase
        .from('project_stage_waste')
        .delete()
        .eq('project_id', projectId);

      if (stageWasteError) {
        console.error('Erro ao excluir desperdício por etapa:', stageWasteError);
      }

      // Excluir recomendações relacionadas
      const { error: recommendationsError } = await supabase
        .from('recomendacoes')
        .delete()
        .eq('projeto_id', projectId);

      if (recommendationsError) {
        console.error('Erro ao excluir recomendações:', recommendationsError);
      }

      // Excluir relatórios relacionados
      const { error: reportsError } = await supabase
        .from('reports')
        .delete()
        .eq('project_id', projectId);

      if (reportsError) {
        console.error('Erro ao excluir relatórios:', reportsError);
      }

      // Finalmente, excluir o projeto
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Remove o projeto da lista local
      setArchivedProjects(prev => prev.filter(project => project.id !== projectId));

      toast({
        title: "Sucesso!",
        description: "Projeto excluído permanentemente!",
      });

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
