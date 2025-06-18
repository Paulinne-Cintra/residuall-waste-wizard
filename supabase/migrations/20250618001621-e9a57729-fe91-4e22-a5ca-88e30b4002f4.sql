
-- LIMPEZA COMPLETA E RECRIAÇÃO DAS POLÍTICAS RLS PARA PERFIL
-- Primeiro, removemos TODAS as políticas existentes da tabela profiles para evitar conflitos

-- Remover todas as políticas duplicadas e conflitantes da tabela profiles
DROP POLICY IF EXISTS "Users can view own profile and invited members" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile and invited members" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Garantir que RLS permanece habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- CRIAR POLÍTICAS RLS ÚNICAS E CORRETAS PARA A TABELA PROFILES
-- Cada operação terá apenas UMA política clara e específica

-- Política SELECT: Usuário pode visualizar apenas seu próprio perfil
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Política INSERT: Usuário pode criar apenas seu próprio perfil
CREATE POLICY "Users can create their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Política UPDATE: Usuário pode atualizar apenas seu próprio perfil
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Política DELETE: Usuário pode deletar apenas seu próprio perfil (opcional)
CREATE POLICY "Users can delete their own profile" ON public.profiles
FOR DELETE USING (auth.uid() = id);

-- Verificar e limpar também as políticas de login_history e payment_status
DROP POLICY IF EXISTS "login_history_select_own" ON public.login_history;
DROP POLICY IF EXISTS "Users can view their own login history" ON public.login_history;

DROP POLICY IF EXISTS "payment_status_select_own" ON public.payment_status;
DROP POLICY IF EXISTS "payment_status_insert_own" ON public.payment_status;
DROP POLICY IF EXISTS "payment_status_update_own" ON public.payment_status;
DROP POLICY IF EXISTS "Users can view their own payment status" ON public.payment_status;
DROP POLICY IF EXISTS "Users can insert their own payment status" ON public.payment_status;
DROP POLICY IF EXISTS "Users can update their own payment status" ON public.payment_status;

-- Recriar políticas limpas para login_history
CREATE POLICY "Users can view their own login history" ON public.login_history
FOR SELECT USING (auth.uid() = user_id);

-- Recriar políticas limpas para payment_status
CREATE POLICY "Users can view their own payment status" ON public.payment_status
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment status" ON public.payment_status
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment status" ON public.payment_status
FOR UPDATE USING (auth.uid() = user_id);

-- Verificar bucket de avatars e políticas de storage
-- Limpar políticas de storage duplicadas
DROP POLICY IF EXISTS "avatars_public_select" ON storage.objects;
DROP POLICY IF EXISTS "avatars_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "avatars_update_own" ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete_own" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- Garantir que o bucket existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas limpas para storage de avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
