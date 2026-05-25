import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../../modules/auth/store/auth.store";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  setMobileOpen: (value: boolean) => void;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  setMobileOpen,
}: HeaderProps) {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  function handleLogout() {
    clearSession();
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-400/10 bg-[#07111f]/90 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
          >
            <Menu size={20} />
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden rounded-xl p-2 text-slate-300 hover:bg-slate-800 lg:block"
          >
            {sidebarOpen ? (
              <PanelLeftClose size={20} />
            ) : (
              <PanelLeftOpen size={20} />
            )}
          </button>

          <div>
            <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            <p className="text-sm text-slate-400">
              Smart lock monitoring system
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-xl p-2 text-slate-300 hover:bg-slate-800 md:block">
            <Globe size={18} />
          </button>

          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-white">
              {user?.username ?? "Administrador"}
            </p>
            <p className="text-xs text-slate-400">
              {user?.role ?? "Super Admin"}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300 font-semibold">
            {user?.username?.charAt(0).toUpperCase() ?? "A"}
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl p-2 text-red-400 hover:bg-red-500/10"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}