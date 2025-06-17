
-- Verificar se existe uma política para permitir que usuários deletem perfis de membros de sua equipe
-- Como não existe uma relação direta entre profiles e team ownership, vamos criar uma função auxiliar

-- Função para verificar se um usuário pode deletar outro perfil
-- (baseado na lógica de que se o usuário convidou alguém, ele pode remover)
CREATE OR REPLACE FUNCTION public.can_delete_team_member_profile(target_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.team_invitations 
    WHERE invited_by_user_id = auth.uid() 
    AND email = (SELECT email FROM public.profiles WHERE id = target_user_id)
  );
$$;

-- Política para permitir que usuários deletem perfis de membros que eles convidaram
CREATE POLICY "Users can delete profiles of team members they invited" 
  ON public.profiles 
  FOR DELETE 
  USING (
    id = auth.uid() OR 
    public.can_delete_team_member_profile(id)
  );
