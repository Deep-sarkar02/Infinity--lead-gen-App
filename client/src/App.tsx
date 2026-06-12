import { Navigate, Route, Routes } from "react-router-dom";
import { AddLeadPage } from "@/pages/AddLeadPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LeadsPage } from "@/pages/LeadsPage";
import { LoadingPage } from "@/pages/LoadingPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { WalletPage } from "@/pages/WalletPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/leads" element={<LeadsPage />} />
      <Route path="/leads/new" element={<AddLeadPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
