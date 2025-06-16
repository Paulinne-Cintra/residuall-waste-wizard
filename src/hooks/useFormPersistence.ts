
import { useState, useEffect } from 'react';

interface UseFormPersistenceOptions {
  key: string;
  defaultValue: any;
  autoSave?: boolean;
}

export const useFormPersistence = <T>({ 
  key, 
  defaultValue, 
  autoSave = true 
}: UseFormPersistenceOptions) => {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage quando o hook for inicializado
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setData(parsed);
      }
    } catch (error) {
      console.error(`Erro ao carregar dados do localStorage para a chave "${key}":`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  // Salvar dados no localStorage quando houver mudanças (se autoSave estiver ativo)
  useEffect(() => {
    if (isLoaded && autoSave) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Erro ao salvar dados no localStorage para a chave "${key}":`, error);
      }
    }
  }, [data, key, autoSave, isLoaded]);

  const saveData = (newData: T) => {
    setData(newData);
    if (!autoSave) {
      try {
        localStorage.setItem(key, JSON.stringify(newData));
      } catch (error) {
        console.error(`Erro ao salvar dados manualmente no localStorage para a chave "${key}":`, error);
      }
    }
  };

  const clearData = () => {
    try {
      localStorage.removeItem(key);
      setData(defaultValue);
    } catch (error) {
      console.error(`Erro ao limpar dados do localStorage para a chave "${key}":`, error);
    }
  };

  const updateData = (updater: (prev: T) => T) => {
    setData(prev => {
      const newData = updater(prev);
      if (!autoSave) {
        try {
          localStorage.setItem(key, JSON.stringify(newData));
        } catch (error) {
          console.error(`Erro ao atualizar dados no localStorage para a chave "${key}":`, error);
        }
      }
      return newData;
    });
  };

  return {
    data,
    setData: saveData,
    updateData,
    clearData,
    isLoaded
  };
};
