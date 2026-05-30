import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

export default api;

// =============================================================================
// Endpoints tipados
// =============================================================================

export const endpoints = {
  health:          "/api/v1/health",
  teams:           "/api/v1/teams",
  team:            (slug: string) => `/api/v1/teams/${slug}`,
  squad:           (slug: string) => `/api/v1/teams/${slug}/squad`,
  fixtures:        "/api/v1/fixtures",
  fixture:         (id: number) => `/api/v1/fixtures/${id}`,
  groups:          "/api/v1/groups",
  predictMatch:    "/api/v1/predict/match",
  predictScore:    "/api/v1/predict/score",
  h2h:             (t1: string, t2: string) => `/api/v1/stats/h2h/${t1}/${t2}`,
  simulate:        "/api/v1/simulate/tournament",
  simulateTeam:    (team: string) => `/api/v1/simulate/tournament/${team}`,
} as const;