import { useMemo, useState } from "react";
import MonitoringMap from "../components/MonitoringMap";
import MonitoringSidebar from "../components/MonitoringSidebar";
import MonitoringStats from "../components/MonitoringStats";
import {
  useCloseLock,
  useEnableTracking,
  useMonitoringLocks,
  useOpenLock,
  useTcpStats,
} from "../hooks/useMonitoring";
import type { LockStatus, MonitoringLock } from "../types/monitoring.types";

function hasValidCoordinates(lock: MonitoringLock) {
  return (
    typeof lock.latitude === "number" &&
    typeof lock.longitude === "number" &&
    Number.isFinite(lock.latitude) &&
    Number.isFinite(lock.longitude) &&
    lock.latitude >= -90 &&
    lock.latitude <= 90 &&
    lock.longitude >= -180 &&
    lock.longitude <= 180
  );
}

export default function MonitoringPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | LockStatus>("ALL");
  const [selectedLockId, setSelectedLockId] = useState<string | null>(null);

  const locksQuery = useMonitoringLocks();
  const tcpStatsQuery = useTcpStats();

  const openLockMutation = useOpenLock();
  const closeLockMutation = useCloseLock();
  const enableTrackingMutation = useEnableTracking();

  const locks = locksQuery.data?.locks ?? [];
  const summary = locksQuery.data?.summary;
  const tcpStats = tcpStatsQuery.data;

  const filteredLocks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return locks.filter((lock) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        lock.name.toLowerCase().includes(normalizedSearch) ||
        lock.imei.toLowerCase().includes(normalizedSearch);

      const matchesStatus = status === "ALL" || lock.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [locks, search, status]);

  const mapLocks = useMemo(() => {
    return filteredLocks.filter(hasValidCoordinates);
  }, [filteredLocks]);

  const selectedLock =
    filteredLocks.find((lock) => lock.id === selectedLockId) ?? null;

  const selectedMapLockId =
    selectedLock && hasValidCoordinates(selectedLock) ? selectedLock.id : null;

  function handleOpenLock(terminalId: string) {
    openLockMutation.mutate(terminalId);
  }

  function handleCloseLock(terminalId: string) {
    closeLockMutation.mutate(terminalId);
  }

  function handleEnableTracking(terminalId: string) {
    enableTrackingMutation.mutate(terminalId);
  }

  const commandLoading =
    openLockMutation.isPending ||
    closeLockMutation.isPending ||
    enableTrackingMutation.isPending;

  if (locksQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6 text-slate-300">
        Cargando monitoreo...
      </div>
    );
  }

  if (locksQuery.isError) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6">
        <h1 className="text-xl font-semibold text-red-300">
          No se pudo cargar monitoreo
        </h1>

        <button
          type="button"
          onClick={() => locksQuery.refetch()}
          className="mt-4 rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-200 hover:bg-red-500/30"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            JPL-AIOT-LOCK
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-white">
            Monitoreo 3D
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Geolocalización de candados inteligentes, conexión TCP y comandos en
            tiempo real.
          </p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-slate-950/60 px-4 py-3 text-sm">
          <p className="text-slate-400">TCP conectado</p>
          <p className="mt-1 font-semibold text-cyan-300">
            {tcpStats?.connectedByTerminalId ?? 0} candado(s)
          </p>
        </div>
      </section>

      <MonitoringStats locks={locks} summary={summary} tcpStats={tcpStats} />

      <section className="grid gap-6 xl:grid-cols-[390px_1fr]">
        <MonitoringSidebar
        locks={filteredLocks}
        search={search}
        status={status}
        selectedLockId={selectedLockId}
        setSearch={setSearch}
        setStatus={setStatus}
        setSelectedLockId={setSelectedLockId}
        onOpenLock={handleOpenLock}
        onCloseLock={handleCloseLock}
        onEnableTracking={handleEnableTracking}
        commandLoading={commandLoading}
        />

        <MonitoringMap
          locks={mapLocks}
          selectedLockId={selectedMapLockId}
          setSelectedLockId={setSelectedLockId}
        />
      </section>
    </div>
  );
}