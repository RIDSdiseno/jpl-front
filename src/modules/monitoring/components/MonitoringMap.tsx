import { useEffect, useMemo, useRef } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
  type MapRef,
} from "react-map-gl/mapbox";
import {
  Battery,
  Lock,
  LockKeyhole,
  LockOpen,
  MapPin,
  Radio,
  Satellite,
  ShieldAlert,
  Signal,
  Target,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { MonitoringLock } from "../types/monitoring.types";

interface Props {
  locks: MonitoringLock[];
  selectedLockId: string | null;
  setSelectedLockId: (value: string | null) => void;
  onOpenLock?: (terminalId: string) => void;
  onCloseLock?: (terminalId: string) => void;
  onEnableTracking?: (terminalId: string) => void;
  onForceGps?: (terminalId: string) => void;
  commandLoading?: boolean;
}

const DEFAULT_CENTER = {
  longitude: -70.6693,
  latitude: -33.4489,
};

function isValidCoordinate(latitude?: number | null, longitude?: number | null) {
  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function markerColor(status: MonitoringLock["status"]) {
  if (status === "ONLINE") return "bg-emerald-400";
  if (status === "OFFLINE") return "bg-slate-400";
  if (status === "ALARM") return "bg-red-400";
  return "bg-cyan-400";
}

function StatusIcon({ status }: { status: MonitoringLock["status"] }) {
  if (status === "ONLINE") {
    return <Wifi size={14} className="text-emerald-400" />;
  }

  if (status === "OFFLINE") {
    return <WifiOff size={14} className="text-slate-400" />;
  }

  return <ShieldAlert size={14} className="text-red-400" />;
}

function formatBattery(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "No disponible";
  }

  return `${value}%`;
}

function formatVoltage(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "No disponible";
  }

  return `${value.toFixed(2)}V`;
}

function formatNumber(value?: number | null, suffix = "") {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "No disponible";
  }

  return `${value}${suffix}`;
}

function sourceLabel(source?: MonitoringLock["locationSource"]) {
  if (source === "GPS") return "GPS";
  if (source === "LBS") return "LBS / Antenas";
  if (source === "WIFI") return "WiFi";
  return "No disponible";
}

function getTerminalId(lock: MonitoringLock) {
  return lock.imei;
}

