"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Match } from "@/lib/types";
import { FIFA } from "@/theme/theme";
import BracketMatch from "./BracketMatch";

const SIDE_DEPTH_LABEL: Record<number, string> = {
  0: "Semifinales",
  1: "Cuartos",
  2: "Octavos",
  3: "32avos",
};

const MOBILE_ROUNDS: { label: string; stages: string[] }[] = [
  { label: "32avos", stages: ["Round of 32"] },
  { label: "Octavos", stages: ["Round of 16"] },
  { label: "Cuartos", stages: ["Quarter-finals"] },
  { label: "Semis", stages: ["Semi-finals"] },
  { label: "Final", stages: ["Final", "3rd Place"] },
];

function refNumber(slot: string | null): number | null {
  const m = slot ? /^W(\d+)$/.exec(slot) : null;
  return m ? parseInt(m[1], 10) : null;
}

function feeders(m: Match, byNum: Map<number, Match>): [Match | null, Match | null] {
  const a = refNumber(m.home_slot);
  const b = refNumber(m.away_slot);
  return [a !== null ? byNum.get(a) ?? null : null, b !== null ? byNum.get(b) ?? null : null];
}

function buildSide(root: Match | null, byNum: Map<number, Match>): Match[][] {
  const levels: Match[][] = [];
  const walk = (m: Match | null, depth: number) => {
    if (!m) return;
    const [a, b] = feeders(m, byNum);
    walk(a, depth + 1);
    (levels[depth] ??= []).push(m);
    walk(b, depth + 1);
  };
  walk(root, 0);
  return levels;
}

function Column({
  label,
  matches,
  spread,
}: {
  label: string;
  matches: Match[];
  spread: boolean;
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minWidth: 158 }}>
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "0.62rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "text.secondary",
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: spread ? "space-around" : "flex-start",
          gap: spread ? 0 : 1.25,
        }}
      >
        {matches.map((m) => (
          <BracketMatch key={m.id} match={m} />
        ))}
      </Box>
    </Box>
  );
}

export default function BracketClient({ matches }: { matches: Match[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tab, setTab] = useState(0);

  const byNum = useMemo(() => {
    const map = new Map<number, Match>();
    for (const m of matches) if (m.match_number !== null) map.set(m.match_number, m);
    return map;
  }, [matches]);

  const final = matches.find((m) => m.stage === "Final") ?? null;
  const thirdPlace = matches.find((m) => m.stage === "3rd Place") ?? null;

  // Vista móvil: tabs por ronda.
  if (isMobile) {
    const round = MOBILE_ROUNDS[tab];
    const list = matches
      .filter((m) => m.stage && round.stages.includes(m.stage))
      .sort((a, b) => (a.match_number ?? 0) - (b.match_number ?? 0));

    return (
      <Box>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3, minHeight: 40 }}
        >
          {MOBILE_ROUNDS.map((r) => (
            <Tab key={r.label} label={r.label} sx={{ minHeight: 40, fontWeight: 700, fontSize: "0.75rem" }} />
          ))}
        </Tabs>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxWidth: 360, mx: "auto" }}>
          {list.map((m) => (
            <BracketMatch key={m.id} match={m} />
          ))}
        </Box>
      </Box>
    );
  }

  // Vista desktop: arbol
  if (!final) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxWidth: 360 }}>
        {matches.map((m) => (
          <BracketMatch key={m.id} match={m} />
        ))}
      </Box>
    );
  }

  const [sf1, sf2] = feeders(final, byNum);
  const left = buildSide(sf1, byNum);
  const right = buildSide(sf2, byNum);
  const maxDepth = Math.max(left.length, right.length) - 1;

  const leftDepths = [];
  for (let d = maxDepth; d >= 0; d--) leftDepths.push(d);
  const rightDepths = [];
  for (let d = 0; d <= maxDepth; d++) rightDepths.push(d);

  return (
    <Box sx={{ overflowX: "auto", pb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "stretch", gap: 1.5, minWidth: "min-content" }}>
        {leftDepths.map((d) => (
          <Column
            key={`l-${d}`}
            label={SIDE_DEPTH_LABEL[d] ?? ""}
            matches={left[d] ?? []}
            spread={d !== maxDepth}
          />
        ))}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 175,
            gap: 2,
          }}
        >
          <EmojiEventsIcon sx={{ color: FIFA.yellow, fontSize: 30 }} />
          <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: FIFA.red }}>
            Final
          </Typography>
          <Box sx={{ width: "100%", border: `2px solid ${FIFA.yellow}`, borderRadius: 1 }}>
            <BracketMatch match={final} />
          </Box>
          {thirdPlace && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <Typography sx={{ textAlign: "center", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>
                3.er lugar
              </Typography>
              <BracketMatch match={thirdPlace} />
            </Box>
          )}
        </Box>

        {rightDepths.map((d) => (
          <Column
            key={`r-${d}`}
            label={SIDE_DEPTH_LABEL[d] ?? ""}
            matches={right[d] ?? []}
            spread={d !== maxDepth}
          />
        ))}
      </Box>
    </Box>
  );
}
