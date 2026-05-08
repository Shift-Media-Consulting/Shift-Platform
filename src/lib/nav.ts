export const navItems = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "The Method", href: "/method" },
  { label: "Team", href: "/team" },
] as const;

export const footerNavItems = [
  ...navItems,
  { label: "Contact", href: "/contact" },
] as const;
