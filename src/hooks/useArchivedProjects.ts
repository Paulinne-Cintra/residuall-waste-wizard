
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

  useEffect(() => {
    fetchArchivedProjects();
  }, [user]);

  const fetchArchivedProjects = async () => {
    if (!user) {
      setArchivedProjects([]);
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

      setArchivedProjects(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar projetos arquivados:', err);
      setError(err.message);
      setArchivedProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const restoreProject = async (projectId: string) => {
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
