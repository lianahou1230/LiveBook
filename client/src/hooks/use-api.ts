import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Show, CreateShow, UpdateShow, Journal, CreateJournal, UpdateJournal, Photo, CreatePhoto, Stats, CountdownItem, CalendarDay } from "@shared/schema";

const API_BASE = "/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

// Shows
export function useShows(upcoming?: boolean) {
  const params = upcoming !== undefined ? `?upcoming=${upcoming}` : "";
  return useQuery({
    queryKey: ["shows", upcoming],
    queryFn: () => fetchJson<Show[]>(`${API_BASE}/shows${params}`),
  });
}

export function useShow(id: number) {
  return useQuery({
    queryKey: ["shows", id],
    queryFn: () => fetchJson<Show>(`${API_BASE}/shows/${id}`),
    enabled: !!id,
  });
}

export function useCreateShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateShow) =>
      fetchJson<Show>(`${API_BASE}/shows`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shows"] });
      qc.invalidateQueries({ queryKey: ["countdown"] });
    },
  });
}

export function useUpdateShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateShow }) =>
      fetchJson<Show>(`${API_BASE}/shows/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shows"] });
      qc.invalidateQueries({ queryKey: ["countdown"] });
    },
  });
}

export function useDeleteShow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchJson<{ success: boolean }>(`${API_BASE}/shows/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["shows"] });
      qc.invalidateQueries({ queryKey: ["countdown"] });
    },
  });
}

// Journals
export function useJournals(showId?: number) {
  const params = showId !== undefined ? `?showId=${showId}` : "";
  return useQuery({
    queryKey: ["journals", showId],
    queryFn: () => fetchJson<Journal[]>(`${API_BASE}/journals${params}`),
  });
}

export function useJournal(id: number) {
  return useQuery({
    queryKey: ["journals", id],
    queryFn: () => fetchJson<Journal>(`${API_BASE}/journals/${id}`),
    enabled: !!id,
  });
}

export function useCreateJournal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJournal) =>
      fetchJson<Journal>(`${API_BASE}/journals`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journals"] }),
  });
}

export function useUpdateJournal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateJournal }) =>
      fetchJson<Journal>(`${API_BASE}/journals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journals"] }),
  });
}

export function useDeleteJournal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchJson<{ success: boolean }>(`${API_BASE}/journals/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journals"] }),
  });
}

// Photos
export function usePhotos(showId?: number, journalId?: number) {
  const params = new URLSearchParams();
  if (showId !== undefined) params.set("showId", String(showId));
  if (journalId !== undefined) params.set("journalId", String(journalId));
  const qs = params.toString();
  return useQuery({
    queryKey: ["photos", showId, journalId],
    queryFn: () => fetchJson<Photo[]>(`${API_BASE}/photos${qs ? `?${qs}` : ""}`),
  });
}

export function useCreatePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePhoto) =>
      fetchJson<Photo>(`${API_BASE}/photos`, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });
}

export function useDeletePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchJson<{ success: boolean }>(`${API_BASE}/photos/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
  });
}

// Stats
export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: () => fetchJson<Stats>(`${API_BASE}/stats`),
  });
}

export function useCountdown() {
  return useQuery({
    queryKey: ["countdown"],
    queryFn: () => fetchJson<CountdownItem[]>(`${API_BASE}/stats/countdown`),
  });
}

export function useCalendar(year: number, month: number) {
  return useQuery({
    queryKey: ["calendar", year, month],
    queryFn: () => fetchJson<CalendarDay[]>(`${API_BASE}/stats/calendar?year=${year}&month=${month}`),
  });
}
