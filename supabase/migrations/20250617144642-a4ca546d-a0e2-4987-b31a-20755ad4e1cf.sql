
-- Verificar e corrigir políticas RLS para a tabela profiles
-- Garantir que RLS está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas conflitantes para recriar de forma mais específica
DROP POLICY IF EXISTS "Users can view own profile and invited members" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile and invited members" ON public.profiles;

-- Verificar e criar política FOR SELECT se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can view own profile and invited members'
  ) THEN
    CREATE POLICY "Users can view own profile and invited members" ON public.profiles
    FOR SELECT USING (
      auth.uid() = id OR 
      EXISTS (
        SELECT 1 
        FROM public.team_invitations 
        WHERE invited_by_user_id = auth.uid() 
        AND email = (SELECT email FROM public.profiles WHERE id = profiles.id)
      )
    );
  END IF;
END $$;

-- Verificar e criar política FOR INSERT se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can create own profile'
  ) THEN
    CREATE POLICY "Users can create own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- A política UPDATE já existe, então não precisamos criá-la novamente

-- Verificar e criar política FOR DELETE se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can delete own profile and invited members'
  ) THEN
    CREATE POLICY "Users can delete own profile and invited members" ON public.profiles
    FOR DELETE USING (
      auth.uid() = id OR 
      EXISTS (
        SELECT 1 
        FROM public.team_invitations 
        WHERE invited_by_user_id = auth.uid() 
        AND email = (SELECT email FROM public.profiles WHERE id = profiles.id)
      )
    );
  END IF;
END $$;

-- Garantir que existe um storage bucket para avatars (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Política para storage dos avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
