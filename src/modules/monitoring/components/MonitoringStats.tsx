import {
  Activity,
  Battery,
  LocateFixed,
  LocateOff,
  LockKeyhole,
  RadioTower,
  Satellite,
  ShieldAlert,
  Wifi,
  WifiOff,
} from "lucide-react";
import type {
  MonitoringLock,
  MonitoringSummary,
  TcpStats,
} from "../types/monitoring.types";

interface Props {
  locks: MonitoringLock[];
  summary?: MonitoringSummary;
  tcpStats?: TcpStats;
}

export default function MonitoringStats({ locks, summary, tcpStats }: Props) {
  const total = summary?.total ?? locks.length;

  const online =
    summary?.online ?? locks.filter((lock) => lock.status === "ONLINE").length;

  const offline =
    summary?.offline ??
    locks.filter((lock) => lock.status === "OFFLINE").length;

  const alarm =
    summary?.alarm ?? locks.filter((lock) => lock.status === "ALARM").length;

  const withLocation =
    summary?.withLocation ??
    locks.filter(
      (lock) =>
        typeof lock.latitude === "number" &&
        typeof lock.longitude === "number"
    ).length;

  const withoutLocation = summary?.withoutLocation ?? total - withLocation;

  const gpsReal = locks.filter(
    (lock) => lock.locationSource === "GPS" && lock.gpsValid
  ).length;

  const lbsLocation = locks.filter(
    (lock) => lock.locationSource === "LBS"
  ).length;

  const batteryValues = locks
    .map((lock) => lock.battery)
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value)
    );

  const averageBattery =
    batteryValues.length > 0
      ? Math.round(
          batteryValues.reduce((sum, value) => sum + value, 0) /
            batteryValues.length
        )
      : null;

  const cards = [
    {
      label: "Candados",
      value: total,
      icon: LockKeyhole,
      className: "text-cyan-300",
      description: "Total registrado",
    },
    {
      label: "Online",
      value: online,
      icon: Wifi,
      className: "text-emerald-300",
      description: "Operativos",
    },
    {
      label: "Offline",
      value: offline,
      icon: WifiOff,
      className: "text-slate-300",
      description: "Sin conexión",
    },
    {
      label: "GPS real",
      value: gpsReal,
      icon: Satellite,
      className: "text-emerald-300",
      description: "Con satélite válido",
    },
    {
      label: "LBS",
      value: lbsLocation,
      icon: LocateFixed,
      className: "text-orange-300",
      description: "Por antenas",
    },
    {
      label: "Sin ubicación",
      value: withoutLocation,
      icon: LocateOff,
      className: "text-orange-300",
      description: "Sin coordenadas",
    },
    {
      label: "Batería prom.",
      value: averageBattery !== null ? `${averageBattery}%` : "N/D",
      icon: Battery,
      className: "text-lime-300",
      description: "Dispositivos con dato",
    },
    {
      label: "Alarmas",
      value: alarm,
      icon: ShieldAlert,
      className: "text-red-300",
      description: "Eventos críticos",
    },
    {
      label: "TCP conectados",
      value: tcpStats?.connectedByTerminalId ?? 0,
      icon: RadioTower,
      className: "text-violet-300",
      description: "En línea por socket",
    },
    {
      label: "Paquetes",
      value: tcpStats?.totalPackets ?? 0,
      icon: Activity,
      className: "text-cyan-300",
      description: "Recibidos por TCP",
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-10">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">{card.label}</p>
              <Icon size={18} className={card.className} />
            </div>

            <p className="mt-3 text-2xl font-bold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.description}</p>
          </div>
        );
      })}
    </section>
  );
}