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

type PhaseKey = "all" | "groups" | "r32" | "r16" | "qf" | "sf" | "final";

const PHASES: { key: PhaseKey; label: string; stages: string[] | null }[] = [
  { key: "all",    label: "Todos",   stages: null },
  { key: "groups", label: "Grupos",  stages: ["Group Stage"] },
  { key: "r32",    label: "32avos",  stages: ["Round of 32"] },
  { key: "r16",    label: "Octavos", stages: ["Round of 16"] },
  { key: "qf",     label: "Cuartos", stages: ["Quarter-finals"] },
  { key: "sf",     label: "Semis",   stages: ["Semi-finals"] },
  { key: "final",  label: "Final",   stages: ["Final", "3rd Place"] },
];

function currentPhase(fixtures: Match[]): PhaseKey {
  for (const p of PHASES) {
    if (!p.stages) continue; // saltar "Todos"
    const inPhase = fixtures.filter((m) => m.stage && p.stages!.includes(m.stage));
    if (inPhase.length > 0 && !inPhase.every((m) => m.status === "finished")) {
      return p.key;
    }
  }
  return "final";
}

interface FixturesClientProps {
  fixtures: Match[];
}

export default function FixturesClient({ fixtures }: FixturesClientProps) {
  // Por defecto el pill activo es la ronda en curso (no "Todos").
  const [phase, setPhase] = useState<PhaseKey>(() => currentPhase(fixtures));
  const [group, setGroup] = useState<string | null>(null);

  const phaseDef = PHASES.find((p) => p.key === phase)!;

  const phaseCounts = useMemo(() => {
    const counts: Record<PhaseKey, number> = {
      all: fixtures.length, groups: 0, r32: 0, r16: 0, qf: 0, sf: 0, final: 0,
    };
    for (const m of fixtures) {
      for (const p of PHASES) {
        if (p.stages && m.stage && p.stages.includes(m.stage)) counts[p.key]++;
      }
    }
    return counts;
  }, [fixtures]);

  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of fixtures) {
      if (m.group) counts[m.group] = (counts[m.group] ?? 0) + 1;
    }
    return counts;
  }, [fixtures]);

  const filtered = useMemo(() => {
    let list = fixtures;
    if (phaseDef.stages) {
      list = list.filter((m) => m.stage && phaseDef.stages!.includes(m.stage));
    }
    if (phase === "groups" && group) {
      list = list.filter((m) => m.group === group);
    }
    return list;
  }, [fixtures, phase, group, phaseDef]);

  const selectPhase = (key: PhaseKey) => {
    setPhase(key);
    if (key !== "groups") setGroup(null);
  };

  const pillSx = (active: boolean) => ({
    minWidth: 44,
    height: 34,
    fontWeight: 700,
    fontSize: "0.72rem",
    letterSpacing: "0.06em",
    borderRadius: 1,
    border: "1px solid",
    borderColor: active ? FIFA.red : "rgba(0,0,0,0.18)",
    color: active ? FIFA.red : "text.secondary",
    backgroundColor: active ? "rgba(230,0,0,0.06)" : "transparent",
    "&:hover": {
      borderColor: FIFA.red,
      color: FIFA.red,
      backgroundColor: "rgba(230,0,0,0.05)",
    },
    transition: "all 0.15s",
  });

  const countSx = { ml: 0.5, fontSize: "0.6rem", opacity: 0.6, fontWeight: 400 };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 0.75,
          flexWrap: "wrap",
          alignItems: "center",
          mb: phase === "groups" ? 2 : 4,
          pb: phase === "groups" ? 0 : 3,
          borderBottom: phase === "groups" ? "none" : "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {PHASES.map((p) => (
          <Button key={p.key} onClick={() => selectPhase(p.key)} sx={pillSx(phase === p.key)}>
            {p.label}
            <Box component="span" sx={countSx}>({phaseCounts[p.key]})</Box>
          </Button>
        ))}
      </Box>

      {phase === "groups" && (
        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            flexWrap: "wrap",
            alignItems: "center",
            mb: 4,
            pb: 3,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Button onClick={() => setGroup(null)} sx={pillSx(group === null)}>
            Todos
          </Button>
          <Box sx={{ width: 1, height: 22, backgroundColor: "rgba(0,0,0,0.12)", mx: 0.25 }} />
          {GROUPS.map((g) => (
            <Button key={g} onClick={() => setGroup(g)} sx={pillSx(group === g)}>
              {g}
              {groupCounts[g] !== undefined && (
                <Box component="span" sx={countSx}>({groupCounts[g]})</Box>
              )}
            </Button>
          ))}
        </Box>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Mostrando {filtered.length} partidos — Haz clic en un partido (con equipos definidos) para ver detalles y predicciones
      </Typography>

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10 }}>
          <SportsSoccerIcon sx={{ fontSize: 56, color: "rgba(0,0,0,0.12)", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            No hay partidos para este filtro
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
