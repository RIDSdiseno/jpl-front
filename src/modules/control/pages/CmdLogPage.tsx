import { useEffect, useState } from "react";
import { ClipboardList, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import type { ControlDevice, DeviceParameterCommand } from "../types/control.types";
import { fetchCommandLog, fetchControlDevices } from "../services/control.service";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  SENT: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
  COMPLETED: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  FAILED: "bg-red-400/10 text-red-300 border-red-400/20",
};

function statusBadge(status: string) {
  const cls = STATUS_STYLES[status] ?? "bg-slate-400/10 text-slate-400 border-slate-400/20";
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
      {status}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

const LIMIT = 20;

export default function CmdLogPage() {
  const [devices, setDevices] = useState<ControlDevice[]>([]);
  const [commands, setCommands] = useState<DeviceParameterCommand[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [filterDevice, setFilterDevice] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchControlDevices().then(setDevices).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCommandLog({
      deviceId: filterDevice || undefined,
      status: filterStatus || undefined,
      limit: LIMIT,
      offset,
    })
      .then((res) => {
        setCommands(res.commands);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filterDevice, filterStatus, offset]);

  const totalPages = Math.ceil(total / LIMIT);
  const currentPage = Math.floor(offset / LIMIT) + 1;

  function deviceName(deviceId: string) {
    const d = devices.find((dev) => dev.id === deviceId);
    return d?.name ?? d?.terminalId ?? deviceId;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Registro de Comandos</h2>
        <p className="text-sm text-slate-500 mt-1">
          Historial de todos los comandos enviados a los dispositivos
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Filter size={15} className="text-slate-500" />

        <select
          value={filterDevice}
          onChange={(e) => { setFilterDevice(e.target.value); setOffset(0); }}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-300 outline-none"
        >
          <option value="">Todos los dispositivos</option>
          {devices.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name ?? d.terminalId}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setOffset(0); }}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-300 outline-none"
        >
          <option value="">Todos los estados</option>
          {["PENDING", "SENT", "COMPLETED", "FAILED"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <span className="ml-auto text-xs text-slate-500">
          {total} registro{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Dispositivo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Operador</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Completado</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-600">
                    Cargando...
                  </td>
                </tr>
              )}
              {!loading && commands.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-600">
                    <ClipboardList size={24} className="mx-auto mb-2 opacity-40" />
                    No hay comandos registrados
                  </td>
                </tr>
              )}
              {!loading && commands.map((cmd) => (
                <tr
                  key={cmd.id}
                  className="border-b border-slate-800/50 bg-slate-950/30 hover:bg-slate-900/40 transition"
                >
                  <td className="px-4 py-3 font-mono text-xs text-slate-300">
                    {deviceName(cmd.deviceId)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-cyan-300">{cmd.commandType}</span>
                  </td>
                  <td className="px-4 py-3">{statusBadge(cmd.status)}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {cmd.requestedById ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatDate(cmd.requestedAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {cmd.completedAt ? formatDate(cmd.completedAt) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setOffset(Math.max(0, offset - LIMIT))}
            disabled={offset === 0}
            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-slate-400 hover:bg-slate-800 disabled:opacity-40 transition"
          >
            <ChevronLeft size={15} /> Anterior
          </button>

          <span className="text-slate-500">
            Página {currentPage} de {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setOffset(offset + LIMIT)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-slate-400 hover:bg-slate-800 disabled:opacity-40 transition"
          >
            Siguiente <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
