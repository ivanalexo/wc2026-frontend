import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { FIFA } from "@/theme/theme";
import { Match } from "@/lib/types";
import ProbabilityBar from "@/components/shared/ProbabilityBar";
import MatchScorePredictor from "@/components/fixtures/Matchscorepredictor";
import LinkButton from "@/components/shared/LinkButton";
import Image from "next/image";
import { getFlagUrl } from "@/lib/flagCodes";

async function getFixture(id: string): Promise<Match | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fixtures/${id}`,
      { cache: "no-store" },
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const match = await getFixture(params.id);
  if (!match) return { title: "Partido no encontrado" };
  return {
    title: `${match.home_team} vs ${match.away_team}`,
    description: `Predicción para el partido ${match.home_team} vs ${match.away_team} del Mundial 2026`,
  };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    full: d.toLocaleDateString("es", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
  };
}

function outcomeColor(pred: "H" | "D" | "A") {
  return pred === "H"
    ? FIFA.red
    : pred === "A"
      ? FIFA.royalBlue
      : "#5A5E7A";
}

export default async function FixtureDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const match = await getFixture(id);
  if (!match) notFound();

  const { full, time } = formatDate(match.date);
  const hasScore = match.home_score !== null && match.away_score !== null;

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Box
          component={LinkButton}
          href="/fixtures"
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
          Volver a partidos
        </Box>

        <Card
          sx={{
            borderTop: `3px solid ${FIFA.red}`,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
              {match.group && (
                <Chip
                  label={`Grupo ${match.group}`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(51,51,204,0.1)",
                    color: FIFA.royalBlue,
                    fontWeight: 700,
                    fontSize: "0.7rem",
                  }}
                />
              )}
              {match.stage && (
                <Chip
                  label={match.stage}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(0,0,0,0.05)",
                    color: "text.secondary",
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Box>

            <Grid container spacing={2} sx={{ mb: 3, alignItems: "center" }}>
              <Grid size={{ xs: 5 }} sx={{ textAlign: "center" }}>
                <Image
                  src={getFlagUrl(match.home_team, 80) as string}
                  alt={match.home_team}
                  width={50}
                  height={25}
                />
                <Typography
                  variant="h4"
                  sx={{
                    color:
                      match.prediction?.prediction === "H"
                        ? FIFA.red
                        : "text.primary",
                    lineHeight: 1.2,
                    fontWeight: 900,
                  }}
                >
                  {match.home_team}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Local
                </Typography>
              </Grid>

              <Grid size={{ xs: 2 }} sx={{ textAlign: "center" }}>
                {hasScore ? (
                  <Typography variant="h3" sx={{ fontWeight: 900 }}>
                    {match.home_score} – {match.away_score}
                  </Typography>
                ) : (
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    VS
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 5 }} sx={{ textAlign: "center" }}>
                <Image
                  src={getFlagUrl(match.away_team, 80) as string}
                  alt={match.away_team}
                  width={50}
                  height={25}
                />
                <Typography
                  variant="h4"
                  sx={{
                    color:
                      match.prediction?.prediction === "A"
                        ? FIFA.royalBlue
                        : "text.primary",
                    lineHeight: 1.2,
                    fontWeight: 900,
                  }}
                >
                  {match.away_team}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Visitante
                </Typography>
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarTodayIcon
                  sx={{ fontSize: 14, color: "text.secondary" }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {full} · {time}
                </Typography>
              </Box>
              {match.city && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocationOnIcon
                    sx={{ fontSize: 14, color: "text.secondary" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {match.city}
                    {match.country ? `, ${match.country}` : ""}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {match.prediction && !hasScore && (
          <Card
            sx={{
              mb: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}
              >
                <TrendingUpIcon sx={{ color: FIFA.royalBlue, fontSize: 20 }} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.75rem",
                  }}
                >
                  Predicción del modelo
                </Typography>
                <Chip
                  label={match.prediction.prediction_label}
                  size="small"
                  sx={{
                    ml: "auto",
                    backgroundColor: `${outcomeColor(match.prediction.prediction)}22`,
                    color: outcomeColor(match.prediction.prediction),
                    border: `1px solid ${outcomeColor(match.prediction.prediction)}55`,
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                />
              </Box>

              <ProbabilityBar
                pHome={match.prediction.p_home_win}
                pDraw={match.prediction.p_draw}
                pAway={match.prediction.p_away_win}
                homeLabel={match.home_team}
                awayLabel={match.away_team}
                height={10}
              />
            </CardContent>
          </Card>
        )}

        {!hasScore && (
          <MatchScorePredictor
            homeTeam={match.home_team}
            awayTeam={match.away_team}
          />
        )}
      </Container>
    </Box>
  );
}
