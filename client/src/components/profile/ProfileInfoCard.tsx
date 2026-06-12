import { useAuth } from "@/lib/auth";

export function ProfileInfoCard() {
  const { user } = useAuth();
  const initial = user?.full_name?.[0]?.toUpperCase() ?? "R";

  return (
    <div className="flex flex-col items-center rounded-[20px] bg-white px-6 py-8 text-center shadow-[0_4px_20px_rgba(1,47,99,0.12)] lg:rounded-2xl lg:border lg:border-il-neutral-90 lg:py-6 lg:shadow-card">
      {user?.photo_url ? (
        <img
          src={user.photo_url}
          alt=""
          className="h-24 w-24 rounded-full border-4 border-il-blue-90 object-cover lg:h-20 lg:w-20"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-il-blue-30 text-3xl font-bold text-white lg:h-20 lg:w-20 lg:text-2xl">
          {initial}
        </div>
      )}

      <h2 className="mt-5 text-lg font-bold text-il-neutral-10 lg:mt-4 lg:text-il-text-primary">
        {user?.full_name ?? "Scout"}
      </h2>
      <p className="mt-1 text-sm text-il-neutral-50 lg:text-il-text-secondary">
        {user?.email}
      </p>
    </div>
  );
}
