import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { FIFA } from "@/theme/theme";
import { Match, TeamSimulation } from "@/lib/types";
import MatchCard from "@/components/match/MatchCard";
import LinkButton from "@/components/shared/LinkButton"
import DownloadCalendarButton from "@/components/home/DownloadCalendarButton";

async function getTopFavorites(): Promise<TeamSimulation[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/simulate/tournament?top=8`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.top_teams ?? [];
  } catch {
    return [];
  }
}

async function getFeaturedFixtures(): Promise<Match[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fixtures?upcoming=true&limit=6`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const ACCENT_COLORS = [
  FIFA.red, FIFA.royalBlue, FIFA.green, FIFA.orange,
  FIFA.hotPink, FIFA.skyBlue, FIFA.lime, FIFA.turquoise,
];

export default async function Home() {
  const [favorites, fixtures] = await Promise.all([
    getTopFavorites(),
    getFeaturedFixtures(),
  ]);

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 480, md: 560 },
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background: `
            radial-gradient(ellipse 80% 60% at 50% 0%, ${FIFA.navy}25 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 80% 100%, ${FIFA.burgundy}18 0%, transparent 60%),
            #EEF0F8
          `,
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `repeating-linear-gradient(
              -45deg, transparent, transparent 40px,
              rgba(0,0,0,0.02) 40px, rgba(0,0,0,0.02) 41px
            )`,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: { xs: 6, md: 8 } }}>
          <Box sx={{ maxWidth: 680 }}>

            <Typography
              variant="overline"
              sx={{ color: FIFA.royalBlue, letterSpacing: "0.25em", fontWeight: 700, fontSize: "0.7rem", display: "block", mb: 2 }}
            >
              USA · CANADA · MÉXICO · JUNIO 2026
            </Typography>

            <Typography
              variant="h1"
              sx={{ fontSize: { xs: "2.8rem", sm: "3.8rem", md: "5rem" }, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", mb: 1 }}
            >
              PREDICCIÓN MUNDIAL
            </Typography>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.8rem", sm: "3.8rem", md: "5rem" }, fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.03em", mb: 3,
                background: `linear-gradient(90deg, ${FIFA.red} 0%, ${FIFA.hotPink} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              FIFA 2026
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 4, maxWidth: 480, lineHeight: 1.6 }}>
              Predicciones con Machine Learning
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <LinkButton
                href="/predict"
                variant="contained" color="primary" size="large"
                startIcon={<SportsSoccerIcon />}
                sx={{ fontWeight: 700, px: 3 }}
              >
                Predecir partido
              </LinkButton>
              <LinkButton
                href="/fixtures"
                variant="outlined" color="secondary" size="large"
                sx={{ fontWeight: 600, px: 3 }}
              >
                Ver partidos
              </LinkButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {favorites.length > 0 && (
        <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: "background.default" }}>
          <Container maxWidth="lg">

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 10 }}>
              <EmojiEventsIcon sx={{ color: FIFA.yellow, fontSize: 28 }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>Candidatos al título</Typography>
              <Typography variant="caption" sx={{ ml: "auto", color: "text.secondary", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.7rem" }}>
                Probabilidad basada en Monte Carlo
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {favorites.map((team, idx) => {
                const accent   = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                const champPct = ((team.p_champion ?? 0) * 100).toFixed(1);
                const qualifyPct = ((team.p_qualify ?? 0) * 100).toFixed(0);

                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}  key={team.team}>
                    <Card
                      sx={{
                        height: "100%",
                        borderTop: `3px solid ${accent}`,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": { transform: "translateY(-3px)", boxShadow: `0 8px 24px ${accent}22` },
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}>
                          <Typography variant="h4" sx={{ color: accent, lineHeight: 1, minWidth: 32, fontWeight: 900 }}>
                            {idx + 1}
                          </Typography>
                          <Typography variant="body1" sx={{ lineHeight: 1.2, fontWeight: 700 }}>
                            {team.team}
                          </Typography>
                        </Box>

                        <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 900 }}>
                          {champPct}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                          Probabilidad campeón
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={(team.p_champion ?? 0) * 100}
                          sx={{ mb: 2, "& .MuiLinearProgress-bar": { backgroundColor: accent } }}
                        />

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Clasifica</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{qualifyPct}%</Typography>
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography variant="caption" color="text.secondary">ELO</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{Math.round(team.elo).toLocaleString('en-US') ?? "—"}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <LinkButton href="/simulate" variant="text" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
                Ver simulación completa
              </LinkButton>
            </Box>
          </Container>
        </Box>
      )}

      {fixtures.length > 0 && (
        <Box sx={{ py: { xs: 6, md: 8 } }}>
          <Container maxWidth="lg">

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
              <SportsSoccerIcon sx={{ color: FIFA.red, fontSize: 28 }} />
              <Typography variant="h4" sx={{ fontWeight: 800 }}>Próximos partidos</Typography>
              <LinkButton href="/fixtures" variant="text" size="small" sx={{ ml: "auto", color: "text.secondary", fontSize: "0.8rem" }}>
                Ver todos
              </LinkButton>
            </Box>

            <Grid container spacing={2}>
              {fixtures.map((match) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={match.id}>
                  <MatchCard match={match} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background: `linear-gradient(135deg, ${FIFA.navy}18 0%, ${FIFA.burgundy}10 100%)`,
          borderTop: "1px solid rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <AutoGraphIcon sx={{ fontSize: 48, color: FIFA.royalBlue, mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5 }} component='h3'>
            ¿Quién gana el próximo partido?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 4, maxWidth: 480, mx: "auto" }}>
            Elige dos selecciones y el modelo predice el resultado
            con probabilidades y explicación en lenguaje natural.
          </Typography>
          <LinkButton
            href="/predict"
            variant="contained" color="primary" size="large"
            startIcon={<SportsSoccerIcon />}
            sx={{ fontWeight: 700, px: 5, py: 1.5, fontSize: "1rem" }}
          >
            Abrir predictor
          </LinkButton>
        </Container>
      </Box>

      <DownloadCalendarButton />

    </Box>
  );
}