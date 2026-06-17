import { useAuth } from "@/lib/auth";

function UserAvatar() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] ?? "Scout";

  if (user?.photo_url) {
    return (
      <img
        src={user.photo_url}
        alt=""
        className="h-9 w-9 rounded-full border-2 border-white/30 object-cover lg:border-il-blue-90"
      />
    );
  }

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white lg:bg-il-blue-30">
      {firstName[0]?.toUpperCase()}
    </div>
  );
}

export function PageHeader({ title }: { title: string }) {
  return (
    <header className="mb-6">
      {/* Mobile — U2 blue header bar */}
      <div className="-mx-4 mb-0 flex items-center justify-between bg-il-blue-30 px-4 py-4 sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center gap-3">
          <img
            src="/logo-ilbtl.png"
            alt="ILBTL — Infinity Learn"
            className="h-8 w-auto max-w-[160px] object-contain mix-blend-lighten"
          />
          <h1 className="text-lg font-bold text-white">{title}</h1>
        </div>
        <UserAvatar />
      </div>

      {/* Desktop */}
      <div className="hidden items-center justify-between border-b border-il-neutral-90 pb-4 lg:flex">
        <h1 className="text-2xl font-bold text-il-text-primary">{title}</h1>
        <UserAvatar />
      </div>
    </header>
  );
}
