export type LockStatus = "ONLINE" | "OFFLINE" | "ALARM";

export interface MonitoringLock {
  id: string;
  name: string;
  imei: string;
  status: LockStatus;
  latitude: number;
  longitude: number;
  battery: number;
  speed?: number;
  altitude?: number;
  floor?: number;
  lastSeen: string;
}

export interface MonitoringSummary {
  total: number;
  online: number;
  offline: number;
  alarm: number;
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