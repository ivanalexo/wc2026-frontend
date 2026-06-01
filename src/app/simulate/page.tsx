import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { FIFA } from "@/theme/theme";
import { Team, TeamSimulation } from "@/lib/types";
import SimulationClient from "@/components/simulate/SimulationClient";

export const metadata: Metadata = {
  title: "Simulación",
  description: "Probabilidades por ronda para los 48 equipos del Mundial 2026",
};

export interface SimulationRow {
  name: string;
  slug: string;
  group: string | null;
  elo: number;
  p_qualify: number;
  p_reach_r16: number;
  p_reach_qf: number;
  p_reach_sf: number;
  p_reach_final: number;
  p_champion: number;
}

async function getSimulation(): Promise<TeamSimulation[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/simulate/tournament?top=48`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.top_teams ?? [];
  } catch {
    return [];
  }
}

async function getTeams(): Promise<Team[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teams?limit=100`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SimulatePage() {
  const [simulation, teams] = await Promise.all([getSimulation(), getTeams()]);

  // Mapa nombre: { slug, group } del endpoint de teams
  const teamMeta: Record<string, { slug: string; group: string | null }> = {};
  for (const t of teams) {
    teamMeta[t.name] = { slug: t.slug, group: t.group };
  }

  const rows: SimulationRow[] = simulation.map((s) => ({
    name: s.team,
    slug: teamMeta[s.team]?.slug ?? s.team.toLowerCase().replace(/ /g, "-"),
    group: teamMeta[s.team]?.group ?? null,
    elo: s.elo ?? 0,
    p_qualify: s.p_qualify ?? 0,
    p_reach_r16: s.p_reach_r16 ?? 0,
    p_reach_qf: s.p_reach_qf ?? 0,
    p_reach_sf: s.p_reach_sf ?? 0,
    p_reach_final: s.p_reach_final ?? 0,
    p_champion: s.p_champion ?? 0,
  }));

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <QueryStatsIcon sx={{ color: FIFA.red, fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Simulación del torneo
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4, opacity: 0.7 }}
        >
          Resultados de 10,000 simulaciones Monte Carlo · Haz clic en las
          columnas para ordenar · Haz clic en un equipo para ver su perfil
        </Typography>

        <SimulationClient rows={rows} />
      </Container>
    </Box>
  );
}
