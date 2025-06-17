
-- Primeiro, garantir que RLS está habilitado nas tabelas necessárias
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member_projects ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se necessário e recriar com nomes únicos
DROP POLICY IF EXISTS "Users can view their own profile and invited members profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view invitations they sent or received" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can create invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can update invitations they sent or received" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can delete invitations they sent" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can view project associations they own or are part of" ON public.team_member_projects;
DROP POLICY IF EXISTS "Project owners can create team member associations" ON public.team_member_projects;
DROP POLICY IF EXISTS "Project owners can update team member associations" ON public.team_member_projects;
DROP POLICY IF EXISTS "Project owners can delete team member associations" ON public.team_member_projects;

-- Políticas para tabela profiles
-- Permitir que usuários vejam seus próprios perfis e perfis de membros que eles convidaram
CREATE POLICY "Users can view their own profile and invited members profiles" ON public.profiles
FOR SELECT USING (
  auth.uid() = id OR 
  public.can_delete_team_member_profile(id)
);

-- Políticas para tabela team_invitations
-- Permitir que usuários vejam convites que enviaram ou receberam
CREATE POLICY "Users can view invitations they sent or received" ON public.team_invitations
FOR SELECT USING (
  auth.uid() = invited_by_user_id OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Permitir que usuários criem convites
CREATE POLICY "Users can create invitations" ON public.team_invitations
FOR INSERT WITH CHECK (auth.uid() = invited_by_user_id);

-- Permitir que usuários atualizem convites que enviaram ou receberam
CREATE POLICY "Users can update invitations they sent or received" ON public.team_invitations
FOR UPDATE USING (
  auth.uid() = invited_by_user_id OR 
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Permitir que usuários deletem convites que enviaram
CREATE POLICY "Users can delete invitations they sent" ON public.team_invitations
FOR DELETE USING (auth.uid() = invited_by_user_id);

-- Políticas para tabela team_member_projects
-- Permitir que usuários vejam associações de projetos onde são donos do projeto ou são o membro
CREATE POLICY "Users can view project associations they own or are part of" ON public.team_member_projects
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = team_member_projects.project_id 
    AND projects.user_id = auth.uid()
  ) OR 
  auth.uid() = user_id
);

-- Permitir que donos de projetos criem associações
CREATE POLICY "Project owners can create team member associations" ON public.team_member_projects
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = team_member_projects.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Permitir que donos de projetos atualizem associações
CREATE POLICY "Project owners can update team member associations" ON public.team_member_projects
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = team_member_projects.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Permitir que donos de projetos deletem associações
CREATE POLICY "Project owners can delete team member associations" ON public.team_member_projects
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = team_member_projects.project_id 
    AND projects.user_id = auth.uid()
  )
);
