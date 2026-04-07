-- SHIFT MEDIA Platform — Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USER PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'shift_admin', 'client', 'production_partner')),
  full_name TEXT,
  email TEXT,
  client_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id TEXT UNIQUE NOT NULL, -- CLT-YYYY-XXXX
  company_name TEXT NOT NULL,
  client_type TEXT NOT NULL CHECK (client_type IN ('Agency', 'Brand', 'Other')),
  main_contact TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  sector TEXT NOT NULL,
  logo_url TEXT,
  other_contacts JSONB DEFAULT '[]',
  notion_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id TEXT UNIQUE NOT NULL, -- PRJ-YYYY-XXXX
  project_name TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  agency_name TEXT,
  agency_contact TEXT,
  agency_contact_email TEXT,
  consultant TEXT NOT NULL,
  sector TEXT NOT NULL,
  project_type TEXT[] NOT NULL DEFAULT '{}',
  buyouts BOOLEAN DEFAULT FALSE,
  buyout_project_id UUID,
  status TEXT NOT NULL DEFAULT 'Setup' CHECK (status IN (
    'Setup', 'Partner Selection', 'In Production', 'Post Production', 'Delivered', 'Archived'
  )),
  brief_summary TEXT,
  brief_url TEXT,
  schedule_url TEXT,
  schedule_data JSONB,
  pibs_url TEXT,
  pibs_summary TEXT,
  budget NUMERIC(12,2),
  questionnaire JSONB,
  questionnaire_approved BOOLEAN DEFAULT FALSE,
  notion_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PRODUCTION PARTNERS
-- ============================================================
CREATE TABLE public.production_partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  creative_name TEXT,
  status TEXT NOT NULL DEFAULT 'Long List' CHECK (status IN (
    'Long List', 'Short List', 'Approached', 'Pitch', 'Awarded', 'Not Awarded'
  )),
  bid_submitted BOOLEAN DEFAULT FALSE,
  bid_approved BOOLEAN DEFAULT FALSE,
  awarded BOOLEAN DEFAULT FALSE,
  portal_token TEXT UNIQUE,
  portal_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BIDS
-- ============================================================
CREATE TABLE public.bids (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES public.production_partners(id) ON DELETE CASCADE NOT NULL,
  creative_url TEXT,
  budget_url TEXT,
  ai_summary TEXT,
  ai_flags JSONB DEFAULT '[]',
  consultant_notes TEXT,
  shift_recommendation TEXT,
  agency_recommendation TEXT,
  not_recommended BOOLEAN DEFAULT FALSE,
  not_recommended_reason TEXT,
  approved_for_client BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BUYOUT PROJECTS
-- ============================================================
CREATE TABLE public.buyout_projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyout_project_id TEXT UNIQUE NOT NULL, -- BYO-YYYY-XXXX
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BUYOUT LINE ITEMS
-- ============================================================
CREATE TABLE public.buyout_line_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyout_project_id UUID REFERENCES public.buyout_projects(id) ON DELETE CASCADE NOT NULL,
  talent_name TEXT NOT NULL,
  talent_type TEXT NOT NULL CHECK (talent_type IN ('Actor', 'VO Artist', 'Musician')),
  role TEXT,
  day_fee NUMERIC(10,2),
  secured BOOLEAN DEFAULT FALSE,
  media_types TEXT[] DEFAULT '{}',
  territories TEXT[] DEFAULT '{}',
  rights_start DATE NOT NULL,
  rights_end DATE NOT NULL,
  buyout_fee NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Pending Renewal', 'Renewed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- OVERAGES
-- ============================================================
CREATE TABLE public.overages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  document_url TEXT,
  amount NUMERIC(10,2) NOT NULL,
  category TEXT,
  description TEXT,
  ai_analysis TEXT,
  consultant_note TEXT,
  status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (status IN (
    'Pending Review', 'Approved', 'Rejected', 'Negotiating'
  )),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ONBOARDING QUESTIONNAIRE RESPONSES
-- ============================================================
CREATE TABLE public.client_questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyout_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyout_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

-- Clients: admins full access, clients read own
CREATE POLICY "Admins manage clients" ON public.clients
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

CREATE POLICY "Clients view own record" ON public.clients
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND client_id = clients.id)
  );

-- Projects: admins full access, clients read own
CREATE POLICY "Admins manage projects" ON public.projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

CREATE POLICY "Clients view own projects" ON public.projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.client_id = projects.client_id)
  );

-- Production partners: admins full, partners see own pitch
CREATE POLICY "Admins manage partners" ON public.production_partners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

-- Bids: admins full, clients see approved bids for their projects
CREATE POLICY "Admins manage bids" ON public.bids
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

CREATE POLICY "Clients view approved bids" ON public.bids
  FOR SELECT USING (
    approved_for_client = TRUE AND
    EXISTS (
      SELECT 1 FROM public.projects pr
      JOIN public.profiles p ON p.client_id = pr.client_id
      WHERE pr.id = bids.project_id AND p.id = auth.uid()
    )
  );

-- Buyouts: admins full, clients see own
CREATE POLICY "Admins manage buyouts" ON public.buyout_projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

CREATE POLICY "Clients view own buyouts" ON public.buyout_projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.client_id = buyout_projects.client_id)
  );

CREATE POLICY "Admins manage buyout items" ON public.buyout_line_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

CREATE POLICY "Clients view own buyout items" ON public.buyout_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.buyout_projects bp
      JOIN public.profiles p ON p.client_id = bp.client_id
      WHERE bp.id = buyout_line_items.buyout_project_id AND p.id = auth.uid()
    )
  );

-- Overages: admins full, clients see own
CREATE POLICY "Admins manage overages" ON public.overages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'shift_admin'))
  );

CREATE POLICY "Clients view own overages" ON public.overages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects pr
      JOIN public.profiles p ON p.client_id = pr.client_id
      WHERE pr.id = overages.project_id AND p.id = auth.uid()
    )
  );

-- ============================================================
-- HELPER FUNCTION: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.production_partners FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.bids FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.buyout_projects FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.buyout_line_items FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.overages FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- HELPER FUNCTION: new user profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
