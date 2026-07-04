import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

// Routes where the global header + footer should NOT appear
const DASHBOARD_ROUTES = [
  "/admin-dashboard",
  "/vendor-dashboard",
  "/vendor-add-product",
  "/user-dashboard",
];

export function AppLayout() {
  const { pathname } = useLocation();

  // Hide header/footer on any dashboard route (including sub-paths)
  const isDashboard = DASHBOARD_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <div className="relative flex min-h-screen flex-col">
      {!isDashboard && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}
