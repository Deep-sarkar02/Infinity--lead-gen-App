import { AppLayout } from "@/components/AppLayout";
import { AuthGuard } from "@/components/AuthGuard";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { PageHeader } from "@/components/PageHeader";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { ProfileSignOutButton } from "@/components/profile/ProfileSignOutButton";
import { ProfileStatsRow } from "@/components/profile/ProfileStatsRow";
import { ProfileWalletCard } from "@/components/profile/ProfileWalletCard";
import { ProfileWhatsAppQrCard } from "@/components/profile/ProfileWhatsAppQrCard";
import { useAuth } from "@/lib/auth";

function ProfileContent() {
  const { summary, signOut } = useAuth();

  return (
    <AppLayout mobileTheme="blue">
      <MobileHomeHeader title="Profile" />
      <div className="hidden lg:block">
        <PageHeader title="Profile" />
      </div>

      <div className="mx-auto flex max-w-lg flex-col gap-4 lg:gap-6">
        <ProfileInfoCard />
        <ProfileStatsRow summary={summary} />
        <ProfileWhatsAppQrCard />
        <ProfileWalletCard />
        <ProfileSignOutButton onSignOut={() => signOut()} />
      </div>
    </AppLayout>
  );
}

export function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
