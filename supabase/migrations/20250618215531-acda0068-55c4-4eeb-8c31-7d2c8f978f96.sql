
-- Criar função RPC para busca global de dados do usuário
CREATE OR REPLACE FUNCTION public.global_search(
  search_term text,
  user_id_param uuid
)
RETURNS TABLE(
  result_type text,
  result_id uuid,
  title text,
  description text,
  additional_info text,
  created_at timestamp with time zone,
  relevance_score integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  -- Buscar em projetos
  SELECT 
    'projeto'::text as result_type,
    p.id as result_id,
    p.name as title,
    COALESCE(p.description_notes, p.location, '') as description,
    p.status as additional_info,
    p.created_at,
    CASE 
      WHEN p.name ILIKE '%' || search_term || '%' THEN 10
      WHEN p.location ILIKE '%' || search_term || '%' THEN 8
      WHEN p.description_notes ILIKE '%' || search_term || '%' THEN 6
      WHEN p.status ILIKE '%' || search_term || '%' THEN 4
      ELSE 1
    END as relevance_score
  FROM projects p
  WHERE p.user_id = user_id_param 
    AND p.arquivado = false
    AND (
      p.name ILIKE '%' || search_term || '%' OR
      p.location ILIKE '%' || search_term || '%' OR
      p.description_notes ILIKE '%' || search_term || '%' OR
      p.status ILIKE '%' || search_term || '%'
    )

  UNION ALL

  -- Buscar em materiais de projeto
  SELECT 
    'material'::text as result_type,
    pm.id as result_id,
    pm.material_type_name as title,
    COALESCE(pm.category, '') as description,
    p.name as additional_info,
    pm.created_at,
    CASE 
      WHEN pm.material_type_name ILIKE '%' || search_term || '%' THEN 10
      WHEN pm.category ILIKE '%' || search_term || '%' THEN 8
      WHEN pm.dimensions_specs ILIKE '%' || search_term || '%' THEN 6
      ELSE 1
    END as relevance_score
  FROM project_materials pm
  INNER JOIN projects p ON pm.project_id = p.id
  WHERE p.user_id = user_id_param 
    AND p.arquivado = false
    AND (
      pm.material_type_name ILIKE '%' || search_term || '%' OR
      pm.category ILIKE '%' || search_term || '%' OR
      pm.dimensions_specs ILIKE '%' || search_term || '%'
    )

  UNION ALL

  -- Buscar em relatórios
  SELECT 
    'relatorio'::text as result_type,
    r.id as result_id,
    r.title as title,
    COALESCE(r.content, '') as description,
    r.report_type as additional_info,
    r.created_at,
    CASE 
      WHEN r.title ILIKE '%' || search_term || '%' THEN 10
      WHEN r.content ILIKE '%' || search_term || '%' THEN 8
      WHEN r.report_type ILIKE '%' || search_term || '%' THEN 6
      ELSE 1
    END as relevance_score
  FROM reports r
  WHERE r.user_id = user_id_param 
    AND (
      r.title ILIKE '%' || search_term || '%' OR
      r.content ILIKE '%' || search_term || '%' OR
      r.report_type ILIKE '%' || search_term || '%'
    )

  UNION ALL

  -- Buscar em entradas de desperdício
  SELECT 
    'desperdicio'::text as result_type,
    we.id as result_id,
    CONCAT('Desperdício - ', pm.material_type_name) as title,
    COALESCE(we.notes, we.waste_cause_category, '') as description,
    p.name as additional_info,
    we.created_at,
    CASE 
      WHEN pm.material_type_name ILIKE '%' || search_term || '%' THEN 10
      WHEN we.notes ILIKE '%' || search_term || '%' THEN 8
      WHEN we.waste_cause_category ILIKE '%' || search_term || '%' THEN 6
      WHEN we.project_stage ILIKE '%' || search_term || '%' THEN 4
      ELSE 1
    END as relevance_score
  FROM waste_entries we
  INNER JOIN project_materials pm ON we.project_material_id = pm.id
  INNER JOIN projects p ON pm.project_id = p.id
  WHERE p.user_id = user_id_param 
    AND p.arquivado = false
    AND (
      pm.material_type_name ILIKE '%' || search_term || '%' OR
      we.notes ILIKE '%' || search_term || '%' OR
      we.waste_cause_category ILIKE '%' || search_term || '%' OR
      we.project_stage ILIKE '%' || search_term || '%'
    )

  UNION ALL

  -- Buscar em documentos de projeto
  SELECT 
    'documento'::text as result_type,
    pd.id as result_id,
    pd.file_name as title,
    COALESCE(pd.description, '') as description,
    p.name as additional_info,
    pd.uploaded_at as created_at,
    CASE 
      WHEN pd.file_name ILIKE '%' || search_term || '%' THEN 10
      WHEN pd.description ILIKE '%' || search_term || '%' THEN 8
      ELSE 1
    END as relevance_score
  FROM project_documents pd
  INNER JOIN projects p ON pd.project_id = p.id
  WHERE p.user_id = user_id_param 
    AND p.arquivado = false
    AND (
      pd.file_name ILIKE '%' || search_term || '%' OR
      pd.description ILIKE '%' || search_term || '%'
    )

  ORDER BY relevance_score DESC, created_at DESC
  LIMIT 50;
END;
$$;

-- Garantir que as políticas RLS estão corretas para todas as tabelas envolvidas
-- Verificar se as políticas SELECT existem para as tabelas principais

-- Política para projects (já deve existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'projects' 
    AND policyname = 'Users can view their own projects'
  ) THEN
    CREATE POLICY "Users can view their own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Política para project_materials
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'project_materials' 
    AND policyname = 'Users can view materials from their projects'
  ) THEN
    CREATE POLICY "Users can view materials from their projects" ON public.project_materials
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = project_materials.project_id 
        AND projects.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Política para reports
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'reports' 
    AND policyname = 'Users can view their own reports'
  ) THEN
    CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

-- Política para waste_entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'waste_entries' 
    AND policyname = 'Users can view waste entries from their projects'
  ) THEN
    CREATE POLICY "Users can view waste entries from their projects" ON public.waste_entries
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM project_materials pm
        INNER JOIN projects p ON pm.project_id = p.id
        WHERE pm.id = waste_entries.project_material_id 
        AND p.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Política para project_documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'project_documents' 
    AND policyname = 'Users can view documents from their projects'
  ) THEN
    CREATE POLICY "Users can view documents from their projects" ON public.project_documents
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = project_documents.project_id 
        AND projects.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Habilitar RLS em todas as tabelas se ainda não estiver habilitado
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;
