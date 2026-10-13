// components/NavBar.tsx
import { verifySession } from "@/lib/session";
import PublicNavBar from "./PublicNavBar";
import PortalNavBar from "./PortalNavBar";

export default async function NavBar() {
  const auth = await verifySession();

  // 1. If not logged in -> Render Public Website Navbar
  if (!auth) {
    return <PublicNavBar />;
  }

  // 2. If logged in -> Render Portal/Dashboard Navbar
  return (
    <PortalNavBar
      user={{
        email: auth.account.email,
        role: auth.role,
      }}
    />
  );
}