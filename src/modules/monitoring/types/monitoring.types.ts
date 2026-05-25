export type LockStatus = "ONLINE" | "OFFLINE" | "ALARM";
export type MonitoringLocationSource = "GPS" | "LBS" | "WIFI" | "INVALID";

export interface MonitoringLock {
  id: string;
  name: string;
  imei: string;
  status: LockStatus;

  latitude: number | null;
  longitude: number | null;

  battery: number | null;
  speed: number;
  altitude?: number;
  floor?: number;

  lastSeen: string | Date;

  locationSource: MonitoringLocationSource;
  gpsValid: boolean;
  coordsInRange: boolean;
  locationAccuracy?: number;

  satellites?: number;
  csq?: number;

  onlineFromTcp: boolean;
}

export interface MonitoringSummary {
  total: number;
  online: number;
  offline: number;
  alarm: number;
  withLocation: number;
  withoutLocation: number;
}

export interface MonitoringLocksResponse {
  locks: MonitoringLock[];
  summary: MonitoringSummary;
}

export interface TcpStats {
  connectedDevices: number;
  connectedByTerminalId: number;
  pendingCommands: number;
  totalConnections: number;
  totalPackets: number;
  storedPackets: number;
  uptimeSeconds: number;
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
}