import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { FIFA } from "@/theme/theme";
import { GroupsResponse } from "@/lib/types";
import GroupsClient from "@/components/groups/GroupsClient";

export const metadata: Metadata = {
  title: "Grupos",
  description: "Fase de grupos del Mundial FIFA 2026 con posiciones predichas",
};

async function getGroups(): Promise<GroupsResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function GroupsPage() {
  const data   = await getGroups();
  const groups = data?.groups ?? {};

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5 }}>
          <EmojiEventsIcon sx={{ color: FIFA.yellow, fontSize: 28 }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Fase de grupos
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            Posiciones predichas por el modelo
          </Typography>
        </Box>

        {Object.keys(groups).length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <EmojiEventsIcon sx={{ fontSize: 56, color: "rgba(0,0,0,0.12)", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              No hay datos de grupos disponibles
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, opacity: 0.5 }}>
              Asegúrate de haber corrido el seeder con grupos asignados
            </Typography>
          </Box>
        ) : (
          <GroupsClient groups={groups} />
        )}

      </Container>
    </Box>
  );
}