import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closeLock,
  getMonitoringLocks,
  getTcpStats,
  openLock,
} from "../services/monitoring.service";

export function useMonitoringLocks() {
  return useQuery({
    queryKey: ["monitoring-locks"],
    queryFn: getMonitoringLocks,
    refetchInterval: 10_000,
  });
}

export function useTcpStats() {
  return useQuery({
    queryKey: ["tcp-stats"],
    queryFn: getTcpStats,
    refetchInterval: 5_000,
  });
}

export function useOpenLock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openLock,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["monitoring-locks"] });
      await queryClient.invalidateQueries({ queryKey: ["tcp-stats"] });
    },
  });
}

export function useCloseLock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeLock,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["monitoring-locks"] });
      await queryClient.invalidateQueries({ queryKey: ["tcp-stats"] });
    },
  });
}