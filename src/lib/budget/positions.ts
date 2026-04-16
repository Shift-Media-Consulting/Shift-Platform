// SHIFT MEDIA — Standard Budget Position Library
// These are SHIFT's own position codes, not SCoPE-compatible.
// code format: [section][2-digit-index] e.g. "101", "210", "1103"

export interface BudgetSection {
  number: number
  name: string
}

export interface BudgetPosition {
  code: string
  section: number
  name: string
  hint?: string
}

export const BUDGET_SECTIONS: BudgetSection[] = [
  { number: 1,  name: 'Pre-Production' },
  { number: 2,  name: 'Cast' },
  { number: 3,  name: 'Crew' },
  { number: 4,  name: 'Equipment' },
  { number: 5,  name: 'Art Department' },
  { number: 6,  name: 'Studio' },
  { number: 7,  name: 'Location' },
  { number: 8,  name: 'Post-Production' },
  { number: 9,  name: 'Insurance' },
  { number: 10, name: 'Music' },
  { number: 11, name: 'Travel & Miscellaneous' },
]

export const BUDGET_POSITIONS: BudgetPosition[] = [

  // ── 1. PRE-PRODUCTION ───────────────────────────────────────
  { code: '101', section: 1, name: 'Location Manager' },
  { code: '102', section: 1, name: 'Location Scout' },
  { code: '103', section: 1, name: 'Research Materials' },
  { code: '104', section: 1, name: 'Producer (Prep)' },
  { code: '105', section: 1, name: 'Casting Director' },
  { code: '106', section: 1, name: 'Casting Space / Sessions' },
  { code: '107', section: 1, name: 'Video Casting' },
  { code: '108', section: 1, name: 'PPM Catering & Materials' },
  { code: '109', section: 1, name: 'PPM Travel & Accommodation' },
  { code: '110', section: 1, name: 'Miscellaneous Pre-Production' },

  // ── 2. CAST ─────────────────────────────────────────────────
  { code: '201', section: 2, name: 'Principal Actor(s) — Day Fee', hint: 'Day fee per actor' },
  { code: '202', section: 2, name: 'Principal Actor(s) — Buyout', hint: 'Buyout per actor, days = 1' },
  { code: '203', section: 2, name: 'Supporting Actor(s) — Day Fee' },
  { code: '204', section: 2, name: 'Supporting Actor(s) — Buyout', hint: 'Buyout per actor, days = 1' },
  { code: '205', section: 2, name: 'Extras / Background' },
  { code: '206', section: 2, name: 'Children — Day Fee' },
  { code: '207', section: 2, name: 'Stand-ins / Doubles' },
  { code: '208', section: 2, name: 'Stunt Performers' },
  { code: '209', section: 2, name: 'Voice-Over Artist — Fee' },
  { code: '210', section: 2, name: 'Voice-Over Artist — Buyout', hint: 'Buyout fee, days = 1' },
  { code: '211', section: 2, name: 'Social Charges on Cast Fees', hint: 'AGA / KSK / §50a — use % of cast total or fixed amount' },

  // ── 3. CREW ─────────────────────────────────────────────────
  { code: '301', section: 3, name: 'Director' },
  { code: '302', section: 3, name: 'Executive Producer' },
  { code: '303', section: 3, name: 'Producer' },
  { code: '304', section: 3, name: 'Production Manager' },
  { code: '305', section: 3, name: '1st AD' },
  { code: '306', section: 3, name: '2nd AD' },
  { code: '307', section: 3, name: 'DoP / Director of Photography' },
  { code: '308', section: 3, name: 'Camera Operator' },
  { code: '309', section: 3, name: '1st AC / Focus Puller' },
  { code: '310', section: 3, name: '2nd AC / Clapper Loader' },
  { code: '311', section: 3, name: 'Gaffer' },
  { code: '312', section: 3, name: 'Best Boy Electric' },
  { code: '313', section: 3, name: 'Key Grip' },
  { code: '314', section: 3, name: 'Best Boy Grip' },
  { code: '315', section: 3, name: 'Sound Recordist' },
  { code: '316', section: 3, name: 'Make-Up Artist / Hair' },
  { code: '317', section: 3, name: 'Costume / Wardrobe Supervisor' },
  { code: '318', section: 3, name: 'Production Assistant(s)' },
  { code: '319', section: 3, name: 'Social Charges on Crew Fees', hint: 'AGA / KSK — typically 23.3% on domestic fees' },

  // ── 4. EQUIPMENT ────────────────────────────────────────────
  { code: '401', section: 4, name: 'Camera Package' },
  { code: '402', section: 4, name: 'Lens Package' },
  { code: '403', section: 4, name: 'Grip / Bühne Package' },
  { code: '404', section: 4, name: 'Lighting Package' },
  { code: '405', section: 4, name: 'Sound Package' },
  { code: '406', section: 4, name: 'Generator' },
  { code: '407', section: 4, name: 'Camera Car / Pursuit Vehicle' },
  { code: '408', section: 4, name: 'Crane / Jib' },
  { code: '409', section: 4, name: 'Drone / UAV' },
  { code: '410', section: 4, name: 'Production Vehicles / Trucks' },
  { code: '411', section: 4, name: 'Fuel & Mileage' },
  { code: '412', section: 4, name: 'Miscellaneous Equipment' },

  // ── 5. ART DEPARTMENT ────────────────────────────────────────
  { code: '501', section: 5, name: 'Production Designer / Art Director' },
  { code: '502', section: 5, name: 'Set Designer' },
  { code: '503', section: 5, name: 'Props Master' },
  { code: '504', section: 5, name: 'Set Construction' },
  { code: '505', section: 5, name: 'Props Purchase / Rental' },
  { code: '506', section: 5, name: 'Set Dressing & Materials' },
  { code: '507', section: 5, name: 'Wardrobe Purchase / Rental' },
  { code: '508', section: 5, name: 'Food Stylist' },
  { code: '509', section: 5, name: 'Graphic Designer (On-Set Graphics)' },
  { code: '510', section: 5, name: 'Miscellaneous Art Department' },

  // ── 6. STUDIO ───────────────────────────────────────────────
  { code: '601', section: 6, name: 'Studio Rental — Prep Day(s)' },
  { code: '602', section: 6, name: 'Studio Rental — Shoot Day(s)' },
  { code: '603', section: 6, name: 'Studio Rental — Strike Day(s)' },
  { code: '604', section: 6, name: 'Stage Manager' },
  { code: '605', section: 6, name: 'Set Construction / Build' },
  { code: '606', section: 6, name: 'Cyclorama Rental' },
  { code: '607', section: 6, name: 'Studio Miscellaneous' },

  // ── 7. LOCATION ──────────────────────────────────────────────
  { code: '701', section: 7, name: 'Location Fee(s)' },
  { code: '702', section: 7, name: 'Location Prep / Recce' },
  { code: '703', section: 7, name: 'On-Set Catering' },
  { code: '704', section: 7, name: 'Security' },
  { code: '705', section: 7, name: 'Parking & Permits' },
  { code: '706', section: 7, name: 'Location Miscellaneous' },

  // ── 8. POST-PRODUCTION ───────────────────────────────────────
  { code: '801', section: 8, name: 'Offline Edit' },
  { code: '802', section: 8, name: 'Online / Conform' },
  { code: '803', section: 8, name: 'Colour Grade' },
  { code: '804', section: 8, name: 'VFX / CGI' },
  { code: '805', section: 8, name: 'Motion Graphics' },
  { code: '806', section: 8, name: 'Sound Design & Mix' },
  { code: '807', section: 8, name: 'VO Recording (Studio)' },
  { code: '808', section: 8, name: 'Deliverables / Mastering' },
  { code: '809', section: 8, name: 'Post-Production Miscellaneous' },

  // ── 9. INSURANCE ─────────────────────────────────────────────
  { code: '901', section: 9, name: 'Production Insurance (Film & Data)' },
  { code: '902', section: 9, name: 'Public Liability Insurance' },
  { code: '903', section: 9, name: 'Weather / Cancellation Insurance' },
  { code: '904', section: 9, name: 'Cast / Key Person Insurance' },
  { code: '905', section: 9, name: 'Props & Equipment Insurance' },

  // ── 10. MUSIC ────────────────────────────────────────────────
  { code: '1001', section: 10, name: 'Original Music Composition' },
  { code: '1002', section: 10, name: 'Music Recording / Session Musicians' },
  { code: '1003', section: 10, name: 'Archive / Library Music License' },
  { code: '1004', section: 10, name: 'Music Buyout (Sync & Master)' },
  { code: '1005', section: 10, name: 'Music Miscellaneous' },

  // ── 11. TRAVEL & MISCELLANEOUS ───────────────────────────────
  { code: '1101', section: 11, name: 'Air Travel — Crew' },
  { code: '1102', section: 11, name: 'Air Travel — Cast' },
  { code: '1103', section: 11, name: 'Hotels — Crew' },
  { code: '1104', section: 11, name: 'Hotels — Cast' },
  { code: '1105', section: 11, name: 'Per Diems — Crew' },
  { code: '1106', section: 11, name: 'Per Diems — Cast' },
  { code: '1107', section: 11, name: 'Ground Transport / Taxis' },
  { code: '1108', section: 11, name: 'Couriers & Freight' },
  { code: '1109', section: 11, name: 'Telecommunications' },
  { code: '1110', section: 11, name: 'Miscellaneous / Contingency' },
]

// Group positions by section number for easy rendering
export function getPositionsBySection(): Map<number, BudgetPosition[]> {
  const map = new Map<number, BudgetPosition[]>()
  for (const section of BUDGET_SECTIONS) {
    map.set(section.number, [])
  }
  for (const pos of BUDGET_POSITIONS) {
    map.get(pos.section)?.push(pos)
  }
  return map
}

// Calculate amount from inputs
export function calcAmount(quantity: number, days: number, rate: number): number {
  const d = days > 0 ? days : 1
  return quantity * d * rate
}
