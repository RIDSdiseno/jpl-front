import { useEffect, useMemo, useRef } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
  type MapRef,
} from "react-map-gl/mapbox";
import type mapboxgl from "mapbox-gl";
import { Battery, LockKeyhole, Wifi, WifiOff, ShieldAlert } from "lucide-react";
import type { MonitoringLock } from "../types/monitoring.types";

interface Props {
  locks: MonitoringLock[];
  selectedLockId: string | null;
  setSelectedLockId: (value: string | null) => void;
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

  const selectedLock = useMemo(() => {
    return locks.find((lock) => lock.id === selectedLockId) ?? null;
  }, [locks, selectedLockId]);

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

    if (locks.length > 0) {
      const first = locks[0];

      mapRef.current.flyTo({
        center: [first.longitude, first.latitude],
        zoom: 14,
        pitch: 60,
        bearing: -20,
        duration: 1200,
      });
    }
  }, [selectedLock, locks]);

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
            longitude: -70.6693,
            latitude: -33.4489,
            zoom: 13,
            pitch: 60,
            bearing: -20,
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          style={{ width: "100%", height: "100%" }}
          onLoad={(event) => {
            const map = event.target as mapboxgl.Map;

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

          {locks.length > 0 && (
            <Source
              id="locks-line"
              type="geojson"
              data={{
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: locks.map((lock) => [
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

          {locks.map((lock) => (
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