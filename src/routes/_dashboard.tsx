import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutGrid, Settings as SettingsIcon, LogOut } from "lucide-react";
import { toast } from "sonner";

import { getToken, logout, setToken } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_dashboard")({
  component: DashboardLayout,
});

const nav = [
  { to: "/products", label: "Products", icon: LayoutGrid },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function DashboardLayout() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!getToken()) {
      navigate({ to: "/login", replace: true });
    } else {
      setChecked(true);
    }
  }, [navigate]);

  async function onLogout() {
    setSigningOut(true);
    try {
      await logout();
    } catch {
      /* even if fails, clear */
    }
    setToken(null);
    toast.success("Logged out");
    navigate({ to: "/login", replace: true });
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-5 font-semibold">Admin</div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={onLogout}
            disabled={signingOut}
          >
            <LogOut className="h-4 w-4" />
            {signingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
          <span className="font-semibold">Admin</span>
          <div className="flex gap-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
            <Button size="sm" variant="ghost" onClick={onLogout} disabled={signingOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
