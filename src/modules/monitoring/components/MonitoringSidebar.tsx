import {
  Battery,
  LockKeyhole,
  Search,
  UnlockKeyhole,
} from "lucide-react";
import type { LockStatus, MonitoringLock } from "../types/monitoring.types";

interface Props {
  locks: MonitoringLock[];
  search: string;
  status: "ALL" | LockStatus;
  selectedLockId: string | null;
  setSearch: (value: string) => void;
  setStatus: (value: "ALL" | LockStatus) => void;
  setSelectedLockId: (value: string | null) => void;
  onOpenLock: (terminalId: string) => void;
  onCloseLock: (terminalId: string) => void;
  commandLoading: boolean;
}

function statusClass(status: LockStatus) {
  if (status === "ONLINE") return "bg-emerald-400/10 text-emerald-300";
  if (status === "OFFLINE") return "bg-slate-400/10 text-slate-300";
  return "bg-red-400/10 text-red-300";
}

function statusLabel(status: LockStatus) {
  if (status === "ONLINE") return "Online";
  if (status === "OFFLINE") return "Offline";
  return "Alarma";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function MonitoringSidebar({
  locks,
  search,
  status,
  selectedLockId,
  setSearch,
  setStatus,
  setSelectedLockId,
  onOpenLock,
  onCloseLock,
  commandLoading,
}: Props) {
  return (
    <aside className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500">
        Company / Device Info
      </p>

      <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950/60 px-3">
        <Search size={17} className="text-slate-500" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar candado o IMEI"
          className="h-11 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-slate-600"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {(["ALL", "ONLINE", "OFFLINE", "ALARM"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setStatus(item)}
            className={`rounded-xl border px-3 py-2 text-xs transition ${
              status === item
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                : "border-slate-700 bg-slate-950/50 text-slate-400 hover:bg-slate-800"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5 max-h-[620px] space-y-3 overflow-y-auto pr-1 sidebar-scroll">
        {locks.length > 0 ? (
          locks.map((lock) => (
            <button
              key={lock.id}
              type="button"
              onClick={() => setSelectedLockId(lock.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selectedLockId === lock.id
                  ? "border-cyan-400/40 bg-cyan-400/10"
                  : "border-slate-700/70 bg-slate-950/50 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <LockKeyhole size={18} className="mt-1 text-cyan-300" />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {lock.name}
                    </p>
                    <p className="text-xs text-slate-500">{lock.imei}</p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusClass(
                    lock.status
                  )}`}
                >
                  {statusLabel(lock.status)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-900/70 p-2">
                  <p className="text-slate-500">Batería</p>
                  <p className="mt-1 flex items-center gap-1 text-slate-200">
                    <Battery size={13} />
                    {lock.battery}%
                  </p>
                </div>

                <div className="rounded-lg bg-slate-900/70 p-2">
                  <p className="text-slate-500">Última señal</p>
                  <p className="mt-1 text-slate-200">
                    {formatDate(lock.lastSeen)}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Piso: {lock.floor ?? "No disponible"} · Altitud:{" "}
                {lock.altitude ? `${lock.altitude} m` : "No disponible"}
              </p>

              <div
                className="mt-4 grid grid-cols-2 gap-2"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  disabled={commandLoading}
                  onClick={() => onOpenLock(lock.imei)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UnlockKeyhole size={14} />
                  Abrir
                </button>

                <button
                  type="button"
                  disabled={commandLoading}
                  onClick={() => onCloseLock(lock.imei)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LockKeyhole size={14} />
                  Cerrar
                </button>
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-4 text-sm text-slate-500">
            No hay candados para mostrar.
          </div>
        )}
      </div>
    </aside>
  );
}