
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Material {
  id: string;
  project_id: string;
  material_type_name: string;
  estimated_quantity: number | null;
  unit_of_measurement: string | null;
  dimensions_specs: string | null;
  cost_per_unit: number | null;
  stock_quantity: number | null;
  minimum_quantity: number | null;
  category: string | null;
  supplier_id: string | null;
  created_at: string;
  updated_at: string;
  suppliers?: {
    id: string;
    name: string;
    contact_email: string | null;
    contact_phone: string | null;
  };
}

interface MaterialStats {
  totalMaterials: number;
  totalValue: number;
  lowStockCount: number;
  mostUsedType: string;
}

interface CreateMaterialData {
  material_type_name: string;
  estimated_quantity: number;
  unit_of_measurement: string;
  cost_per_unit: number;
  stock_quantity: number;
  minimum_quantity: number;
  category: string;
  supplier_id: string;
  project_id: string;
  dimensions_specs?: string;
}

interface UseMaterialsManagement {
  materials: Material[];
  stats: MaterialStats;
  loading: boolean;
  error: string | null;
  createMaterial: (data: CreateMaterialData) => Promise<boolean>;
  deleteMaterial: (id: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useMaterialsManagement = (): UseMaterialsManagement => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        .from('project_materials')
        .select(`
          *,
          suppliers (
            id,
            name,
            contact_email,
            contact_phone
          )
        `)
        .eq('projects.user_id', user.id);

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

  const createMaterial = async (data: CreateMaterialData): Promise<boolean> => {
    try {
      console.log('Criando material:', data);
      
      const { error } = await supabase
        .from('project_materials')
        .insert([data]);

      if (error) {
        console.error('Erro ao criar material:', error);
        toast({
          title: "Erro",
          description: "Erro ao cadastrar material.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Material criado com sucesso');
      toast({
        title: "Sucesso!",
        description: "Material cadastrado com sucesso.",
      });

      await fetchMaterials(); // Atualizar lista
      return true;
    } catch (err: any) {
      console.error('Erro na criação de material:', err);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar material.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMaterial = async (id: string): Promise<boolean> => {
    try {
      console.log('Excluindo material:', id);
      
      const { error } = await supabase
        .from('project_materials')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir material:', error);
        toast({
          title: "Erro",
          description: "Erro ao excluir material.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Material excluído com sucesso');
      toast({
        title: "Sucesso!",
        description: "Material excluído com sucesso.",
      });

      await fetchMaterials(); // Atualizar lista
      return true;
    } catch (err: any) {
      console.error('Erro na exclusão de material:', err);
      toast({
        title: "Erro",
        description: "Erro ao excluir material.",
        variant: "destructive",
      });
      return false;
    }
  };

  const calculateStats = (): MaterialStats => {
    const totalMaterials = materials.length;
    
    const totalValue = materials.reduce((sum, material) => {
      const quantity = material.estimated_quantity || 0;
      const cost = material.cost_per_unit || 0;
      return sum + (quantity * cost);
    }, 0);

    const lowStockCount = materials.filter(material => {
      const stock = material.stock_quantity || 0;
      const minimum = material.minimum_quantity || 0;
      return stock <= minimum;
    }).length;

    const typeCount = materials.reduce((acc, material) => {
      const type = material.category || 'Outros';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedType = Object.entries(typeCount).reduce((max, [type, count]) => {
      return count > max.count ? { type, count } : max;
    }, { type: 'N/A', count: 0 }).type;

    return {
      totalMaterials,
      totalValue,
      lowStockCount,
      mostUsedType,
    };
  };

  useEffect(() => {
    if (user) {
      fetchMaterials();
    } else {
      setMaterials([]);
      setLoading(false);
    }
  }, [user]);

  return {
    materials,
    stats: calculateStats(),
    loading,
    error,
    createMaterial,
    deleteMaterial,
    refetch: fetchMaterials,
  };
};
