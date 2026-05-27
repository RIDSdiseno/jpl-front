import { useEffect, useState } from "react";
import {
  CreditCard,
  LockKeyhole,
  Plus,
  RefreshCw,
  Trash2,
  Wifi,
  WifiOff,
  Shield,
  Eraser,
} from "lucide-react";
import type { ControlDevice, NfcCard } from "../types/control.types";
import {
  addNfcCard,
  clearIcCards,
  fetchControlDevices,
  fetchNfcCards,
  removeNfcCard,
  setIcCardPassword,
  startNfcAutoBind,
} from "../services/control.service";

function statusDot(online: boolean) {
  return online ? (
    <span className="flex items-center gap-1 text-emerald-400 text-xs">
      <Wifi size={12} /> En línea
    </span>
  ) : (
    <span className="flex items-center gap-1 text-slate-500 text-xs">
      <WifiOff size={12} /> Offline
    </span>
  );
}

export default function NfcPage() {
  const [devices, setDevices] = useState<ControlDevice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cards, setCards] = useState<NfcCard[]>([]);
  const [newCard, setNewCard] = useState("");
  const [icPassword, setIcPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoBinding, setAutoBinding] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const data = await fetchControlDevices();
        if (!cancelled) setDevices(data);
      } catch (e) {
        console.error(e);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedDevice = devices.find((d) => d.id === selectedId);

  async function reloadCards(deviceId: string) {
    setLoading(true);

    try {
      const res = await fetchNfcCards(deviceId);
      setCards(res.cards);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);

      try {
        if (!selectedId) {
          if (!cancelled) setCards([]);
          return;
        }

        const res = await fetchNfcCards(selectedId);

        if (!cancelled) {
          setCards(res.cards);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    queueMicrotask(() => {
      void run();
    });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  async function handleAdd() {
    if (!selectedId || !newCard.trim()) return;

    setLoading(true);
    setMsg(null);

    try {
      const res = await addNfcCard(selectedId, newCard.trim());
      setMsg({ text: res.message, ok: res.created });
      setNewCard("");
      await reloadCards(selectedId);
    } catch (e) {
      setMsg({ text: String(e), ok: false });
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(cardId: string) {
    if (!selectedId) return;

    setLoading(true);
    setMsg(null);

    try {
      const res = await removeNfcCard(selectedId, cardId);
      setMsg({ text: res.message, ok: res.deleted });
      await reloadCards(selectedId);
    } catch (e) {
      setMsg({ text: String(e), ok: false });
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoBind() {
    if (!selectedId) return;

    setAutoBinding(true);
    setMsg(null);

    try {
      const res = await startNfcAutoBind(selectedId, 120);
      setMsg({
        text: `${res.message}. Ahora acerca la tarjeta o el celular al candado durante los próximos 120 segundos.`,
        ok: res.ok,
      });
    } catch (e) {
      setMsg({ text: String(e), ok: false });
    } finally {
      setAutoBinding(false);
    }
  }

  async function handleSetIcPassword() {
    if (!selectedId || !icPassword.trim()) return;

    setLoading(true);
    setMsg(null);

    try {
      const res = await setIcCardPassword(selectedId, icPassword);
      setMsg({ text: res.message, ok: res.ok });
      setIcPassword("");
    } catch (e) {
      setMsg({ text: String(e), ok: false });
    } finally {
      setLoading(false);
    }
  }

  async function handleClearCards() {
    if (!selectedId) return;

    const confirmed = window.confirm(
      "Esto enviará el comando para limpiar las tarjetas IC/NFC vinculadas al candado. ¿Deseas continuar?"
    );

    if (!confirmed) return;

    setLoading(true);
    setMsg(null);

    try {
      const res = await clearIcCards(selectedId);
      setMsg({ text: res.message, ok: res.ok });
      await reloadCards(selectedId);
    } catch (e) {
      setMsg({ text: String(e), ok: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-white sm:text-xl">
          Gestión NFC
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Activa auto-vinculación, configura contraseña IC y registra tarjetas de referencia.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[340px_1fr]">
        <aside className="min-w-0 space-y-2">
          <p className="px-1 text-xs uppercase tracking-widest text-slate-500">
            Dispositivos
          </p>

          {devices.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-700/50 p-4 text-sm text-slate-600">
              Sin dispositivos
            </div>
          )}

          {devices.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setSelectedId(d.id);
                setMsg(null);
              }}
              className={`w-full min-w-0 rounded-xl border p-3 text-left transition ${
                selectedId === d.id
                  ? "border-cyan-400/40 bg-cyan-400/10"
                  : "border-slate-700/70 bg-slate-950/50 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <LockKeyhole size={15} className="shrink-0 text-cyan-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {d.name ?? d.terminalId}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    {d.terminalId}
                  </p>
                </div>
              </div>
              <div className="mt-2">{statusDot(d.isOnlineTcp)}</div>
            </button>
          ))}
        </aside>

        <section className="min-w-0 space-y-4">
          {!selectedDevice ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-slate-700/50 bg-slate-950/40 text-sm text-slate-600">
              Selecciona un dispositivo
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-4">
                <p className="font-semibold text-white">
                  {selectedDevice.name ?? selectedDevice.terminalId}
                </p>
                <p className="mt-1 break-all font-mono text-xs text-slate-500">
                  {selectedDevice.terminalId}
                </p>
                <div className="mt-2">{statusDot(selectedDevice.isOnlineTcp)}</div>
              </div>

              {!selectedDevice.isOnlineTcp && (
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-xs leading-relaxed text-amber-300">
                  El candado está offline. Los comandos se encolarán y se enviarán cuando vuelva a conectarse por TCP.
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleAutoBind}
                  disabled={autoBinding}
                  className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-left transition hover:bg-cyan-400/15 disabled:opacity-50"
                >
                  <RefreshCw
                    size={20}
                    className={`mb-2 text-cyan-300 ${
                      autoBinding ? "animate-spin" : ""
                    }`}
                  />
                  <p className="text-sm font-semibold text-cyan-300">
                    Auto Bind 120s
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Activa modo aprendizaje. Luego acerca la tarjeta o celular al candado.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={handleClearCards}
                  disabled={loading}
                  className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-left transition hover:bg-red-400/15 disabled:opacity-50"
                >
                  <Eraser size={20} className="mb-2 text-red-300" />
                  <p className="text-sm font-semibold text-red-300">
                    Limpiar tarjetas
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Envía InstructionSet para borrar tarjetas IC/NFC vinculadas.
                  </p>
                </button>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-[1fr_auto]">
                <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3">
                  <Shield size={15} className="shrink-0 text-slate-500" />
                  <input
                    value={icPassword}
                    onChange={(e) => setIcPassword(e.target.value)}
                    placeholder="Password IC"
                    className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSetIcPassword}
                  disabled={loading || !icPassword.trim()}
                  className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-400/15 disabled:opacity-50"
                >
                  Set IC Password
                </button>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-[1fr_auto]">
                <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3">
                  <CreditCard size={15} className="shrink-0 text-slate-500" />
                  <input
                    value={newCard}
                    onChange={(e) => setNewCard(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Registrar tarjeta en sistema"
                    className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={loading || !newCard.trim()}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-400/15 disabled:opacity-50"
                >
                  <Plus size={15} />
                  Agregar
                </button>
              </div>

              {msg && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    msg.ok
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border-red-400/20 bg-red-400/10 text-red-300"
                  }`}
                >
                  {msg.text}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 px-1">
                  <p className="text-xs uppercase tracking-widest text-slate-500">
                    Tarjetas registradas
                  </p>
                  {loading && (
                    <span className="text-xs text-slate-500">
                      Cargando...
                    </span>
                  )}
                </div>

                {!loading && cards.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-700/50 p-6 text-center text-sm text-slate-600">
                    No hay tarjetas registradas en el sistema
                  </div>
                )}

                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-950/50 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <CreditCard size={15} className="shrink-0 text-cyan-400" />
                      <div className="min-w-0">
                        <p className="truncate font-mono text-sm text-white">
                          {card.cardNumber ?? "Sin número"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {card.status}
                          {card.blockNumber ? ` · ${card.blockNumber}` : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(card.id)}
                      disabled={loading}
                      className="shrink-0 rounded-lg border border-red-400/20 bg-red-400/10 p-2 text-red-400 transition hover:bg-red-400/20 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}