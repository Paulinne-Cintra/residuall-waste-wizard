
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
  professional_role?: string;
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

  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('📋 Loading profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Error loading profile:', error);
        throw error;
      }

      if (data) {
        setProfile(data);
        console.log('✅ Profile loaded successfully:', data);
      } else {
        // Criar perfil padrão se não existir
        console.log('🔧 Creating default profile...');
        const defaultProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone_number: user.user_metadata?.phone_number || '',
          cargo: user.user_metadata?.cargo || '',
          professional_role: user.user_metadata?.professional_role || '',
          biografia: '',
          avatar_url: user.user_metadata?.avatar_url || '',
        };

        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile)
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creating default profile:', insertError);
          throw insertError;
        }
        
        setProfile(newProfile);
        console.log('✅ Default profile created:', newProfile);
      }
    } catch (err: any) {
      console.error('💥 Error in loadProfile:', err);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar seus dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
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
      console.log('📝 Updating profile with data:', updates);
      
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

      setProfile(data);
      console.log('✅ Profile updated successfully:', data);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });

      return true;
    } catch (err: any) {
      console.error('💥 Error updating profile:', err);
      
      let errorMessage = "Não foi possível salvar suas alterações. Tente novamente.";
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

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      return false;
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem JPEG, PNG ou WebP.",
        variant: "destructive",
      });
      return false;
    }

    // Validar tamanho (2MB máximo)
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
      const fileName = `avatar.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

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

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('🔗 Public URL generated:', publicUrl);

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

  const changePassword = async (newPassword: string) => {
    try {
      console.log('🔐 Changing password...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Error changing password:', error);
        throw error;
      }

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });

      return true;
    } catch (err: any) {
      console.error('💥 Error changing password:', err);
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
