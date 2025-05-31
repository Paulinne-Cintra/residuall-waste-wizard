
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  id?: string;
  user_id: string;
  language: string;
  theme: string;
  email_notifications: boolean;
  system_alerts: boolean;
  project_updates: boolean;
  recommendation_alerts: boolean;
  weekly_summary: boolean;
  browser_notifications: boolean;
  sms_notifications: boolean;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
}

interface LoginHistoryEntry {
  id: string;
  login_date: string;
  device_info: string | null;
  location: string | null;
  success: boolean;
}

export const useUserSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar configurações do usuário
  const loadSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Carregando configurações do usuário:', user.id);
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }

      if (data) {
        setSettings(data);
        console.log('Configurações carregadas:', data);
        
        // Aplicar configurações ao localStorage
        localStorage.setItem('user-language', data.language);
        localStorage.setItem('user-theme', data.theme);
      } else {
        // Criar configurações padrão se não existirem
        const defaultSettings: Omit<UserSettings, 'id'> = {
          user_id: user.id,
          language: 'pt-br',
          theme: 'sistema',
          email_notifications: false,
          system_alerts: false,
          project_updates: true,
          recommendation_alerts: true,
          weekly_summary: false,
          browser_notifications: false,
          sms_notifications: false,
          two_factor_enabled: false,
        };

        const { data: newSettings, error: insertError } = await supabase
          .from('user_settings')
          .insert(defaultSettings)
          .select()
          .single();

        if (insertError) throw insertError;
        
        setSettings(newSettings);
        console.log('Configurações padrão criadas:', newSettings);
      }
    } catch (err: any) {
      console.error('Erro ao carregar configurações:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carregar histórico de login
  const loadLoginHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', user.id)
        .order('login_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setLoginHistory(data || []);
      console.log('Histórico de login carregado:', data);
    } catch (err: any) {
      console.error('Erro ao carregar histórico de login:', err);
    }
  };

  // Atualizar configurações individuais
  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user || !settings) return false;

    try {
      console.log('Atualizando configurações:', updates);
      
      const { data, error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      
      // Atualizar localStorage se necessário
      if (updates.language) {
        localStorage.setItem('user-language', updates.language);
      }
      if (updates.theme) {
        localStorage.setItem('user-theme', updates.theme);
      }

      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar configurações:', err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas configurações. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Salvar todas as configurações de uma vez
  const saveAllSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user || !settings) return false;

    setSaving(true);
    try {
      console.log('Salvando todas as configurações:', newSettings);
      
      const { data, error } = await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      
      // Atualizar localStorage
      if (newSettings.language) {
        localStorage.setItem('user-language', newSettings.language);
      }
      if (newSettings.theme) {
        localStorage.setItem('user-theme', newSettings.theme);
      }
      
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
        variant: "default",
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao salvar configurações:', err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas configurações. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadSettings();
      loadLoginHistory();
    } else {
      setSettings(null);
      setLoginHistory([]);
      setLoading(false);
    }
  }, [user]);

  return {
    settings,
    loginHistory,
    loading,
    saving,
    error,
    updateSettings,
    saveAllSettings,
    refetch: loadSettings,
  };
};
