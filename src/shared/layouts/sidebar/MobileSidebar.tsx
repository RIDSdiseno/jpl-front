import {
  LayoutDashboard,
  SlidersHorizontal,
  Bell,
  Map,
  ShieldAlert,
  ClipboardList,
  HardDrive,
  LockKeyhole,
  History,
  FileBarChart2,
  Wrench,
  Users,
  X,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

interface MobileSidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const menuItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Control", to: "/control", icon: SlidersHorizontal },
  { label: "Eventos", to: "/events", icon: Bell },
  { label: "GIS", to: "/gis", icon: Map },
  { label: "Alertas", to: "/alerts", icon: ShieldAlert },
  { label: "Auditoría", to: "/audit", icon: ClipboardList },
  { label: "Dispositivos", to: "/devices", icon: HardDrive },
  { label: "Candados", to: "/smart-locks", icon: LockKeyhole },
  { label: "Historial", to: "/history", icon: History },
  { label: "Reportes", to: "/reports", icon: FileBarChart2 },
  { label: "Mantenimiento", to: "/maintenance", icon: Wrench },
  { label: "Usuarios", to: "/user-center", icon: Users },
];

export default function MobileSidebar({
  open,
  setOpen,
}: MobileSidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-[#07111f] border-r border-cyan-400/10 transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-cyan-400/10 px-4">
          <div>
            <h2 className="font-semibold text-white">JPL AIOT LOCK</h2>
            <p className="text-xs text-slate-400">Smart Lock Platform</p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-xl p-2 text-slate-300 hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2 p-4">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              onClick={() => setOpen(false)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}