import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import { FIFA } from "@/theme/theme";
import { Team, TeamSimulation, Match, Player } from "@/lib/types";
import { getFlagUrl } from "@/lib/flagCodes";
import ProbabilityBar from "@/components/shared/ProbabilityBar";
import Squad from "@/components/teams/Squad";
import LinkButton from "@/components/shared/LinkButton";
import Image from "next/image";

async function getTeam(slug: string): Promise<Team | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teams/${slug}`,
      { cache: "no-store" },
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getTeamSimulation(
  teamName: string,
): Promise<TeamSimulation | null> {
  try {
    const encoded = encodeURIComponent(teamName);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/simulate/tournament/${encoded}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.probabilities ?? null;
  } catch {
    return null;
  }
}

async function getSquad(teamName: string): Promise<Player[]> {
  try {
    const encoded = encodeURIComponent(teamName);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/players/${encoded}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getTeamFixtures(teamName: string): Promise<Match[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fixtures?limit=72`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const all: Match[] = await res.json();
    return all.filter(
      (m) => m.home_team === teamName || m.away_team === teamName,
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeam(slug);
  if (!team) return { title: "Equipo no encontrado" };
  return {
    title: team.name,
    description: `Perfil y predicciones de ${team.name} en el Mundial 2026`,
  };
}

const ROUNDS = [
  { key: "p_qualify", label: "Clasifica de fase de grupos" },
  { key: "p_reach_r16", label: "Round of 32" },
  { key: "p_reach_qf", label: "Cuartos de final" },
  { key: "p_reach_sf", label: "Semifinales" },
  { key: "p_reach_final", label: "Final" },
  { key: "p_champion", label: "Campeón" },
] as const;

export default async function TeamDetailPage({
  params,
}: {
  params: { slug: string };
}) {
    const { slug } = await params;
  const team = await getTeam(slug);
  if (!team) notFound();

  const [simulation, fixtures, squad] = await Promise.all([
    getTeamSimulation(team.name),
    getTeamFixtures(team.name),
    getSquad(team.name),
  ]);

  const flagUrl = getFlagUrl(team.name, 160);

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Box
          component={LinkButton}
          href="/teams"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
            textDecoration: "none",
            mb: 3,
            fontSize: "0.85rem",
            "&:hover": { color: "text.primary" },
            transition: "color 0.2s",
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Volver a equipos
        </Box>

        <Card
          sx={{
            borderTop: `3px solid ${FIFA.red}`,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              {flagUrl ? (
                <Image
                  src={flagUrl}
                  alt={`Bandera de ${team.name}`}
                  width={100}
                  height={67}
                  style={{
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.12)",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 100,
                    height: 67,
                    borderRadius: 1.5,
                    backgroundColor: "rgba(0,0,0,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="h5" color="text.secondary">
                    {team.name.slice(0, 2).toUpperCase()}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 900 }}>
                  {team.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {team.group && (
                    <Chip
                      label={`Grupo ${team.group}`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(51,51,204,0.1)",
                        color: FIFA.royalBlue,
                        border: `1px solid ${FIFA.royalBlue}44`,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                      }}
                    />
                  )}
                  {team.confederation && (
                    <Chip
                      label={team.confederation}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(0,0,0,0.05)",
                        color: "text.secondary",
                        fontSize: "0.7rem",
                      }}
                    />
                  )}
                  {team.elo_rating && (
                    <Chip
                      label={`ELO ${team.elo_rating}`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(68,170,255,0.1)",
                        color: FIFA.skyBlue,
                        border: `1px solid ${FIFA.skyBlue}33`,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {simulation && (
          <Card
            sx={{ mb: 3 }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                variant="subtitle2"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.75rem",
                  mb: 2.5,
                  fontWeight: 700,
                }}
              >
                Probabilidades por ronda · se aplicó Monte Carlo (10k simulaciones)
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {ROUNDS.map(({ key, label }) => {
                  const val = (simulation as unknown as Record<string, number>)[key] ?? 0;
                  const pct = (val * 100).toFixed(1);
                  const isChamp = key === "p_champion";

                  return (
                    <Box key={key}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color={isChamp ? "text.primary" : "text.secondary"}
                          sx={{ fontWeight: isChamp ? 700 : 400 }}
                        >
                          {label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: isChamp ? "#009933" : "text.primary",
                            fontWeight: 800,
                          }}
                        >
                          {pct}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={val * 100}
                        sx={{
                          height: isChamp ? 8 : 5,
                          borderRadius: 2,
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: isChamp
                              ? "#009933"
                              : FIFA.royalBlue,
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        )}

        {fixtures.length > 0 && (
          <Card
            sx={{ mb: 3 }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                variant="subtitle2"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.75rem",
                  mb: 2,
                  fontWeight: 700,
                }}
              >
                Partidos del grupo
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {fixtures
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime(),
                  )
                  .map((match) => {
                    const isHome = match.home_team === team.name;
                    const rival = isHome ? match.away_team : match.home_team;
                    const dateStr = new Date(match.date).toLocaleDateString(
                      "es",
                      { day: "2-digit", month: "short" },
                    );

                    return (
                      <Box
                        key={match.id}
                        component={LinkButton}
                        href={`/fixtures/${match.id}`}
                        sx={{
                          display: "block",
                          textDecoration: "none",
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid rgba(0,0,0,0.07)",
                          backgroundColor: "background.paper",
                          "&:hover": { borderColor: "rgba(230,0,0,0.3)" },
                          transition: "border-color 0.15s",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: match.prediction ? 0.75 : 0,
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {isHome
                              ? `${team.name} vs ${rival}`
                              : `${rival} vs ${team.name}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dateStr}
                          </Typography>
                        </Box>

                        {match.prediction && (
                          <ProbabilityBar
                            pHome={match.prediction.p_home_win}
                            pDraw={match.prediction.p_draw}
                            pAway={match.prediction.p_away_win}
                            homeLabel={match.home_team}
                            awayLabel={match.away_team}
                            height={5}
                            showLabels={false}
                          />
                        )}
                      </Box>
                    );
                  })}
              </Box>
            </CardContent>
          </Card>
        )}

        {squad.length > 0 ? (
          <Squad players={squad} />
        ) : (
          <Card
            sx={{
              border: "1px dashed rgba(0,0,0,0.15)",
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 }, textAlign: "center" }}>
              <PeopleIcon
                sx={{ fontSize: 40, color: "rgba(0,0,0,0.2)", mb: 1 }}
              />
              <Typography
                variant="body1"
                sx={{ fontWeight: 600 }}
                color="text.secondary"
              >
                Plantilla convocada
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, opacity: 0.5 }}
              >
                Próximamente...
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
