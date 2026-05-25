import api from "../../../shared/api/api";
import type { ApiResponse, DashboardSummary } from "../types/dashboard.types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get<ApiResponse<DashboardSummary>>(
    "/dashboard/summary"
  );

  return response.data.data;
}