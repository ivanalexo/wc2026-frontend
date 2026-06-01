import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FIFA } from "@/theme/theme";
import PredictForm from "@/components/predict/PredictForm";

export const metadata: Metadata = {
  title: "Predictor",
  description: "Predice el resultado de cualquier partido del Mundial 2026",
};

async function getTeamNames(): Promise<string[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/teams?limit=100`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const teams: { name: string }[] = await res.json();
    return teams.map((t) => t.name).sort();
  } catch {
    return [];
  }
}

export default async function PredictPage() {
  const teamNames = await getTeamNames();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        background: `
          radial-gradient(ellipse 60% 50% at 50% 0%,
            ${FIFA.navy}20 0%, transparent 65%
          ), #EEF0F8
        `,
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="overline"
            sx={{ color: FIFA.royalBlue, letterSpacing: "0.25em", fontWeight: 700, fontSize: "0.7rem" }}
          >
            Machine Learning · XGBoost
          </Typography>
          <Typography
            variant="h3"
            sx={{ mt: 1, letterSpacing: "-0.02em", fontWeight: 900 }}
          >
            Predictor de partidos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Selecciona dos selecciones y obtén las probabilidades del modelo
          </Typography>
        </Box>

        <PredictForm initialTeams={teamNames} />
      </Container>
    </Box>
  );
}