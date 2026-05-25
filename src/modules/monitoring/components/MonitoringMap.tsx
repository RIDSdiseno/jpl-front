import { useEffect, useMemo, useRef } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
  type MapRef,
} from "react-map-gl/mapbox";
import { Battery, LockKeyhole, ShieldAlert, Wifi, WifiOff } from "lucide-react";
import type { MonitoringLock } from "../types/monitoring.types";

interface Props {
  locks: MonitoringLock[];
  selectedLockId: string | null;
  setSelectedLockId: (value: string | null) => void;
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
  switch (status) {
    case "ONLINE":
      return "bg-emerald-400";
    case "OFFLINE":
      return "bg-slate-400";
    case "ALARM":
      return "bg-red-400";
    default:
      return "bg-cyan-400";
  }
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

export default function MonitoringMap({
  locks,
  selectedLockId,
  setSelectedLockId,
}: Props) {
  const mapRef = useRef<MapRef | null>(null);
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  const validLocks = useMemo(() => {
    return locks.filter((lock) =>
      isValidCoordinate(lock.latitude, lock.longitude)
    );
  }, [locks]);

  const selectedLock = useMemo(() => {
    const lock = validLocks.find((item) => item.id === selectedLockId);
    return lock ?? null;
  }, [validLocks, selectedLockId]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedLock) {
      mapRef.current.flyTo({
        center: [selectedLock.longitude, selectedLock.latitude],
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
        center: [first.longitude, first.latitude],
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
                    lock.longitude,
                    lock.latitude,
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
              longitude={lock.longitude}
              latitude={lock.latitude}
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
              longitude={selectedLock.longitude}
              latitude={selectedLock.latitude}
              anchor="top"
              closeOnClick={false}
              onClose={() => setSelectedLockId(null)}
            >
              <div className="min-w-[260px] text-slate-900">
                <div className="flex items-center justify-between">
                  <strong>{selectedLock.name}</strong>
                  <StatusIcon status={selectedLock.status} />
                </div>

                <div className="mt-3 space-y-2 text-sm">
                  <p>
                    <strong>IMEI:</strong> {selectedLock.imei}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedLock.status}
                  </p>
                  <p className="flex items-center gap-2">
                    <Battery size={14} />
                    <strong>Batería:</strong> {selectedLock.battery}%
                  </p>
                  <p>
                    <strong>Velocidad:</strong> {selectedLock.speed ?? 0} km/h
                  </p>
                  <p>
                    <strong>Altitud:</strong>{" "}
                    {selectedLock.altitude
                      ? `${selectedLock.altitude} m`
                      : "No disponible"}
                  </p>
                  <p>
                    <strong>Piso estimado:</strong>{" "}
                    {selectedLock.floor ?? "No disponible"}
                  </p>
                  <p>
                    <strong>Última señal:</strong>{" "}
                    {new Date(selectedLock.lastSeen).toLocaleString("es-CL")}
                  </p>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}