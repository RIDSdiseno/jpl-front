import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, LockKeyhole, Send, Wifi, WifiOff } from "lucide-react";
import type { ControlDevice } from "../types/control.types";
import { fetchControlDevices, setDevicePassword } from "../services/control.service";

export default function PasswordPage() {
  const [devices, setDevices] = useState<ControlDevice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchControlDevices().then(setDevices).catch(console.error);
  }, []);

  const selectedDevice = devices.find((d) => d.id === selectedId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;

    if (password !== confirm) {
      setMsg({ text: "Las contraseñas no coinciden", ok: false });
      return;
    }

    if (!/^\d{4,6}$/.test(password)) {
      setMsg({ text: "La contraseña debe ser entre 4 y 6 dígitos numéricos", ok: false });
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const res = await setDevicePassword(selectedId, password);
      setMsg({ text: res.message, ok: res.ok });
      if (res.ok) {
        setPassword("");
        setConfirm("");
      }
    } catch (e) {
      setMsg({ text: String(e), ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Contraseña</h2>
        <p className="text-sm text-slate-500 mt-1">
          Establece o cambia la contraseña de acceso local del candado
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
              onClick={() => { setSelectedId(d.id); setMsg(null); }}
              className={`w-full rounded-xl border p-3 text-left transition ${
                selectedId === d.id
                  ? "border-cyan-400/40 bg-cyan-400/10"
                  : "border-slate-700/70 bg-slate-950/50 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <LockKeyhole size={15} className="text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {d.name ?? d.terminalId}
                  </p>
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

        {/* Form */}
        <div className="lg:col-span-2">
          {!selectedDevice ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-950/40 text-slate-600 text-sm">
              Selecciona un dispositivo
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-3">
                <p className="font-semibold text-white">{selectedDevice.name ?? selectedDevice.terminalId}</p>
                <p className="text-xs text-slate-500">{selectedDevice.terminalId}</p>
              </div>

              {/* Info banner */}
              <div className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs text-amber-300 leading-relaxed">
                <KeyRound size={13} className="inline mr-1.5" />
                La contraseña debe tener entre 4 y 6 dígitos numéricos. Es la clave para acceso local mediante teclado.
                {!selectedDevice.isOnlineTcp && (
                  <span className="block mt-1 text-amber-400">
                    El dispositivo está offline — el comando se enviará cuando se reconecte.
                  </span>
                )}
              </div>

              {msg && (
                <div
                  className={`rounded-lg border px-4 py-2 text-sm ${
                    msg.ok
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border-red-400/20 bg-red-400/10 text-red-300"
                  }`}
                >
                  {msg.text}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-xs text-slate-400">
                    Nueva contraseña (4–6 dígitos)
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3">
                    <KeyRound size={15} className="text-slate-500" />
                    <input
                      type={showPw ? "text" : "password"}
                      inputMode="numeric"
                      maxLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))}
                      placeholder="······"
                      className="h-10 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-slate-600 tracking-widest"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="text-slate-500 hover:text-slate-300">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs text-slate-400">
                    Confirmar contraseña
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3">
                    <KeyRound size={15} className="text-slate-500" />
                    <input
                      type={showPw ? "text" : "password"}
                      inputMode="numeric"
                      maxLength={6}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value.replace(/\D/g, ""))}
                      placeholder="······"
                      className="h-10 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-slate-600 tracking-widest"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-400/20 disabled:opacity-50 transition"
              >
                <Send size={15} />
                {loading ? "Enviando..." : "Enviar al dispositivo"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
