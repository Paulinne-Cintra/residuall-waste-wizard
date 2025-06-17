
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  professional_role?: string;
  biografia?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

interface LoginHistoryEntry {
  id: string;
  login_date: string;
  device_info?: string;
  location?: string;
  success: boolean;
}

interface PaymentStatus {
  id: string;
  payment_completed: boolean;
  subscription_active: boolean;
  plan_name?: string;
  subscription_expires_at?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Estados principais
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  
  // Estados de loading
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Função para carregar perfil do usuário
  const loadProfile = async (): Promise<boolean> => {
    if (!user) {
      console.log('👤 No user found, skipping profile load');
      setLoading(false);
      return false;
    }

    try {
      console.log('📋 Loading profile for user:', user.id);
      
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error loading profile:', error);
        throw error;
      }

      if (existingProfile) {
        console.log('✅ Profile found:', existingProfile);
        setProfile(existingProfile);
        return true;
      } else {
        // Criar perfil padrão para novo usuário
        console.log('🔧 Creating default profile for new user...');
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone_number: user.user_metadata?.phone_number || '',
          professional_role: user.user_metadata?.professional_role || '',
          biografia: '',
          avatar_url: user.user_metadata?.avatar_url || '',
        };

        const { data: createdProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creating profile:', insertError);
          throw insertError;
        }

        console.log('✅ Profile created successfully:', createdProfile);
        setProfile(createdProfile);
        return true;
      }
    } catch (err: any) {
      console.error('💥 Error in loadProfile:', err);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar seus dados. Tente recarregar a página.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para carregar histórico de login
  const loadLoginHistory = async () => {
    if (!user) return;

    try {
      console.log('📊 Loading login history...');
      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', user.id)
        .order('login_date', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Error loading login history:', error);
        return;
      }

      console.log('✅ Login history loaded:', data?.length || 0, 'entries');
      setLoginHistory(data || []);
    } catch (err) {
      console.error('💥 Error loading login history:', err);
    }
  };

  // Função para carregar status de pagamento
  const loadPaymentStatus = async () => {
    if (!user) return;

    try {
      console.log('💳 Loading payment status...');
      const { data, error } = await supabase
        .from('payment_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error loading payment status:', error);
        return;
      }

      console.log('✅ Payment status loaded:', data);
      setPaymentStatus(data);
    } catch (err) {
      console.error('💥 Error loading payment status:', err);
    }
  };

  // Função para atualizar perfil
  const updateProfile = async (updates: Partial<Profile>): Promise<boolean> => {
    if (!user || !profile) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado ou perfil não carregado.",
        variant: "destructive",
      });
      return false;
    }

    setUpdating(true);
    try {
      console.log('📝 Updating profile with:', updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating profile:', error);
        throw error;
      }

      console.log('✅ Profile updated successfully:', data);
      setProfile(data);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });

      return true;
    } catch (err: any) {
      console.error('💥 Error updating profile:', err);
      
      let errorMessage = "Não foi possível salvar suas alterações.";
      if (err.code === '42501') {
        errorMessage = "Você não tem permissão para atualizar este perfil.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Função para upload de avatar
  const uploadAvatar = async (file: File): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return false;
    }

    // Validações do arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem JPEG, PNG ou WebP.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 2MB.",
        variant: "destructive",
      });
      return false;
    }

    setUploadingAvatar(true);
    try {
      console.log('📤 Uploading avatar:', file.name);

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('❌ Error uploading avatar:', uploadError);
        throw uploadError;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('🔗 Public URL generated:', publicUrl);

      // Atualizar perfil com nova URL
      const success = await updateProfile({ avatar_url: publicUrl });
      
      if (success) {
        toast({
          title: "Foto atualizada",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      }

      return success;
    } catch (err: any) {
      console.error('💥 Error uploading avatar:', err);
      toast({
        title: "Erro no upload",
        description: `Não foi possível fazer upload da foto: ${err.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Função para alterar senha
  const changePassword = async (newPassword: string): Promise<boolean> => {
    setChangingPassword(true);
    try {
      console.log('🔐 Changing password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Error changing password:', error);
        throw error;
      }

      console.log('✅ Password changed successfully');
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });

      return true;
    } catch (err: any) {
      console.error('💥 Error changing password:', err);
      toast({
        title: "Erro ao alterar senha",
        description: err.message || "Não foi possível alterar sua senha.",
        variant: "destructive",
      });
      return false;
    } finally {
      setChangingPassword(false);
    }
  };

  // Função para recarregar todos os dados
  const refetch = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProfile(),
        loadLoginHistory(),
        loadPaymentStatus()
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Effect para carregar dados quando usuário muda
  useEffect(() => {
    if (user) {
      console.log('👤 User changed, loading profile data...');
      refetch();
    } else {
      // Limpar dados quando usuário faz logout
      setProfile(null);
      setLoginHistory([]);
      setPaymentStatus(null);
      setLoading(false);
    }
  }, [user]);

  return {
    // Estados
    profile,
    loginHistory,
    paymentStatus,
    loading,
    updating,
    uploadingAvatar,
    changingPassword,
    
    // Funções
    updateProfile,
    uploadAvatar,
    changePassword,
    refetch,
  };
};
