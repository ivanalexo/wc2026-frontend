import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { FIFA } from "@/theme/theme";
import { Match } from "@/lib/types";
import BracketClient from "@/components/bracket/BracketClient";

export const metadata: Metadata = {
  title: "Llave",
  description: "Cuadro de eliminatorias del Mundial FIFA 2026, de la ronda de 32 a la final",
};

async function getBracket(): Promise<Match[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/bracket`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BracketPage() {
  const matches = await getBracket();

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5 }}>
          <AccountTreeIcon sx={{ color: FIFA.red, fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Llave del Mundial
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            Ronda de 32 → Final
          </Typography>
        </Box>

        {matches.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              El cuadro de eliminatorias aún no está disponible
            </Typography>
          </Box>
        ) : (
          <BracketClient matches={matches} />
        )}
      </Container>
    </Box>
  );
}
