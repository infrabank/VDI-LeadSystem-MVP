import { requirePortalAuth } from "@/lib/auth-sap";
import PortalNav from "../components/PortalNav";

export const metadata = {
  title: "VDI Expert — SI 파트너 포털",
};

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalNav userName={user.email} orgName={user.orgName} />
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
