import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppLayout({
  children,
  className = "",
  mobileTheme = "light",
}: {
  children: ReactNode;
  className?: string;
  mobileTheme?: "light" | "blue";
}) {
  const isBlueMobile = mobileTheme === "blue";

  return (
    <div
      className={`flex min-h-screen ${
        isBlueMobile ? "il-mobile-login-bg lg:bg-il-bg-grey-tint" : "bg-il-bg-grey-tint"
      }`}
    >
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-24 lg:pb-0">
        <main
          className={`mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:px-6 lg:rounded-tl-3xl lg:bg-white lg:px-8 lg:py-8 ${
            isBlueMobile ? "bg-transparent lg:bg-white" : "bg-white py-5"
          } ${className}`}
        >
          {children}
        </main>
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
