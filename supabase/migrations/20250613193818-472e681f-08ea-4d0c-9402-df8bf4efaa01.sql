
-- Recriar todas as views com SECURITY INVOKER explícito para garantir que respeitem RLS

-- View dashboard_metrics
DROP VIEW IF EXISTS public.dashboard_metrics CASCADE;

CREATE VIEW public.dashboard_metrics 
WITH (security_invoker = true) AS
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

-- View materials_with_project
DROP VIEW IF EXISTS public.materials_with_project CASCADE;

CREATE VIEW public.materials_with_project 
WITH (security_invoker = true) AS
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

-- View project_reports_summary
DROP VIEW IF EXISTS public.project_reports_summary CASCADE;

CREATE VIEW public.project_reports_summary 
WITH (security_invoker = true) AS
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

-- View projects_with_progress
DROP VIEW IF EXISTS public.projects_with_progress CASCADE;

CREATE VIEW public.projects_with_progress 
WITH (security_invoker = true) AS
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
