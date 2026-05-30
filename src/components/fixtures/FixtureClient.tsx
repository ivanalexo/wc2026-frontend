"use client";

import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { FIFA } from "@/theme/theme";
import { Match } from "@/lib/types";
import MatchCard from "@/components/match/MatchCard";

const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"] as const;

interface FixturesClientProps {
  fixtures: Match[];
}

export default function FixturesClient({ fixtures }: FixturesClientProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Conteo por grupo para los badges
  const matchCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of fixtures) {
      if (m.group) counts[m.group] = (counts[m.group] ?? 0) + 1;
    }
    return counts;
  }, [fixtures]);

  // Filtrado instantáneo en memoria
  const filtered = useMemo(
    () =>
      selectedGroup
        ? fixtures.filter((m) => m.group === selectedGroup)
        : fixtures,
    [fixtures, selectedGroup]
  );

  const btnSx = (active: boolean) => ({
    minWidth: 44,
    height: 34,
    fontWeight: 700,
    fontSize: "0.72rem",
    letterSpacing: "0.06em",
    borderRadius: 1,
    border: "1px solid",
    borderColor: active ? FIFA.lime : "rgba(255,255,255,0.1)",
    color: active ? FIFA.lime : "rgba(255,255,255,0.45)",
    backgroundColor: active ? "rgba(204,255,0,0.08)" : "transparent",
    "&:hover": {
      borderColor: FIFA.lime,
      color: FIFA.lime,
      backgroundColor: "rgba(204,255,0,0.06)",
    },
    transition: "all 0.15s",
  });

  return (
    <Box>
      {/* Barra de filtros */}
      <Box
        sx={{
          display: "flex",
          gap: 0.75,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 4,
          pb: 3,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Button
          onClick={() => setSelectedGroup(null)}
          sx={btnSx(selectedGroup === null)}
        >
          Todos
          <Box component="span" sx={{ ml: 0.5, fontSize: "0.6rem", opacity: 0.6, fontWeight: 400 }}>
            ({fixtures.length})
          </Box>
        </Button>

        <Box sx={{ width: 1, height: 22, backgroundColor: "rgba(255,255,255,0.1)", mx: 0.25 }} />

        {GROUPS.map((g) => (
          <Button
            key={g}
            onClick={() => setSelectedGroup(g)}
            sx={btnSx(selectedGroup === g)}
          >
            {g}
            {matchCounts[g] !== undefined && (
              <Box component="span" sx={{ ml: 0.5, fontSize: "0.6rem", opacity: 0.6, fontWeight: 400 }}>
                ({matchCounts[g]})
              </Box>
            )}
          </Button>
        ))}
      </Box>

      {/* Subtítulo dinámico */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {selectedGroup
          ? `Grupo ${selectedGroup} — ${filtered.length} partidos`
          : `Mostrando ${filtered.length} partidos`}
      </Typography>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <SportsSoccerIcon sx={{ fontSize: 56, color: "rgba(255,255,255,0.1)", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            No hay partidos para el Grupo {selectedGroup}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, opacity: 0.5 }}>
            Verifica que el seeder asignó grupos correctamente
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((match) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={match.id}>
              <MatchCard match={match} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}