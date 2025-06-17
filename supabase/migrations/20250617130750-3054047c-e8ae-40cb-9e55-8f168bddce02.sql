
-- Add missing RLS policies for team_invitations and profiles

-- Enable RLS on team_invitations if not already enabled
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Add INSERT policy for team_invitations to allow users to create invitations
DROP POLICY IF EXISTS "Users can insert their own invitations" ON public.team_invitations;
CREATE POLICY "Users can insert their own invitations" ON public.team_invitations
FOR INSERT WITH CHECK (auth.uid() = invited_by_user_id);

-- Add DELETE policy for profiles to allow deletion of team member profiles
DROP POLICY IF EXISTS "Users can delete team member profiles they manage" ON public.profiles;
CREATE POLICY "Users can delete team member profiles they manage" ON public.profiles
FOR DELETE USING (
  auth.uid() = id OR 
  public.can_delete_team_member_profile(id)
);

-- Ensure team_member_projects has proper DELETE policy
DROP POLICY IF EXISTS "Users can delete team member project associations" ON public.team_member_projects;
CREATE POLICY "Users can delete team member project associations" ON public.team_member_projects
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = team_member_projects.project_id 
    AND projects.user_id = auth.uid()
  )
);
