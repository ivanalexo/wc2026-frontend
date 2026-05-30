import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { FIFA } from "@/theme/theme";
import { Match } from "@/lib/types";
import FixturesClient from "@/components/fixtures/FixtureClient";

export const metadata: Metadata = {
  title: "Partidos",
  description: "Calendario completo del Mundial FIFA 2026 con predicciones",
};

async function getAllFixtures(): Promise<Match[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fixtures?limit=72`,
      // No cacheamos — necesitamos datos frescos para que las predicciones aparezcan
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function FixturesPage() {
  const fixtures = await getAllFixtures();

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5 }}>
          <CalendarMonthIcon sx={{ color: FIFA.red, fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Calendario del Mundial
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {fixtures.length} partidos · Fase de grupos
          </Typography>
        </Box>

        {/* Todo el filtrado y la grilla son Client-side */}
        <FixturesClient fixtures={fixtures} />

      </Container>
    </Box>
  );
}