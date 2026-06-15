export interface NavItem {
  href: string;
  label: string;
  icon: "home" | "leads" | "profile" | "add-lead" | "wallet";
}

/** Desktop sidebar + legacy */
export const primaryNavItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/leads", label: "Leads", icon: "leads" },
  { href: "/profile", label: "Profile", icon: "profile" },
];

/** Mobile bottom nav — Home | Add Leads | View Leads */
export const mobileBottomNavItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/leads/new", label: "Add Leads", icon: "add-lead" },
  { href: "/leads", label: "View Leads", icon: "leads" },
];

/** Desktop sidebar extras */
export const sidebarNavItems: NavItem[] = [
  ...primaryNavItems,
  { href: "/leads/new", label: "Add Lead", icon: "add-lead" },
  { href: "/wallet", label: "Wallet", icon: "wallet" },
];

/** Mobile bottom sheet — grouped like IL app drawer */
export const mobileMenuSections: { items: NavItem[] }[] = [
  {
    items: [
      { href: "/dashboard", label: "Home", icon: "home" },
      { href: "/leads", label: "Leads", icon: "leads" },
      { href: "/leads/new", label: "Add Lead", icon: "add-lead" },
    ],
  },
  {
    items: [
      { href: "/wallet", label: "Wallet", icon: "wallet" },
      { href: "/profile", label: "Profile", icon: "profile" },
    ],
  },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  if (href === "/leads") return pathname === "/leads";
  if (href === "/leads/new") return pathname === "/leads/new";
  return pathname === href || pathname.startsWith(`${href}/`);
}
