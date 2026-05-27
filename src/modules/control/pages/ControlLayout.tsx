import { NavLink, Outlet } from "react-router-dom";
import {
  ClipboardList,
  CreditCard,
  KeyRound,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";

const tabs = [
  { to: "/control/nfc", label: "NFC", icon: CreditCard },
  { to: "/control/password", label: "Contraseña", icon: KeyRound },
  { to: "/control/cmd-log", label: "Registro CMD", icon: ClipboardList },
  { to: "/control/preconfiguration", label: "Preconfiguración", icon: Settings2 },
  { to: "/control/parameters", label: "Parámetros", icon: SlidersHorizontal },
];

export default function ControlLayout() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1600px] space-y-5 px-3 py-4 sm:px-5 lg:px-6">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white sm:text-2xl">Control</h1>
          <p className="mt-1 max-w-3xl text-xs text-slate-500 sm:text-sm">
            Gestiona NFC, contraseñas, comandos y parámetros de los candados
          </p>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-950/60 p-1">
          <nav className="flex min-w-max gap-1">
            {tabs.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    isActive
                      ? "bg-cyan-400/15 text-cyan-300"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="min-w-0 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3 sm:p-5 lg:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}