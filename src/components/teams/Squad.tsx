"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import { FIFA } from "@/theme/theme";
import { Player } from "@/lib/types";

interface SquadProps {
  players: Player[];
}

const CATEGORIES: { id: string; label: string; keys: string[] }[] = [
  { id: "gk", label: "Porteros", keys: ["goalkeeper", "portero", "arquero", "gk", "por"] },
  { id: "df", label: "Defensas", keys: ["defender", "defensa", "defence", "df", "def"] },
  {
    id: "mf",
    label: "Mediocampistas",
    keys: ["midfielder", "mediocampista", "medio", "mf", "med", "cc"],
  },
  {
    id: "fw",
    label: "Delanteros",
    keys: ["forward", "delantero", "attacker", "fw", "del", "dc"],
  },
];

const OTHER_ID = "other";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function categoryId(position: string | null): string {
  if (!position) return OTHER_ID;
  const p = normalize(position);
  const cat = CATEGORIES.find((c) => c.keys.some((k) => p.includes(k)));
  return cat?.id ?? OTHER_ID;
}

function categoryRank(id: string): number {
  const idx = CATEGORIES.findIndex((c) => c.id === id);
  return idx === -1 ? CATEGORIES.length : idx;
}

export default function Squad({ players }: SquadProps) {
  const [filter, setFilter] = useState<string>("all");

  const tagged = useMemo(
    () => players.map((p) => ({ player: p, cat: categoryId(p.position) })),
    [players],
  );

  const pills = useMemo(() => {
    const counts = new Map<string, number>();
    for (const { cat } of tagged) counts.set(cat, (counts.get(cat) ?? 0) + 1);

    const present = [...CATEGORIES, { id: OTHER_ID, label: "Otros", keys: [] }]
      .filter((c) => counts.has(c.id))
      .map((c) => ({ id: c.id, label: c.label, count: counts.get(c.id)! }));

    return [{ id: "all", label: "Todos", count: players.length }, ...present];
  }, [tagged, players.length]);

  const visible = useMemo(() => {
    const list =
      filter === "all" ? tagged : tagged.filter((t) => t.cat === filter);
    return list
      .map((t) => t.player)
      .sort(
        (a, b) =>
          categoryRank(categoryId(a.position)) -
            categoryRank(categoryId(b.position)) ||
          (a.number ?? 99) - (b.number ?? 99) ||
          a.name.localeCompare(b.name),
      );
  }, [tagged, filter]);

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Typography
          variant="subtitle2"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: "0.75rem",
            fontWeight: 700,
            mb: 2,
          }}
        >
          Plantilla convocada
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2.5 }}>
          {pills.map((pill) => {
            const active = filter === pill.id;
            return (
              <Chip
                key={pill.id}
                label={`${pill.label} · ${pill.count}`}
                onClick={() => setFilter(pill.id)}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  backgroundColor: active ? FIFA.red : "rgba(0,0,0,0.05)",
                  color: active ? "#fff" : "text.secondary",
                  border: active
                    ? `1px solid ${FIFA.red}`
                    : "1px solid rgba(0,0,0,0.08)",
                  "&:hover": {
                    backgroundColor: active ? FIFA.red : "rgba(230,0,0,0.08)",
                  },
                  transition: "background-color 0.15s, color 0.15s",
                }}
              />
            );
          })}
        </Box>

        <Grid container spacing={1.5}>
          {visible.map((player) => (
            <Grid size={{ xs: 6, sm: 4 }} key={player.id}>
              <PlayerCard player={player} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderColor: "rgba(0,0,0,0.08)",
        transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "rgba(230,0,0,0.3)",
          boxShadow: "0 6px 18px rgba(230,0,0,0.08)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2,
          textAlign: "center",
          "&:last-child": { pb: 2 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ position: "relative", mb: 1 }}>
          <Avatar
            src={player.photo_url ?? undefined}
            alt={player.name}
            sx={{ width: 64, height: 64 }}
          >
            {player.name.slice(0, 1).toUpperCase()}
          </Avatar>
          {player.number != null && (
            <Box
              sx={{
                position: "absolute",
                bottom: -4,
                right: -4,
                minWidth: 24,
                height: 24,
                px: 0.5,
                borderRadius: "12px",
                backgroundColor: FIFA.red,
                color: "#fff",
                fontSize: "0.7rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
              }}
            >
              {player.number}
            </Box>
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{ fontWeight: 700, lineHeight: 1.2 }}
          noWrap
          title={player.name}
        >
          {player.name}
        </Typography>

        {player.position && (
          <Typography
            variant="caption"
            sx={{
              color: FIFA.royalBlue,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: "0.6rem",
            }}
          >
            {player.position}
          </Typography>
        )}

        {player.club && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ display: "block", width: "100%", mt: 0.5 }}
            title={player.club}
          >
            {player.club}
          </Typography>
        )}

        {player.age != null && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ opacity: 0.7 }}
          >
            {player.age} años
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
