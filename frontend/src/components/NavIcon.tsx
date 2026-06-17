import type { NavItem } from "@/lib/nav-config";

export function NavIcon({
  name,
  className = "h-5 w-5",
}: {
  name: NavItem["icon"] | "logout" | "menu" | "back" | "close";
  className?: string;
}) {
  const props = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.75,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "home":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
          />
        </svg>
      );
    case "leads":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
          />
          <path strokeLinecap="round" d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 12h6M9 16h4" />
        </svg>
      );
    case "profile":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
          />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "add-lead":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
          />
          <circle cx="9" cy="7" r="4" />
          <path strokeLinecap="round" d="M19 8v6M22 11h-6" />
        </svg>
      );
    case "wallet":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"
          />
          <path strokeLinecap="round" d="M17 14h.01" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
        </svg>
      );
    case "logout":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"
          />
        </svg>
      );
    case "menu":
      return (
        <svg {...props}>
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "back":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
      );
    case "close":
      return (
        <svg {...props}>
          <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    default:
      return null;
  }
}
