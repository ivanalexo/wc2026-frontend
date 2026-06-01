import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import GroupsIcon from "@mui/icons-material/Groups";
import { FIFA } from "@/theme/theme";
import { Team, TeamSimulation } from "@/lib/types";
import TeamCard from "@/components/teams/TeamCard";

export const metadata: Metadata = {
  title: "Equipos",
  description: "Las 48 selecciones del Mundial FIFA 2026",
};

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

export default async function TeamsPage() {
  const [teams, simulation] = await Promise.all([getTeams(), getSimulation()]);

  const champMap: Record<string, number> = {};
  const eloMap: Record<string, number> = {};
  for (const s of simulation) {
    champMap[s.team] = s.p_champion;
    eloMap[s.team] = s.elo;
  }

  const sorted = [...teams].sort(
    (a, b) => (champMap[b.name] ?? 0) - (champMap[a.name] ?? 0),
  );

  const byGroup: Record<string, typeof sorted> = {};
  for (const team of sorted) {
    const g = team.group ?? "Sin grupo";
    if (!byGroup[g]) byGroup[g] = [];
    byGroup[g].push(team);
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <GroupsIcon sx={{ color: FIFA.red, fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Selecciones
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {teams.length} equipos · ordenados por probabilidad de campeón
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4, opacity: 0.6 }}
        >
          Haz clic en un equipo para ver su perfil, probabilidades por ronda y
          partidos del grupo
        </Typography>

        {teams.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <GroupsIcon
              sx={{ fontSize: 56, color: "rgba(255,255,255,0.1)", mb: 2 }}
            />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400 }}
            >
              No hay equipos en la base de datos
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, opacity: 0.5 }}
            >
              Corre el seeder: <code>python seed.py</code>
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {sorted.map((team, idx) => (
              <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={team.id}>
                <TeamCard
                  name={team.name}
                  slug={team.slug}
                  group={team.group}
                  elo={eloMap[team.name] ?? team.elo_rating}
                  pChampion={champMap[team.name] ?? null}
                  rank={idx + 1}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
