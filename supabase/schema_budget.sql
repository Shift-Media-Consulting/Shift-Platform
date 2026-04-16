-- SHIFT MEDIA Platform — Budget Schema (Phase 1)
-- Run this in Supabase SQL Editor AFTER the main schema.sql

-- ============================================================
-- BUDGETS
-- One structured budget per production partner per project.
-- Linked to the bid when the partner submits.
-- ============================================================
CREATE TABLE public.budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES public.production_partners(id) ON DELETE CASCADE NOT NULL,
  version TEXT NOT NULL DEFAULT 'V1',
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN (
    'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'
  )),
  director TEXT,
  notes TEXT,
  total_net NUMERIC(12,2) DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BUDGET LINE ITEMS
-- One row per non-zero position in a submitted budget.
-- amount = quantity × days × rate (days defaults to 1)
-- ============================================================
CREATE TABLE public.budget_line_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  budget_id UUID REFERENCES public.budgets(id) ON DELETE CASCADE NOT NULL,
  section_number INTEGER NOT NULL,
  section_name TEXT NOT NULL,
  position_code TEXT NOT NULL,
  name TEXT NOT NULL,
  quantity NUMERIC(10,3) DEFAULT 0,
  days NUMERIC(10,3) DEFAULT 1,
  rate NUMERIC(12,2) DEFAULT 0,
  amount NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_line_items ENABLE ROW LEVEL SECURITY;

-- Admins: full access
CREATE POLICY "Admins manage budgets" ON public.budgets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

CREATE POLICY "Admins manage budget line items" ON public.budget_line_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

-- Production partners can insert/update their own budgets (token-based, no auth)
-- These are handled via service role in the API route, not direct client access.

-- Clients can view approved budgets for their projects
CREATE POLICY "Clients view approved budgets" ON public.budgets
  FOR SELECT USING (
    status = 'Approved' AND
    EXISTS (
      SELECT 1 FROM public.projects pr
      JOIN public.profiles p ON p.client_id = pr.client_id
      WHERE pr.id = budgets.project_id AND p.id = auth.uid()
    )
  );

CREATE POLICY "Clients view approved budget items" ON public.budget_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.budgets b
      JOIN public.projects pr ON pr.id = b.project_id
      JOIN public.profiles p ON p.client_id = pr.client_id
      WHERE b.id = budget_line_items.budget_id AND b.status = 'Approved' AND p.id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGERS
-- ============================================================
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
