import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchBootstrap,
  fetchStepContent,
  fetchTutorRoster,
  joinSession,
  patchMe,
  tutorLogin,
  tutorPointer,
  tutorReset,
  type SessionBootstrap,
} from "../api";
import { readBootstrapCache, writeBootstrapCache } from "../lib/bootstrapCache";
import { queryKeys } from "../lib/queryKeys";

export function useSessionBootstrap(sessionCode: string, token?: string | null) {
  return useQuery({
    queryKey: queryKeys.session(sessionCode, token),
    queryFn: async () => {
      const data = await fetchBootstrap(sessionCode, token ?? undefined);
      writeBootstrapCache(sessionCode, data);
      return data;
    },
    enabled: Boolean(sessionCode),
    placeholderData: () => readBootstrapCache(sessionCode),
    staleTime: 30_000,
  });
}

export function useStepContent(sessionCode: string, order: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.step(sessionCode, order),
    queryFn: () => fetchStepContent(sessionCode, order),
    enabled: enabled && Boolean(sessionCode) && order > 0,
    staleTime: 5 * 60_000,
  });
}

export function usePrefetchStep(sessionCode: string) {
  const qc = useQueryClient();
  return (order: number) => {
    void qc.prefetchQuery({
      queryKey: queryKeys.step(sessionCode, order),
      queryFn: () => fetchStepContent(sessionCode, order),
      staleTime: 5 * 60_000,
    });
  };
}

export function useJoinSession(sessionCode: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => joinSession(sessionCode, name),
    onSuccess: (data) => {
      if (!data.student) return;
      const token = data.student.secretToken;
      qc.setQueryData<SessionBootstrap | undefined>(
        queryKeys.session(sessionCode, token),
        (prev) => (prev ? { ...prev, student: data.student } : prev),
      );
      void qc.invalidateQueries({ queryKey: ["session", sessionCode] });
    },
  });
}

export function usePatchStudent(sessionCode: string, token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof patchMe>[2]) => {
      if (!token) throw new Error("no_token");
      return patchMe(sessionCode, token, body);
    },
    onSuccess: (data) => {
      qc.setQueryData<SessionBootstrap | undefined>(
        queryKeys.session(sessionCode, token),
        (prev) => (prev ? { ...prev, student: data.student } : prev),
      );
    },
  });
}

export function useTutorRoster(sessionCode: string, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.tutorRoster(sessionCode),
    queryFn: () => fetchTutorRoster(sessionCode),
    enabled: enabled && Boolean(sessionCode),
    staleTime: 5_000,
  });
}

export function useTutorLogin(sessionCode: string) {
  return useMutation({
    mutationFn: (password: string) => tutorLogin(sessionCode, password),
  });
}

export function useTutorPointer(sessionCode: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof tutorPointer>[1]) => tutorPointer(sessionCode, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.tutorRoster(sessionCode) });
    },
  });
}

export function useTutorReset(sessionCode: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => tutorReset(sessionCode),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.tutorRoster(sessionCode) });
    },
  });
}
