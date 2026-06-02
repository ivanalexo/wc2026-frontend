"use client";

import { useState, useMemo } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { FIFA } from "@/theme/theme";
import { GroupMatch } from "@/lib/types";
import ProbabilityBar from "@/components/shared/ProbabilityBar";

interface TeamStanding {
  team: string;
  expectedPoints: number;
}

function calculateStandings(matches: GroupMatch[]): TeamStanding[] {
  const pts: Record<string, number> = {};

  for (const m of matches) {
    if (!(m.home_team in pts)) pts[m.home_team] = 0;
    if (!(m.away_team in pts)) pts[m.away_team] = 0;
    if (!m.prediction) continue;
    const { p_home_win, p_draw, p_away_win } = m.prediction;
    pts[m.home_team] += 3 * p_home_win + p_draw;
    pts[m.away_team] += 3 * p_away_win + p_draw;
  }

  return Object.entries(pts)
    .map(([team, expectedPoints]) => ({ team, expectedPoints }))
    .sort((a, b) => b.expectedPoints - a.expectedPoints);
}

function GroupStandings({ standings }: { standings: TeamStanding[] }) {
  const MAX_PTS = 9;

  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          color: "text.secondary",
          letterSpacing: "0.15em",
          fontSize: "0.65rem",
          display: "block",
          mb: 1.5,
        }}
      >
        Posiciones predichas
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {standings.map((s, idx) => {
          const qualifies = idx < 2;
          const pct = (s.expectedPoints / MAX_PTS) * 100;

          return (
            <Box
              key={s.team}
              sx={{
                display: "grid",
                gridTemplateColumns: "28px 1fr auto",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: qualifies
                  ? "rgba(0,153,51,0.05)"
                  : "rgba(0,0,0,0.02)",
                border: "1px solid",
                borderColor: qualifies
                  ? "rgba(0,153,51,0.15)"
                  : "rgba(0,0,0,0.06)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  color: qualifies ? "#009933" : "rgba(0,0,0,0.2)",
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {idx + 1}
              </Typography>

              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.75,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {s.team}
                  </Typography>
                  {qualifies && (
                    <Chip
                      label="CLASIFICA"
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: "0.55rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        backgroundColor: "rgba(0,153,51,0.12)",
                        color: "#009933",
                        border: "1px solid rgba(0,153,51,0.3)",
                      }}
                    />
                  )}
                  {idx === 2 && (
                    <Chip
                      label="3°"
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        backgroundColor: "rgba(0,0,0,0.05)",
                        color: "text.secondary",
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "rgba(0,0,0,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${pct}%`,
                      height: "100%",
                      borderRadius: 2,
                      backgroundColor: qualifies
                        ? "#009933"
                        : "rgba(0,0,0,0.15)",
                      transition: "width 0.6s ease",
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 800,
                    color: qualifies ? "#009933" : "text.secondary",
                  }}
                >
                  {s.expectedPoints.toFixed(1)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontSize: "0.6rem" }}
                >
                  pts esp.
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1.5, opacity: 0.45, fontSize: "0.65rem" }}
      >
        Pts esperados = Σ (3 × P(victoria) + 1 × P(empate)) por partido
      </Typography>
    </Box>
  );
}

function GroupMatchRow({ match }: { match: GroupMatch }) {
  const dateStr = new Date(match.date).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
  });

  return (
    <Box
      component={NextLink}
      href={`/fixtures/${match.id}`}
      sx={{
        display: "block",
        textDecoration: "none",
        p: 1.5,
        borderRadius: 1,
        border: "1px solid rgba(0,0,0,0.07)",
        backgroundColor: "background.paper",
        "&:hover": {
          borderColor: "rgba(230,0,0,0.3)",
          backgroundColor: "rgba(230,0,0,0.03)",
        },
        transition: "all 0.15s",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 1,
          mb: match.prediction ? 0.75 : 0,
        }}
      >
        <Typography
          variant="body2"
          sx={{ textAlign: "right", fontWeight: 700 }}
        >
          {match.home_team}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: "center", minWidth: 48 }}
        >
          {dateStr}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {match.away_team}
        </Typography>
      </Box>

      {match.prediction && (
        <ProbabilityBar
          pHome={match.prediction.p_home_win}
          pDraw={match.prediction.p_draw}
          pAway={match.prediction.p_away_win}
          homeLabel={match.home_team}
          awayLabel={match.away_team}
          height={5}
          showLabels={false}
        />
      )}
    </Box>
  );
}

interface GroupsClientProps {
  groups: Record<string, GroupMatch[]>;
}

export default function GroupsClient({ groups }: GroupsClientProps) {
  const groupKeys = Object.keys(groups).sort();
  const [selected, setSelected] = useState(groupKeys[0] ?? "A");

  const matches = groups[selected] ?? [];
  const standings = useMemo(() => calculateStandings(matches), [matches]);

  return (
    <Box>
      <Tabs
        value={selected}
        onChange={(_, v) => setSelected(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 4,
          "& .MuiTab-root": {
            fontWeight: 700,
            fontSize: "0.82rem",
            letterSpacing: "0.06em",
            minWidth: 80,
          },
        }}
      >
        {groupKeys.map((g) => (
          <Tab key={g} label={`Grupo ${g}`} value={g} />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              borderTop: `3px solid ${FIFA.royalBlue}`,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 800 }}>
                Grupo {selected}
              </Typography>
              {standings.length > 0 ? (
                <GroupStandings standings={standings} />
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin predicciones disponibles
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              letterSpacing: "0.15em",
              fontSize: "0.65rem",
              display: "block",
              mb: 1.5,
            }}
          >
            Partidos del grupo
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {matches.length > 0 ? (
              [...matches]
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
                )
                .map((m) => <GroupMatchRow key={m.id} match={m} />)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No hay partidos para este grupo
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
