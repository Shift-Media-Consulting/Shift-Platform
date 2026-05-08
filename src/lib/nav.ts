export const navItems = [
  { label: "About",    href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Team",     href: "/team" },
] as const;

export const footerNavItems = [
  { label: "About",    href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Team",     href: "/team" },
  { label: "Contact",  href: "/contact" },
] as const;

/** Dropdown shown under Services in the nav */
export const servicesDropdown = [
  { label: "Audit",      href: "/method",              desc: "Six-dimension operational diagnostic" },
  { label: "Workshops",  href: "/services/workshops",   desc: "Focused sessions on a single topic" },
  { label: "Pilot",      href: "/services/pilot",       desc: "A defined project, start to finish" },
] as const;
