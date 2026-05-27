import { useEffect, useState } from "react";
import { Activity, LockKeyhole, Wifi, WifiOff } from "lucide-react";
import type { ControlDevice, DeviceParameterSnapshot } from "../types/control.types";
import { fetchControlDevices, fetchParameterSnapshots } from "../services/control.service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

function renderParams(params: unknown) {
  if (!params || typeof params !== "object") return null;

  const entries = Object.entries(params as Record<string, unknown>);

  return (
    <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
      {entries.map(([key, val]) => (
        <div key={key} className="rounded-lg bg-slate-900/70 px-2 py-1.5">
          <p className="text-[10px] text-slate-500">{key}</p>
          <p className="mt-0.5 font-mono text-xs text-slate-200 break-all">
            {val === null || val === undefined ? "—" : String(val)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function ParametersPage() {
  const [devices, setDevices] = useState<ControlDevice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<DeviceParameterSnapshot[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchControlDevices().then(setDevices).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedId) { setSnapshots([]); return; }
    setLoading(true);
    fetchParameterSnapshots(selectedId)
      .then((res) => setSnapshots(res.snapshots))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedId]);

  const selectedDevice = devices.find((d) => d.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Parámetros</h2>
        <p className="text-sm text-slate-500 mt-1">
          Historial de snapshots de parámetros recibidos desde los dispositivos
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Device list */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-500 px-1">Dispositivos</p>
          {devices.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setSelectedId(d.id)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                selectedId === d.id
                  ? "border-cyan-400/40 bg-cyan-400/10"
                  : "border-slate-700/70 bg-slate-950/50 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <LockKeyhole size={15} className="text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{d.name ?? d.terminalId}</p>
                  <p className="truncate text-[11px] text-slate-500">{d.terminalId}</p>
                </div>
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-xs">
                {d.isOnlineTcp
                  ? <><Wifi size={11} className="text-emerald-400" /><span className="text-emerald-400">En línea</span></>
                  : <><WifiOff size={11} className="text-slate-500" /><span className="text-slate-500">Offline</span></>}
              </p>
            </button>
          ))}
        </div>

        {/* Snapshots */}
        <div className="lg:col-span-2 space-y-3">
          {!selectedDevice ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-950/40 text-slate-600 text-sm">
              Selecciona un dispositivo para ver sus parámetros
            </div>
          ) : loading ? (
            <div className="text-sm text-slate-600 px-1">Cargando...</div>
          ) : snapshots.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/50 text-center text-sm text-slate-600">
              <Activity size={24} className="mb-2 opacity-40" />
              Sin snapshots de parámetros
              <p className="mt-1 text-[11px]">
                Los parámetros se guardan automáticamente cuando el dispositivo responde al comando de lectura
              </p>
            </div>
          ) : (
            snapshots.map((snap) => (
              <div
                key={snap.id}
                className="rounded-xl border border-slate-700/50 bg-slate-950/50 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === snap.id ? null : snap.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-900/40 transition"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {formatDate(snap.readAt)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Fuente: {snap.source} · Categoría: {snap.category}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {expanded === snap.id ? "▲ Ocultar" : "▼ Ver parámetros"}
                  </span>
                </button>

                {expanded === snap.id && (
                  <div className="border-t border-slate-800 px-4 py-3">
                    {renderParams(snap.parameters)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
