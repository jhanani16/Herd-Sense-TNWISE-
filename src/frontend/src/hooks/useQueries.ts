import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Alert, AnimalRecord } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useGetRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<AnimalRecord[]>({
    queryKey: ["records"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getRecords();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAlerts() {
  const { actor, isFetching } = useActor();
  return useQuery<Alert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAlerts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery<{ totalAlerts: bigint; totalRecords: bigint }>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) return { totalAlerts: BigInt(0), totalRecords: BigInt(0) };
      try {
        return await actor.getStats();
      } catch {
        return { totalAlerts: BigInt(0), totalRecords: BigInt(0) };
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (record: AnimalRecord) => {
      if (!actor) throw new Error("No actor");
      await actor.submitRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useSubmitAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (alert: Alert) => {
      if (!actor) throw new Error("No actor");
      await actor.submitAlert(alert);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
