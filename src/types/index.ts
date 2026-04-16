// User roles
export type UserRole = 'super_admin' | 'shift_admin' | 'client' | 'production_partner'

// Client
export interface Client {
  id: string
  client_id: string // CLT-YYYY-XXXX
  company_name: string
  client_type: 'Agency' | 'Brand' | 'Other'
  main_contact: string
  email: string
  address: string
  sector: ClientSector
  logo_url?: string
  other_contacts?: Contact[]
  notion_id?: string
  created_at: string
  updated_at: string
}

export type ClientSector =
  | 'Automotive' | 'Retail' | 'Telecommunications' | 'FMCG'
  | 'Financial Services' | 'Pharmaceutical' | 'Technology' | 'Fashion'
  | 'Food & Beverage' | 'Entertainment' | 'Travel & Tourism' | 'Sports'
  | 'Luxury' | 'Healthcare' | 'Energy' | 'Other'

export interface Contact {
  name: string
  email: string
  role?: string
}

// Project
export interface Project {
  id: string
  project_id: string // PRJ-YYYY-XXXX
  project_name: string
  client_id: string
  agency_name?: string
  agency_contact?: string
  agency_contact_email?: string
  consultant: string
  sector: ClientSector
  project_type: ProjectType[]
  buyouts: boolean
  buyout_project_id?: string
  status: ProjectStatus
  brief_summary?: string
  schedule_data?: ScheduleData
  budget?: number
  notion_id?: string
  created_at: string
  updated_at: string
}

export type ProjectType = 'Film' | 'Social Media' | 'Photo' | 'Activation'

export type ProjectStatus =
  | 'Setup' | 'Partner Selection' | 'In Production'
  | 'Post Production' | 'Delivered' | 'Archived'

export interface ScheduleData {
  milestones: Milestone[]
  shooting_dates?: string[]
  delivery_date?: string
}

export interface Milestone {
  label: string
  date: string
  highlighted: boolean
}

// Production Partner
export interface ProductionPartner {
  id: string
  project_id: string
  company_name: string
  contact_name: string
  contact_email: string
  creative_name?: string
  status: PartnerStatus
  bid_submitted: boolean
  bid_approved: boolean
  awarded: boolean
  portal_token?: string
  created_at: string
}

export type PartnerStatus =
  | 'Long List' | 'Short List' | 'Approached'
  | 'Pitch' | 'Awarded' | 'Not Awarded'

// Buyout
export interface BuyoutProject {
  id: string
  buyout_project_id: string // BYO-YYYY-XXXX
  client_id: string
  project_id: string
  line_items: BuyoutLineItem[]
  created_at: string
  updated_at: string
}

export interface BuyoutLineItem {
  id: string
  talent_name: string
  talent_type: 'Actor' | 'VO Artist' | 'Musician'
  role?: string
  day_fee?: number
  secured: boolean
  media_types: MediaType[]
  territories: Territory[]
  rights_start: string
  rights_end: string
  buyout_fee: number
  status: 'Active' | 'Expired' | 'Pending Renewal' | 'Renewed'
}

export type MediaType = 'TV' | 'Online/Digital' | 'Cinema' | 'OOH' | 'Radio' | 'All Media'

export type Territory =
  | 'Germany' | 'Austria' | 'Switzerland' | 'DACH'
  | 'Europe' | 'UK' | 'USA' | 'Worldwide'

// Bid
export interface Bid {
  id: string
  project_id: string
  partner_id: string
  creative_url?: string
  budget_url?: string
  ai_summary?: string
  ai_flags?: string[]
  consultant_notes?: string
  shift_recommendation?: string
  agency_recommendation?: string
  not_recommended?: boolean
  not_recommended_reason?: string
  approved_for_client: boolean
  submitted_at: string
}

// Budget
export interface Budget {
  id: string
  project_id: string
  partner_id: string
  version: string
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'
  director?: string
  notes?: string
  total_net: number
  submitted_at?: string
  created_at: string
  updated_at: string
  // joined
  production_partners?: { company_name: string; contact_name: string }
  budget_line_items?: BudgetLineItem[]
}

export interface BudgetLineItem {
  id: string
  budget_id: string
  section_number: number
  section_name: string
  position_code: string
  name: string
  quantity: number
  days: number
  rate: number
  amount: number
  notes?: string
  sort_order: number
}

// Overage
export interface Overage {
  id: string
  project_id: string
  document_url?: string
  amount: number
  category?: string
  description?: string
  ai_analysis?: string
  consultant_note?: string
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Negotiating'
  submitted_at: string
}
