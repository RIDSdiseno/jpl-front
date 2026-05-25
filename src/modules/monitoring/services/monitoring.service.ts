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