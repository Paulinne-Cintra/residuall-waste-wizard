
import { useState, useEffect } from 'react';

interface UseFormPersistenceOptions {
  key: string;
  defaultValues?: any;
  storage?: 'localStorage' | 'sessionStorage';
}

export const useFormPersistence = <T>({
  key,
  defaultValues = {},
  storage = 'sessionStorage'
}: UseFormPersistenceOptions) => {
  const [formData, setFormData] = useState<T>(defaultValues);

  // Carregar dados do storage na inicialização
  useEffect(() => {
    try {
      const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
      const saved = storageObj.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData({ ...defaultValues, ...parsed });
      }
    } catch (error) {
      console.warn('Erro ao carregar dados do formulário:', error);
    }
  }, [key, storage]);

  // Salvar dados no storage quando formData mudar
  useEffect(() => {
    try {
      const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
      storageObj.setItem(key, JSON.stringify(formData));
    } catch (error) {
      console.warn('Erro ao salvar dados do formulário:', error);
    }
  }, [formData, key, storage]);

  const updateFormData = (updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const clearFormData = () => {
    try {
      const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
      storageObj.removeItem(key);
      setFormData(defaultValues);
    } catch (error) {
      console.warn('Erro ao limpar dados do formulário:', error);
    }
  };

  return {
    formData,
    updateFormData,
    clearFormData,
    setFormData
  };
};