export default function MonitoringMap({
  locks,
  selectedLockId,
  setSelectedLockId,
  onOpenLock,
  onCloseLock,
  onEnableTracking,
  onForceGps,
  commandLoading = false,
}: Props) {
  const mapRef = useRef<MapRef | null>(null);
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  const validLocks = useMemo(() => {
    return locks.filter((lock) =>
      isValidCoordinate(lock.latitude, lock.longitude)
    );
  }, [locks]);

  const selectedLock = useMemo(() => {
    return validLocks.find((item) => item.id === selectedLockId) ?? null;
  }, [validLocks, selectedLockId]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedLock) {
      mapRef.current.flyTo({
        center: [selectedLock.longitude ?? 0, selectedLock.latitude ?? 0],
        zoom: 18,
        pitch: 70,
        bearing: -25,
        duration: 1200,
      });

      return;
    }

    if (validLocks.length > 0) {
      const first = validLocks[0];

      mapRef.current.flyTo({
        center: [
          first.longitude ?? DEFAULT_CENTER.longitude,
          first.latitude ?? DEFAULT_CENTER.latitude,
        ],
        zoom: 14,
        pitch: 60,
        bearing: -20,
        duration: 1200,
      });
    }
  }, [selectedLock, validLocks]);

  if (!token) {
    return (
      <div className="flex h-[760px] items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-300">
        Falta configurar VITE_MAPBOX_TOKEN
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-3">
      <div className="h-[760px] overflow-hidden rounded-xl">
        <Map
          ref={mapRef}
          mapboxAccessToken={token}
          initialViewState={{
            longitude: DEFAULT_CENTER.longitude,
            latitude: DEFAULT_CENTER.latitude,
            zoom: 13,
            pitch: 60,
            bearing: -20,
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          style={{ width: "100%", height: "100%" }}
          onLoad={(event) => {
            const map = event.target;

            if (map.getLayer("3d-buildings")) return;

            map.addLayer({
              id: "3d-buildings",
              source: "composite",
              "source-layer": "building",
              filter: ["==", "extrude", "true"],
              type: "fill-extrusion",
              minzoom: 15,
              paint: {
                "fill-extrusion-color": "#1e293b",
                "fill-extrusion-height": ["get", "height"],
                "fill-extrusion-base": ["get", "min_height"],
                "fill-extrusion-opacity": 0.8,
              },
            });
          }}
        >
          <NavigationControl position="top-right" />

          {validLocks.length > 1 && (
            <Source
              id="locks-line"
              type="geojson"
              data={{
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: validLocks.map((lock) => [
                    lock.longitude ?? 0,
                    lock.latitude ?? 0,
                  ]),
                },
              }}
            >
              <Layer
                id="locks-line-layer"
                type="line"
                paint={{
                  "line-color": "#22d3ee",
                  "line-width": 2,
                  "line-opacity": 0.25,
                }}
              />
            </Source>
          )}

          {validLocks.map((lock) => (
            <Marker
              key={lock.id}
              longitude={lock.longitude ?? DEFAULT_CENTER.longitude}
              latitude={lock.latitude ?? DEFAULT_CENTER.latitude}
              anchor="bottom"
              onClick={(event) => {
                event.originalEvent.stopPropagation();
                setSelectedLockId(lock.id);
              }}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-white shadow-[0_0_20px_rgba(34,211,238,0.6)] transition ${markerColor(
                    lock.status
                  )}`}
                >
                  <LockKeyhole size={18} className="text-slate-950" />
                </div>

                <div className="mt-1 rounded-full bg-slate-950/85 px-2 py-1 text-[10px] text-white shadow-lg">
                  {lock.name}
                </div>
              </div>
            </Marker>
          ))}

          {selectedLock && (
            <Popup
              longitude={selectedLock.longitude ?? DEFAULT_CENTER.longitude}
              latitude={selectedLock.latitude ?? DEFAULT_CENTER.latitude}
              anchor="top"
              closeOnClick={false}
              onClose={() => setSelectedLockId(null)}
              maxWidth="340px"
            >
              <div className="min-w-[300px] rounded-[14px] bg-slate-950 p-4 text-slate-200">
                {/* Header */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                    <LockKeyhole size={15} className="text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{selectedLock.name}</p>
                    <p className="text-[10px] text-slate-500">{selectedLock.imei}</p>
                  </div>
                  <StatusIcon status={selectedLock.status} />
                </div>

                {/* Info grid */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-900 p-2">
                    <p className="text-slate-500">Estado</p>
                    <p className={`mt-0.5 font-semibold ${
                      selectedLock.status === "ONLINE"
                        ? "text-emerald-400"
                        : selectedLock.status === "ALARM"
                          ? "text-red-400"
                          : "text-slate-400"
                    }`}>
                      {selectedLock.status === "ONLINE" ? "En línea" : selectedLock.status === "OFFLINE" ? "Sin conexión" : "Alarma"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-900 p-2">
                    <p className="text-slate-500">Fuente GPS</p>
                    <p className="mt-0.5 font-semibold text-slate-200">
                      {selectedLock.gpsValid
                        ? "GPS válido ✓"
                        : sourceLabel(selectedLock.locationSource) !== "No disponible"
                          ? sourceLabel(selectedLock.locationSource)
                          : "Sin señal"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-900 p-2">
                    <p className="flex items-center gap-1 text-slate-500"><Battery size={11} /> Batería</p>
                    <p className="mt-0.5 font-semibold text-slate-200">{formatBattery(selectedLock.battery)}</p>
                    <p className="text-[10px] text-slate-600">{formatVoltage(selectedLock.batteryVoltage)}</p>
                  </div>

                  <div className="rounded-lg bg-slate-900 p-2">
                    <p className="flex items-center gap-1 text-slate-500"><Signal size={11} /> Señal CSQ</p>
                    <p className="mt-0.5 font-semibold text-slate-200">{formatNumber(selectedLock.csq)}</p>
                    <p className="text-[10px] text-slate-600"><Satellite size={10} className="inline mr-0.5" />{formatNumber(selectedLock.satellites)} satélites</p>
                  </div>

                  <div className="rounded-lg bg-slate-900 p-2">
                    <p className="text-slate-500">Velocidad</p>
                    <p className="mt-0.5 font-semibold text-slate-200">{formatNumber(selectedLock.speed, " km/h")}</p>
                  </div>

                  <div className="rounded-lg bg-slate-900 p-2">
                    <p className="text-slate-500">Altitud</p>
                    <p className="mt-0.5 font-semibold text-slate-200">{formatNumber(selectedLock.altitude, " m")}</p>
                  </div>
                </div>

                {/* Coords */}
                {isValidCoordinate(selectedLock.latitude, selectedLock.longitude) && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-400">
                    <MapPin size={11} className="text-cyan-400 shrink-0" />
                    {selectedLock.latitude?.toFixed(6)}, {selectedLock.longitude?.toFixed(6)}
                  </div>
                )}

                {/* Last seen */}
                <p className="mt-2 text-center text-[10px] text-slate-600">
                  Última señal: {new Date(selectedLock.lastSeen).toLocaleString("es-CL")}
                </p>

                {/* Actions */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={commandLoading || !onOpenLock}
                    onClick={() => onOpenLock?.(getTerminalId(selectedLock))}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-40 transition"
                  >
                    <LockOpen size={13} />
                    Abrir
                  </button>

                  <button
                    type="button"
                    disabled={commandLoading || !onCloseLock}
                    onClick={() => onCloseLock?.(getTerminalId(selectedLock))}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500/20 border border-red-500/30 px-2 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-40 transition"
                  >
                    <Lock size={13} />
                    Cerrar
                  </button>

                  <button
                    type="button"
                    disabled={commandLoading || !onEnableTracking}
                    onClick={() => onEnableTracking?.(getTerminalId(selectedLock))}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-2 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-40 transition"
                  >
                    <Radio size={13} />
                    Tracking
                  </button>

                  <button
                    type="button"
                    disabled={commandLoading || !onForceGps}
                    onClick={() => onForceGps?.(getTerminalId(selectedLock))}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/30 px-2 py-2 text-xs font-semibold text-fuchsia-300 hover:bg-fuchsia-500/30 disabled:cursor-not-allowed disabled:opacity-40 transition"
                  >
                    <Target size={13} />
                    Forzar GPS
                  </button>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}