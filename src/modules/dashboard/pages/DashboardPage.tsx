import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  LockKeyhole,
  MessageSquare,
  RefreshCcw,
  ShieldAlert,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboardSummary } from "../hooks/useDashboardSummary";

function formatDate(value?: string) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalizeType(type: string) {
  const map: Record<string, string> = {
    SMART_LOCK: "Candado inteligente",
    E_SEAL: "Sello electrónico",
  };

  return map[type] ?? type;
}

export default function DashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } =
    useDashboardSummary();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6 text-slate-300">
        Cargando dashboard...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6">
        <h1 className="text-xl font-semibold text-red-300">
          No se pudo cargar el dashboard
        </h1>

        <button
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-200 hover:bg-red-500/30"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const locksByType = data.devicesByType.filter(
    (item) => item.type === "SMART_LOCK" || item.type === "E_SEAL"
  );

  const totalLocks = locksByType.reduce((sum, item) => sum + item.total, 0);

  const online = data.operationRatio?.online ?? 0;
  const offline = data.operationRatio?.offline ?? 0;

  const realTotal = totalLocks || data.operationRatio?.total || 0;

  const onlinePercent =
    realTotal > 0 ? Math.round((online / realTotal) * 100) : 0;

  const offlinePercent =
    realTotal > 0 ? Math.round((offline / realTotal) * 100) : 0;

  const alarmCount = data.alarmEvents.length;
  const pushCount = data.pushEvents.length;
  const systemCount = data.systemMessages.length;

  const healthStatus =
    realTotal === 0
      ? "Sin operación"
      : onlinePercent >= 80
        ? "Operación saludable"
        : onlinePercent >= 50
          ? "Operación media"
          : "Operación crítica";

  const operationChart = [
    { name: "Online", value: online },
    { name: "Offline", value: offline },
  ];

  const lockTypeChart = locksByType.map((item) => ({
    name: normalizeType(item.type),
    total: item.total,
  }));

  const eventChart = [
    { name: "Push", total: pushCount },
    { name: "Alarmas", total: alarmCount },
    { name: "Sistema", total: systemCount },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            JPL AIOT LOCK
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-white">
            Dashboard operativo
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            KPIs, métricas, candados, conectividad y eventos recientes.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex w-fit items-center gap-2 rounded-xl border border-cyan-400/20 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/10"
        >
          <RefreshCcw size={16} className={isFetching ? "animate-spin" : ""} />
          Actualizar
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Candados</p>
            <LockKeyhole className="text-cyan-300" size={22} />
          </div>

          <p className="mt-4 text-3xl font-bold text-white">{realTotal}</p>
          <p className="mt-1 text-xs text-slate-500">Total registrado</p>
        </div>

        <div className="rounded-2xl border border-emerald-400/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Online</p>
            <Wifi className="text-emerald-300" size={22} />
          </div>

          <p className="mt-4 text-3xl font-bold text-white">{online}</p>
          <p className="mt-1 text-xs text-slate-500">
            {onlinePercent}% operativo
          </p>
        </div>

        <div className="rounded-2xl border border-red-400/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Offline</p>
            <WifiOff className="text-red-300" size={22} />
          </div>

          <p className="mt-4 text-3xl font-bold text-white">{offline}</p>
          <p className="mt-1 text-xs text-slate-500">
            {offlinePercent}% sin conexión
          </p>
        </div>

        <div className="rounded-2xl border border-violet-400/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">Alarmas</p>
            <AlertTriangle className="text-violet-300" size={22} />
          </div>

          <p className="mt-4 text-3xl font-bold text-white">{alarmCount}</p>
          <p className="mt-1 text-xs text-slate-500">Eventos recientes</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-300" size={20} />
            <div>
              <p className="text-sm text-slate-400">Estado general</p>
              <p className="mt-1 font-semibold text-white">{healthStatus}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <Bell className="text-cyan-300" size={20} />
            <div>
              <p className="text-sm text-slate-400">Eventos push</p>
              <p className="mt-1 font-semibold text-white">{pushCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-cyan-300" size={20} />
            <div>
              <p className="text-sm text-slate-400">Mensajes sistema</p>
              <p className="mt-1 font-semibold text-white">{systemCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-5">
          <div className="flex items-center gap-3">
            <Clock className="text-cyan-300" size={20} />
            <div>
              <p className="text-sm text-slate-400">Auto refresh</p>
              <p className="mt-1 font-semibold text-white">30 segundos</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6">
          <div className="mb-5 flex items-center gap-2">
            <Activity size={18} className="text-cyan-300" />
            <h2 className="font-semibold text-white">Conectividad</h2>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operationChart}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  <Cell fill="#34d399" />
                  <Cell fill="#f87171" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#020817",
                    border: "1px solid rgba(34,211,238,0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-700/60 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-500">Online</p>
              <p className="text-xl font-bold text-emerald-300">{online}</p>
            </div>

            <div className="rounded-xl border border-slate-700/60 bg-slate-950/40 p-3">
              <p className="text-xs text-slate-500">Offline</p>
              <p className="text-xl font-bold text-red-300">{offline}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6 xl:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <LockKeyhole size={18} className="text-cyan-300" />
            <h2 className="font-semibold text-white">Candados por tipo</h2>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lockTypeChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#020817",
                    border: "1px solid rgba(34,211,238,0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="total" fill="#22d3ee" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6 xl:col-span-2">
          <div className="mb-5 flex items-center gap-2">
            <ShieldAlert size={18} className="text-cyan-300" />
            <h2 className="font-semibold text-white">Actividad reciente</h2>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#020817",
                    border: "1px solid rgba(34,211,238,0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="total" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6">
          <div className="mb-5 flex items-center gap-2">
            <Activity size={18} className="text-cyan-300" />
            <h2 className="font-semibold text-white">Disponibilidad</h2>
          </div>

          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">Online</span>
            <span className="font-semibold text-cyan-300">
              {onlinePercent}%
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-500"
              style={{ width: `${onlinePercent}%` }}
            />
          </div>

          <div className="mt-6 space-y-3">
            {locksByType.length > 0 ? (
              locksByType.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between rounded-xl border border-slate-700/60 bg-slate-950/40 p-4"
                >
                  <span className="text-sm text-slate-300">
                    {normalizeType(item.type)}
                  </span>
                  <span className="text-lg font-bold text-cyan-300">
                    {item.total}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Sin candados.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6">
          <div className="mb-5 flex items-center gap-2">
            <Bell size={18} className="text-cyan-300" />
            <h2 className="font-semibold text-white">Eventos push</h2>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
            {data.pushEvents.length > 0 ? (
              data.pushEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-700/60 bg-slate-950/40 p-4"
                >
                  <p className="text-sm font-medium text-white">
                    {event.eventType ?? "Evento"}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {event.message ??
                      event.deviceName ??
                      event.deviceId ??
                      "Sin detalle"}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {formatDate(event.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Sin eventos push.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6">
          <div className="mb-5 flex items-center gap-2">
            <AlertTriangle size={18} className="text-cyan-300" />
            <h2 className="font-semibold text-white">Alarmas recientes</h2>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
            {data.alarmEvents.length > 0 ? (
              data.alarmEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-700/60 bg-slate-950/40 p-4"
                >
                  <p className="text-sm font-medium text-white">
                    {event.alarmType ?? "Alarma"}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {event.message ??
                      event.deviceName ??
                      event.deviceId ??
                      "Sin detalle"}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {formatDate(event.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Sin alarmas recientes.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6">
        <div className="mb-5 flex items-center gap-2">
          <MessageSquare size={18} className="text-cyan-300" />
          <h2 className="font-semibold text-white">Mensajes del sistema</h2>
        </div>

        <div className="space-y-3">
          {data.systemMessages.length > 0 ? (
            data.systemMessages.map((message) => (
              <div
                key={message.id}
                className="rounded-xl border border-slate-700/60 bg-slate-950/40 p-4"
              >
                <p className="text-sm font-medium text-white">
                  {message.title ?? message.type ?? "Mensaje"}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {message.message ?? "Sin contenido"}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {formatDate(message.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              Sin mensajes del sistema.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}