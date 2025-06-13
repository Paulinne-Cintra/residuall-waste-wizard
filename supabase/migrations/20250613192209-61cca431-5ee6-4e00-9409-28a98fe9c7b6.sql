
-- Recriar a view dashboard_metrics sem SECURITY DEFINER
DROP VIEW IF EXISTS public.dashboard_metrics;

CREATE VIEW public.dashboard_metrics AS
SELECT 
    p.user_id,
    COUNT(DISTINCT p.id) as total_projects,
    COUNT(DISTINCT CASE WHEN p.status IN ('em_andamento', 'planejamento') THEN p.id END) as active_projects,
    COUNT(DISTINCT pm.id) as total_materials,
    COALESCE(SUM(we.wasted_quantity), 0) as total_waste_quantity,
    COALESCE(SUM(we.wasted_quantity * pm.cost_per_unit), 0) as total_economy_generated,
    COUNT(DISTINCT we.id) as total_waste_entries
FROM projects p
LEFT JOIN project_materials pm ON p.id = pm.project_id
LEFT JOIN waste_entries we ON pm.id = we.project_material_id
WHERE p.arquivado = false
GROUP BY p.user_id;

-- Recriar a view materials_with_project sem SECURITY DEFINER
DROP VIEW IF EXISTS public.materials_with_project;

CREATE VIEW public.materials_with_project AS
SELECT 
    pm.id,
    pm.project_id,
    p.name as project_name,
    p.status as project_status,
    p.user_id,
    pm.material_type_name,
    pm.category,
    pm.estimated_quantity,
    pm.stock_quantity,
    pm.minimum_quantity,
    pm.cost_per_unit,
    (pm.estimated_quantity * pm.cost_per_unit) as total_estimated_cost,
    CASE 
        WHEN pm.stock_quantity <= pm.minimum_quantity THEN 'Baixo'
        WHEN pm.stock_quantity > pm.minimum_quantity * 2 THEN 'Alto'
        ELSE 'Normal'
    END as stock_status,
    pm.unit_of_measurement,
    pm.dimensions_specs,
    pm.supplier_id,
    pm.created_at,
    pm.updated_at
FROM project_materials pm
INNER JOIN projects p ON pm.project_id = p.id
WHERE p.arquivado = false;

-- Recriar a view project_reports_summary sem SECURITY DEFINER
DROP VIEW IF EXISTS public.project_reports_summary;

CREATE VIEW public.project_reports_summary AS
SELECT 
    p.id as project_id,
    p.user_id,
    p.name as project_name,
    p.location as project_location,
    p.status as project_status,
    p.created_at,
    COUNT(DISTINCT pm.id) as total_materials,
    COALESCE(SUM(pm.estimated_quantity * pm.cost_per_unit), 0) as total_project_cost,
    COALESCE(SUM(we.wasted_quantity), 0) as total_waste_quantity,
    COALESCE(SUM(we.wasted_quantity * pm.cost_per_unit), 0) as total_waste_cost,
    COUNT(DISTINCT we.id) as waste_entries_count
FROM projects p
LEFT JOIN project_materials pm ON p.id = pm.project_id
LEFT JOIN waste_entries we ON pm.id = we.project_material_id
WHERE p.arquivado = false
GROUP BY p.id, p.user_id, p.name, p.location, p.status, p.created_at;

-- Recriar a view projects_with_progress sem SECURITY DEFINER
DROP VIEW IF EXISTS public.projects_with_progress;

CREATE VIEW public.projects_with_progress AS
SELECT 
    p.*,
    COUNT(DISTINCT pm.id) as materials_count,
    COUNT(DISTINCT we.id) as waste_entries_count,
    CASE 
        WHEN p.status = 'concluido' THEN 100
        WHEN p.status = 'em_andamento' THEN 
            CASE 
                WHEN COUNT(DISTINCT pm.id) = 0 THEN 10
                ELSE LEAST(90, 30 + (COUNT(DISTINCT we.id) * 10))
            END
        WHEN p.status = 'planejamento' THEN 
            CASE 
                WHEN COUNT(DISTINCT pm.id) > 0 THEN 20
                ELSE 5
            END
        ELSE 0
    END as progress_percentage
