import {
  AlertTriangle,
  BarChart3,
  Bell,
  ClipboardList,
  Gauge,
  HardDrive,
  History,
  Home,
  LockKeyhole,
  Map,
  Monitor,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  open: boolean;
}

const menuGroups = [
  {
    title: "Principal",
    items: [
      { label: "Inicio", to: "/dashboard", icon: Home },
      { label: "Monitoreo", to: "/monitoring", icon: Monitor },
    ],
  },
  {
    title: "Operaciones",
    items: [
      {
        label: "Control",
        to: "/control",
        icon: Gauge,
        subItems: [
          { label: "NFC", to: "/control/nfc" },
          { label: "Contraseña", to: "/control/password" },
          { label: "Registro CMD", to: "/control/cmd-log" },
          { label: "Preconfiguración", to: "/control/preconfiguration" },
          { label: "Parámetros", to: "/control/parameters" },
        ],
      },
      {
        label: "Eventos",
        to: "/events",
        icon: Bell,
        subItems: [
          { label: "Todos los eventos", to: "/events/all" },
          { label: "Eventos de alarma", to: "/events/alarms" },
          { label: "Eventos push", to: "/events/push" },
        ],
      },
      {
        label: "GIS / Mapa",
        to: "/gis",
        icon: Map,
        subItems: [
          { label: "Geo-Cercas", to: "/gis/geofences" },
          { label: "Registro de geocercas", to: "/gis/geofence-log" },
        ],
      },
    ],
  },
  {
    title: "Gestión",
    items: [
      { label: "Alertas", to: "/alerts", icon: AlertTriangle },
      { label: "Auditoría", to: "/audit", icon: ClipboardList },
      { label: "Dispositivos", to: "/devices", icon: HardDrive },
      { label: "Candados inteligentes", to: "/smart-locks", icon: LockKeyhole },
      { label: "Historial", to: "/history", icon: History },
      {
        label: "Reportes",
        to: "/reports",
        icon: BarChart3,
        subItems: [
          { label: "Resumen general", to: "/reports/summary" },
          { label: "Reporte de eventos", to: "/reports/events" },
          { label: "Reporte de alarmas", to: "/reports/alarms" },
        ],
      },
      {
        label: "Mantenimiento",
        to: "/maintenance",
        icon: Settings,
        subItems: [
          { label: "Estado del sistema", to: "/maintenance/status" },
          { label: "Configuración", to: "/maintenance/settings" },
        ],
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        label: "Centro de usuarios",
        to: "/user-center",
        icon: Users,
        subItems: [
          { label: "Usuarios", to: "/user-center/users" },
          { label: "Roles", to: "/user-center/roles" },
          { label: "Permisos", to: "/user-center/permissions" },
        ],
      },
    ],
  },
];

export default function Sidebar({ open }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 hidden h-screen border-r border-cyan-400/20 bg-[#06101f] shadow-[0_0_40px_rgba(34,211,238,0.05)] transition-all duration-300 lg:flex lg:flex-col ${
        open ? "w-80" : "w-24"
      }`}
    >
      <div className="flex h-[76px] items-center justify-between border-b border-cyan-400/20 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.25)]">
            <ShieldCheck size={21} className="text-cyan-300" />
          </div>

          {open && (
            <div>
              <h2 className="font-mono text-sm font-bold tracking-wider text-cyan-300">
                HHDlink
              </h2>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.4em] text-slate-500">
                Plataforma AIOT
              </p>
            </div>
          )}
        </div>

        {open && (
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            <span className="h-2 w-2 rounded-full bg-violet-500" />
          </div>
        )}
      </div>

      <nav className="sidebar-scroll flex-1 overflow-y-auto px-4 py-6">
        {menuGroups.map((group) => (
          <div key={group.title} className="mb-8">
            {open && (
              <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.55em] text-slate-600">
                {group.title}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  icon={item.icon}
                  collapsed={!open}
                  subItems={item.subItems}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-cyan-400/20 px-5 py-4">
        {open ? (
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              Sistema activo
            </div>

            <span>v2.0.1</span>
          </div>
        ) : (
          <div className="mx-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
        )}
      </div>
    </aside>
  );
}