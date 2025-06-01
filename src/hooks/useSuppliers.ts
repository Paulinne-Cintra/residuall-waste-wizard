
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Supplier {
  id: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

interface UseSuppliers {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  createSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => Promise<Supplier | null>;
  refetch: () => Promise<void>;
}

export const useSuppliers = (): UseSuppliers => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Buscando fornecedores...');
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar fornecedores:', error);
        throw error;
      }

      console.log('Fornecedores encontrados:', data);
      setSuppliers(data as Supplier[]);
    } catch (err: any) {
      console.error('Erro na busca de fornecedores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier | null> => {
    try {
      console.log('Criando fornecedor:', supplierData);
      const { data, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar fornecedor:', error);
        throw error;
      }

      console.log('Fornecedor criado:', data);
      await fetchSuppliers(); // Atualizar lista
      return data as Supplier;
    } catch (err: any) {
      console.error('Erro na criação de fornecedor:', err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    loading,
    error,
    createSupplier,
    refetch: fetchSuppliers,
  };
};
