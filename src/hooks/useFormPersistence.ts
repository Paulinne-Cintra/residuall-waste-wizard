
import { useState, useEffect, useCallback } from 'react';

interface UseFormPersistenceOptions {
  key: string;
  defaultValues?: any;
  storage?: 'localStorage' | 'sessionStorage';
  debounceMs?: number;
}

export const useFormPersistence = <T>({
  key,
  defaultValues = {},
  storage = 'sessionStorage',
  debounceMs = 500
}: UseFormPersistenceOptions) => {
  const [formData, setFormData] = useState<T>(defaultValues);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do storage na inicialização
  useEffect(() => {
    try {
      const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
      const saved = storageObj.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge com valores padrão para garantir que novos campos sejam incluídos
        const mergedData = { ...defaultValues, ...parsed };
        setFormData(mergedData);
        // Marcar que há dados não salvos
        sessionStorage.setItem('hasUnsavedData', 'true');
      }
    } catch (error) {
      console.warn('Erro ao carregar dados do formulário:', error);
      setFormData(defaultValues);
    } finally {
      setIsLoading(false);
    }
  }, [key, storage]);

  // Salvar dados no storage com debounce
  useEffect(() => {
    if (isLoading) return;
    
    const timeoutId = setTimeout(() => {
      try {
        const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
        storageObj.setItem(key, JSON.stringify(formData));
        // Marcar que há dados não salvos
        sessionStorage.setItem('hasUnsavedData', 'true');
      } catch (error) {
        console.warn('Erro ao salvar dados do formulário:', error);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [formData, key, storage, debounceMs, isLoading]);

  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const clearFormData = useCallback(() => {
    try {
      const storageObj = storage === 'localStorage' ? localStorage : sessionStorage;
      storageObj.removeItem(key);
      setFormData(defaultValues);
      // Remover marcador de dados não salvos
      sessionStorage.removeItem('hasUnsavedData');
    } catch (error) {
      console.warn('Erro ao limpar dados do formulário:', error);
    }
  }, [key, storage, defaultValues]);

  const markDataAsSaved = useCallback(() => {
    sessionStorage.removeItem('hasUnsavedData');
  }, []);

  return {
    formData,
    updateFormData,
    clearFormData,
    setFormData,
    markDataAsSaved,
    isLoading
  };
};
