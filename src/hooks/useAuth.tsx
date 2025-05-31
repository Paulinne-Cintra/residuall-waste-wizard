
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Configurar listener de mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Atualizar estados imediatamente
        setSession(session);
        setUser(session?.user ?? null);
        
        // Garantir que loading seja false após qualquer mudança de estado
        if (event === 'SIGNED_OUT' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // DEPOIS obter sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        if (mounted) {
          console.log('Initial session:', session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('Starting sign up process for:', email);
      console.log('Metadata being sent:', metadata);
      
      // Validar dados obrigatórios
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Preparar metadata com validação
      const userMetadata = {
        full_name: metadata?.full_name || '',
        phone_number: metadata?.phone_number || '',
        professional_role: metadata?.professional_role || '',
        ...metadata
      };

      console.log('Final metadata:', userMetadata);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
          emailRedirectTo: `${window.location.origin}/dashboard`
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up successful:', data);

      // Se o usuário foi criado mas precisa confirmar email
      if (data.user && !data.session) {
        toast({
          title: "Verifique seu email",
          description: "Enviamos um link de confirmação para seu email. Clique no link para ativar sua conta.",
          variant: "default",
        });
        return;
      }

      // Se o usuário foi criado e logado automaticamente
      if (data.user && data.session) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo à RESIDUALL!",
        });
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error in signUp:', authError);
      
      let errorMessage = authError.message;
      
      // Traduzir mensagens de erro comuns
      if (authError.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
      } else if (authError.message.includes('Invalid email')) {
        errorMessage = 'Email inválido. Por favor, verifique o formato.';
      } else if (authError.message.includes('Password should be')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (authError.message.includes('Unable to validate email address')) {
        errorMessage = 'Não foi possível validar o endereço de email. Verifique se está correto.';
      } else if (authError.message.includes('Database error')) {
        errorMessage = 'Erro interno do sistema. Tente novamente em alguns instantes.';
      }
      
      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process for:', email);
      
      // Validar dados obrigatórios
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful:', data);

      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta!",
      });
    } catch (error) {
      const authError = error as AuthError;
      console.error('Error in signIn:', authError);
      
      let errorMessage = authError.message;
      
      // Traduzir mensagens de erro comuns
      if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos. Verifique seus dados e tente novamente.';
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Seu email ainda não foi confirmado. Verifique sua caixa de entrada e clique no link de confirmação.';
      } else if (authError.message.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas de login. Aguarde alguns minutos e tente novamente.';
      } else if (authError.message.includes('Invalid email')) {
        errorMessage = 'Email inválido. Verifique o formato do email.';
      }
      
      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Limpar estados imediatamente ANTES do signOut do Supabase
      setUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro no logout",
        description: authError.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: { name?: string; avatar_url?: string }) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          ...updates,
        });

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
