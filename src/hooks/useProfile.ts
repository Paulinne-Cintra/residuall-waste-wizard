
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  cargo?: string;
  biografia?: string;
  avatar_url?: string;
  created_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Carregar perfil do usuário
  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Carregando perfil do usuário:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }

      if (data) {
        setProfile(data);
        console.log('Perfil carregado:', data);
      } else {
        // Criar perfil padrão se não existir
        const defaultProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone_number: user.user_metadata?.phone_number || '',
          cargo: user.user_metadata?.cargo || '',
          biografia: '',
          avatar_url: user.user_metadata?.avatar_url || '',
        };

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select()
          .single();

        if (insertError) throw insertError;
        
        setProfile(newProfile);
        console.log('Perfil padrão criado:', newProfile);
      }
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Atualizar dados do perfil
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return false;

    setUpdating(true);
    try {
      console.log('Atualizando perfil:', updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas alterações. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Upload de avatar
  const uploadAvatar = async (file: File) => {
    if (!user) return false;

    setUploadingAvatar(true);
    try {
      console.log('Fazendo upload do avatar:', file.name);

      // Remover avatar anterior se existir
      if (profile?.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${oldFileName}`]);
        }
      }

      // Upload do novo arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

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
      console.error('Erro ao fazer upload do avatar:', err);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da foto. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Alterar senha
  const changePassword = async (newPassword: string) => {
    try {
      console.log('Alterando senha...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err);
      toast({
        title: "Erro ao alterar senha",
        description: err.message || "Não foi possível alterar sua senha. Tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    loading,
    updating,
    uploadingAvatar,
    updateProfile,
    uploadAvatar,
    changePassword,
    refetch: loadProfile,
  };
};
