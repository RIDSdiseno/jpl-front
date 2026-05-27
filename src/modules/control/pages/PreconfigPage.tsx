import { useEffect, useState } from "react";
import { CheckCircle, LockKeyhole, Radio, Satellite, Settings2, Wifi, WifiOff, Zap } from "lucide-react";
import type { ControlDevice, PresetKey } from "../types/control.types";
import { applyPreset, fetchControlDevices } from "../services/control.service";

interface Preset {
  key: PresetKey;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  params: string[];
}

const PRESETS: Preset[] = [
  {
    key: "tracking_fast",
    label: "Tracking Rápido",
    description: "Posición cada 10 s · Heartbeat cada 30 s",
    icon: Zap,
    color: "amber",
    params: ["Intervalo: 10 s", "Heartbeat: 30 s", "Alta frecuencia de reporte"],
  },
  {
    key: "tracking_normal",
    label: "Tracking Normal",
    description: "Posición cada 30 s · Heartbeat cada 60 s",
    icon: Radio,
    color: "cyan",
    params: ["Intervalo: 30 s", "Heartbeat: 60 s", "Configuración estándar"],
  },
  {
    key: "tracking_slow",
    label: "Tracking Lento",
    description: "Posición cada 2 min · Heartbeat cada 3 min",
    icon: Settings2,
    color: "slate",
    params: ["Intervalo: 120 s", "Heartbeat: 180 s", "Modo ahorro de batería"],
  },
  {
    key: "gps_force",
    label: "Forzar GPS",
    description: "GPS de alta precisión cada 15 s",
    icon: Satellite,
    color: "fuchsia",
    params: ["Intervalo: 15 s", "Precisión: 10 m", "GNSS Quality: 1", "Location Status: 1"],
  },
];

const COLOR_CLASSES: Record<string, { card: string; btn: string; icon: string }> = {
  amber: { card: "border-amber-400/20", btn: "border-amber-400/25 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20", icon: "text-amber-400" },
  cyan: { card: "border-cyan-400/20", btn: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20", icon: "text-cyan-400" },
  slate: { card: "border-slate-500/30", btn: "border-slate-500/30 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20", icon: "text-slate-400" },
  fuchsia: { card: "border-fuchsia-400/20", btn: "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-300 hover:bg-fuchsia-400/20", icon: "text-fuchsia-400" },
};

export default function PreconfigPage() {
  const [devices, setDevices] = useState<ControlDevice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<PresetKey | null>(null);
  const [results, setResults] = useState<Record<string, { ok: boolean; text: string }>>({});

  useEffect(() => {
    fetchControlDevices().then(setDevices).catch(console.error);
  }, []);

  const selectedDevice = devices.find((d) => d.id === selectedId);

  async function handleApply(preset: PresetKey) {
    if (!selectedId) return;
    setLoading(preset);

    try {
      const res = await applyPreset(selectedId, preset);
      setResults((prev) => ({
        ...prev,
        [preset]: { ok: res.ok, text: res.message },
      }));
    } catch (e) {
      setResults((prev) => ({
        ...prev,
        [preset]: { ok: false, text: String(e) },
      }));
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Preconfiguración</h2>
        <p className="text-sm text-slate-500 mt-1">
          Aplica configuraciones predefinidas de tracking y GPS a los dispositivos
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Device list */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-500 px-1">Dispositivo objetivo</p>
          {devices.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => { setSelectedId(d.id); setResults({}); }}
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

        {/* Presets */}
        <div className="lg:col-span-2">
          {!selectedDevice ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-950/40 text-slate-600 text-sm">
              Selecciona un dispositivo para aplicar una preconfiguración
            </div>
          ) : (
            <div className="space-y-4">
              {!selectedDevice.isOnlineTcp && (
                <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs text-amber-300">
                  El dispositivo está offline — los comandos se encolarán y enviarán al reconectarse.
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {PRESETS.map((preset) => {
                  const cls = COLOR_CLASSES[preset.color];
                  const result = results[preset.key];
                  const isLoading = loading === preset.key;
                  const Icon = preset.icon;

                  return (
                    <div
                      key={preset.key}
                      className={`rounded-xl border bg-slate-950/50 p-4 ${cls.card}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${cls.icon}`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white">{preset.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{preset.description}</p>

                          <ul className="mt-2 space-y-0.5">
                            {preset.params.map((p) => (
                              <li key={p} className="text-[11px] text-slate-500">· {p}</li>
                            ))}
                          </ul>

                          {result && (
                            <div
                              className={`mt-3 flex items-start gap-1.5 rounded-lg px-2 py-1.5 text-[11px] ${
                                result.ok
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-red-400/10 text-red-300"
                              }`}
                            >
                              {result.ok && <CheckCircle size={11} className="mt-0.5 shrink-0" />}
                              {result.text}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApply(preset.key)}
                        disabled={isLoading || loading !== null}
                        className={`mt-4 w-full rounded-lg border py-2 text-xs font-semibold transition disabled:opacity-50 ${cls.btn}`}
                      >
                        {isLoading ? "Aplicando..." : "Aplicar configuración"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
