import api from "../../../shared/api/api";
import type {
  ApiResponse,
  MonitoringLocksResponse,
  TcpStats,
} from "../types/monitoring.types";

export async function getMonitoringLocks(): Promise<MonitoringLocksResponse> {
  const response = await api.get<ApiResponse<MonitoringLocksResponse>>(
    "/monitoring/locks"
  );

  return response.data.data;
}

export async function getTcpStats(): Promise<TcpStats> {
  const response = await api.get<ApiResponse<TcpStats>>("/tcp/stats");

  return response.data.data;
}

export async function openLock(terminalId: string) {
  const response = await api.post(`/tcp/devices/${terminalId}/open`, {
    operatorName: "admin",
  });

  return response.data;
}

export async function closeLock(terminalId: string) {
  const response = await api.post(`/tcp/devices/${terminalId}/close`, {
    operatorName: "admin",
  });

  return response.data;
}

export async function enableTracking(
  terminalId: string,
  payload?: {
    timeIntervalSeconds?: number;
    heartbeatIntervalSeconds?: number;
  }
) {
  const response = await api.post(
    `/tcp/devices/${terminalId}/enable-tracking`,
    {
      timeIntervalSeconds: payload?.timeIntervalSeconds ?? 30,
      heartbeatIntervalSeconds: payload?.heartbeatIntervalSeconds ?? 60,
      operatorName: "admin",
    }
  );

  return response.data;
}

export async function forceGps(
  terminalId: string,
  payload?: {
    timeIntervalSeconds?: number;
    heartbeatIntervalSeconds?: number;
    positionAccuracyMeters?: number;
    gnssPositionQuality?: number;
    locationStatus?: number;
  }
) {
  const response = await api.post(`/tcp/devices/${terminalId}/force-gps`, {
    timeIntervalSeconds: payload?.timeIntervalSeconds ?? 30,
    heartbeatIntervalSeconds: payload?.heartbeatIntervalSeconds ?? 60,
    positionAccuracyMeters: payload?.positionAccuracyMeters ?? 10,
    gnssPositionQuality: payload?.gnssPositionQuality ?? 1,
    locationStatus: payload?.locationStatus ?? 1,
    operatorName: "admin",
  });

  return response.data;
}