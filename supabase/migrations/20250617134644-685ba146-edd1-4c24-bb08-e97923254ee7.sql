
-- Habilitar RLS nas tabelas necessárias se ainda não estiver habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir INSERT em team_invitations
CREATE POLICY "Users can create team invitations" ON public.team_invitations
FOR INSERT WITH CHECK (auth.uid() = invited_by_user_id);

-- Criar política para permitir DELETE em team_invitations (próprios convites)
CREATE POLICY "Users can delete their own invitations" ON public.team_invitations
FOR DELETE USING (auth.uid() = invited_by_user_id);

-- Criar política para permitir DELETE em profiles (membros convidados por eles)
CREATE POLICY "Users can delete profiles of members they invited" ON public.profiles
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.team_invitations 
    WHERE invited_by_user_id = auth.uid() 
    AND email = profiles.email
  )
);

-- Criar política para permitir SELECT em profiles (ver membros convidados)
CREATE POLICY "Users can view profiles of members they invited" ON public.profiles
FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.team_invitations 
    WHERE invited_by_user_id = auth.uid() 
    AND email = profiles.email
  )
);
