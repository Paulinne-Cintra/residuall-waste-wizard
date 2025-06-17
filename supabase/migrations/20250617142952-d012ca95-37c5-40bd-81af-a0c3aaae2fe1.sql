
-- Garantir que RLS está habilitado nas tabelas necessárias
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member_projects ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes nas outras tabelas (não profiles)
DROP POLICY IF EXISTS "Users can view invitations they sent or received" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can create team invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can create invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can update invitations they sent or received" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can delete invitations they sent" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can delete their own invitations" ON public.team_invitations;

DROP POLICY IF EXISTS "Users can view project associations they own or are part of" ON public.team_member_projects;
DROP POLICY IF EXISTS "Project owners can create team member associations" ON public.team_member_projects;
DROP POLICY IF EXISTS "Project owners can update team member associations" ON public.team_member_projects;
DROP POLICY IF EXISTS "Project owners can delete team member associations" ON public.team_member_projects;

-- Criar função de segurança para verificar se um usuário pode gerenciar perfil de membro convidado
CREATE OR REPLACE FUNCTION public.can_manage_team_member_profile(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.team_invitations 
    WHERE invited_by_user_id = auth.uid() 
    AND email = (SELECT email FROM public.profiles WHERE id = target_user_id)
  );
$$;

-- Adicionar política para profiles que permite ver membros convidados (somente se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can view own profile and invited members'
  ) THEN
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    CREATE POLICY "Users can view own profile and invited members" ON public.profiles
    FOR SELECT USING (
      auth.uid() = id OR 
      public.can_manage_team_member_profile(id)
    );
  END IF;
END $$;

-- Adicionar política para deletar perfis de membros convidados (somente se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users can delete own profile and invited members'
  ) THEN
    DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
    CREATE POLICY "Users can delete own profile and invited members" ON public.profiles
    FOR DELETE USING (
      auth.uid() = id OR 
      public.can_manage_team_member_profile(id)
    );
  END IF;
END $$;

-- POLÍTICAS PARA TEAM_INVITATIONS
CREATE POLICY "Users can view sent and received invitations" ON public.team_invitations
FOR SELECT USING (
  auth.uid() = invited_by_user_id OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can create invitations" ON public.team_invitations
FOR INSERT WITH CHECK (auth.uid() = invited_by_user_id);

CREATE POLICY "Users can update sent and received invitations" ON public.team_invitations
FOR UPDATE USING (
  auth.uid() = invited_by_user_id OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "Users can delete sent invitations" ON public.team_invitations
FOR DELETE USING (auth.uid() = invited_by_user_id);

-- POLÍTICAS PARA TEAM_MEMBER_PROJECTS
CREATE POLICY "Users can view project team associations" ON public.team_member_projects
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = team_member_projects.project_id 
    AND projects.user_id = auth.uid()
  ) OR 
  auth.uid() = user_id
);

CREATE POLICY "Project owners can create team associations" ON public.team_member_projects
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = team_member_projects.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Project owners can update team associations" ON public.team_member_projects
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = team_member_projects.project_id 
    AND projects.user_id = auth.uid()
  )
);

CREATE POLICY "Project owners can delete team associations" ON public.team_member_projects
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = team_member_projects.project_id 
    AND projects.user_id = auth.uid()
  )
);
