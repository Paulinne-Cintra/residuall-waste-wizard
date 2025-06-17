
-- Reescrita completa do esquema e políticas RLS para a página de Perfil
-- Garantir que RLS está habilitado em todas as tabelas relevantes
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_status ENABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes para recriar do zero
DROP POLICY IF EXISTS "Users can view own profile and invited members" ON public.profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile and invited members" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own login history" ON public.login_history;
DROP POLICY IF EXISTS "Users can view their own payment status" ON public.payment_status;

-- Remover políticas de storage existentes
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- POLÍTICAS PARA TABELA PROFILES
-- Política SELECT: Usuários podem visualizar apenas seu próprio perfil
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Política INSERT: Usuários podem criar apenas seu próprio perfil
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Política UPDATE: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Política DELETE: Usuários podem deletar apenas seu próprio perfil
CREATE POLICY "profiles_delete_own" ON public.profiles
FOR DELETE USING (auth.uid() = id);

-- POLÍTICAS PARA TABELA LOGIN_HISTORY
-- Política SELECT: Usuários podem visualizar apenas seu próprio histórico
CREATE POLICY "login_history_select_own" ON public.login_history
FOR SELECT USING (auth.uid() = user_id);

-- POLÍTICAS PARA TABELA PAYMENT_STATUS
-- Política SELECT: Usuários podem visualizar apenas seu próprio status de pagamento
CREATE POLICY "payment_status_select_own" ON public.payment_status
FOR SELECT USING (auth.uid() = user_id);

-- Política INSERT: Usuários podem criar apenas seu próprio status de pagamento
CREATE POLICY "payment_status_insert_own" ON public.payment_status
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política UPDATE: Usuários podem atualizar apenas seu próprio status de pagamento
CREATE POLICY "payment_status_update_own" ON public.payment_status
FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- CONFIGURAÇÃO DO STORAGE BUCKET PARA AVATARS
-- Garantir que o bucket avatars existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- POLÍTICAS PARA STORAGE DE AVATARS
-- Política SELECT: Avatars são publicamente acessíveis
CREATE POLICY "avatars_public_select" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Política INSERT: Usuários podem fazer upload apenas de seus próprios avatars
CREATE POLICY "avatars_insert_own" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política UPDATE: Usuários podem atualizar apenas seus próprios avatars
CREATE POLICY "avatars_update_own" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política DELETE: Usuários podem deletar apenas seus próprios avatars
CREATE POLICY "avatars_delete_own" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_status_user_id ON public.payment_status(user_id);

-- Trigger para atualizar updated_at automaticamente na tabela profiles
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at_trigger ON public.profiles;
CREATE TRIGGER profiles_updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();