FROM projects p
LEFT JOIN project_materials pm ON p.id = pm.project_id
LEFT JOIN waste_entries we ON pm.id = we.project_material_id
GROUP BY p.id, p.user_id, p.name, p.location, p.status, p.budget, p.start_date, p.planned_end_date, p.project_type, p.responsible_team_contacts, p.description_notes, p.dimensions_details, p.arquivado, p.created_at, p.updated_at;

-- Habilitar RLS nas tabelas base se ainda não estiver habilitado
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_entries ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para a tabela projects se não existirem
DO $$
BEGIN
    -- Verificar se a política já existe antes de criar
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can view their own projects') THEN
        CREATE POLICY "Users can view their own projects" ON public.projects
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can insert their own projects') THEN
        CREATE POLICY "Users can insert their own projects" ON public.projects
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can update their own projects') THEN
        CREATE POLICY "Users can update their own projects" ON public.projects
        FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Users can delete their own projects') THEN
        CREATE POLICY "Users can delete their own projects" ON public.projects
        FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Criar políticas RLS para a tabela project_materials se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'project_materials' AND policyname = 'Users can view materials from their projects') THEN
        CREATE POLICY "Users can view materials from their projects" ON public.project_materials
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.projects 
                WHERE projects.id = project_materials.project_id 
                AND projects.user_id = auth.uid()
            )
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'project_materials' AND policyname = 'Users can insert materials in their projects') THEN
        CREATE POLICY "Users can insert materials in their projects" ON public.project_materials
        FOR INSERT WITH CHECK (
            EXISTS (
                SELECT 1 FROM public.projects 
                WHERE projects.id = project_materials.project_id 
                AND projects.user_id = auth.uid()
            )
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'project_materials' AND policyname = 'Users can update materials in their projects') THEN
        CREATE POLICY "Users can update materials in their projects" ON public.project_materials
        FOR UPDATE USING (
            EXISTS (
                SELECT 1 FROM public.projects 
                WHERE projects.id = project_materials.project_id 
                AND projects.user_id = auth.uid()
            )
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'project_materials' AND policyname = 'Users can delete materials from their projects') THEN
        CREATE POLICY "Users can delete materials from their projects" ON public.project_materials
        FOR DELETE USING (
            EXISTS (
                SELECT 1 FROM public.projects 
                WHERE projects.id = project_materials.project_id 
                AND projects.user_id = auth.uid()
            )
        );
    END IF;
END $$;

-- Criar políticas RLS para a tabela waste_entries se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'waste_entries' AND policyname = 'Users can view waste entries from their projects') THEN
        CREATE POLICY "Users can view waste entries from their projects" ON public.waste_entries
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.project_materials pm
                JOIN public.projects p ON pm.project_id = p.id
                WHERE pm.id = waste_entries.project_material_id 
                AND p.user_id = auth.uid()
            )
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'waste_entries' AND policyname = 'Users can insert waste entries in their projects') THEN
        CREATE POLICY "Users can insert waste entries in their projects" ON public.waste_entries
        FOR INSERT WITH CHECK (
            EXISTS (
                SELECT 1 FROM public.project_materials pm
                JOIN public.projects p ON pm.project_id = p.id
                WHERE pm.id = waste_entries.project_material_id 
                AND p.user_id = auth.uid()
            )
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'waste_entries' AND policyname = 'Users can update waste entries in their projects') THEN
        CREATE POLICY "Users can update waste entries in their projects" ON public.waste_entries
        FOR UPDATE USING (
            EXISTS (
                SELECT 1 FROM public.project_materials pm
                JOIN public.projects p ON pm.project_id = p.id
                WHERE pm.id = waste_entries.project_material_id 
                AND p.user_id = auth.uid()
            )
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'waste_entries' AND policyname = 'Users can delete waste entries from their projects') THEN
        CREATE POLICY "Users can delete waste entries from their projects" ON public.waste_entries
        FOR DELETE USING (
            EXISTS (
                SELECT 1 FROM public.project_materials pm
                JOIN public.projects p ON pm.project_id = p.id
                WHERE pm.id = waste_entries.project_material_id 
                AND p.user_id = auth.uid()
            )
        );
    END IF;
END $$;
