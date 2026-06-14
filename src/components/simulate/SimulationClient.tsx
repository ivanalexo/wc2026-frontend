"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { FIFA } from "@/theme/theme";
import { getFlagUrl } from "@/lib/flagCodes";
import { SimulationRow } from "@/app/simulate/page";
import Image from "next/image";

type SortKey = keyof SimulationRow;

interface Column {
  key: SortKey;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  highlight?: boolean;
}

const COLUMNS: Column[] = [
  { key: "p_qualify", label: "Clasifica", minWidth: 90, align: "right" },
  { key: "p_reach_r16", label: "R32", minWidth: 75, align: "right" },
  { key: "p_reach_qf", label: "Cuartos", minWidth: 75, align: "right" },
  { key: "p_reach_sf", label: "Semis", minWidth: 75, align: "right" },
  { key: "p_reach_final", label: "Final", minWidth: 75, align: "right" },
  {
    key: "p_champion",
    label: "Campeón",
    minWidth: 90,
    align: "right",
    highlight: true,
  },
];

const GROUPS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
] as const;

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

interface SimulationClientProps {
  rows: SimulationRow[];
}

export default function SimulationClient({ rows }: SimulationClientProps) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedGroup, setGroup] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("p_champion");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const processed = useMemo(() => {
    let data = [...rows];

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((r) => r.name.toLowerCase().includes(q));
    }

    if (selectedGroup) {
      data = data.filter((r) => r.group === selectedGroup);
    }

    data.sort((a, b) => {
      const av = a[sortBy] as number;
      const bv = b[sortBy] as number;
      return sortDir === "desc" ? bv - av : av - bv;
    });

    return data;
  }, [rows, search, selectedGroup, sortBy, sortDir]);

  const rankMap = useMemo(() => {
    const sorted = [...rows].sort((a, b) => b.p_champion - a.p_champion);
    const map: Record<string, number> = {};
    sorted.forEach((r, i) => {
      map[r.name] = i + 1;
    });
    return map;
  }, [rows]);

  const cellSx = {
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    py: 1.5,
    px: 2,
    fontSize: "0.82rem",
  };

  const headSx = {
    ...cellSx,
    fontWeight: 700,
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Buscar equipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            width: 220,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
              "&:hover fieldset": { borderColor: "rgba(0,0,0,0.3)" },
              "&.Mui-focused fieldset": { borderColor: FIFA.red },
            },
          }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          {processed.length} equipos
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 3 }}>
        {[null, ...GROUPS].map((g) => {
          const active = selectedGroup === g;
          return (
            <Button
              key={g ?? "all"}
              onClick={() => setGroup(g)}
              sx={{
                minWidth: g ? 44 : 64,
                height: 30,
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                borderRadius: 1,
                border: "1px solid",
                borderColor: active ? FIFA.red : "rgba(0,0,0,0.18)",
                color: active ? FIFA.red : "text.secondary",
                backgroundColor: active
                  ? "rgba(230,0,0,0.06)"
                  : "transparent",
                "&:hover": {
                  borderColor: FIFA.red,
                  color: FIFA.red,
                  backgroundColor: "rgba(230,0,0,0.05)",
                },
                transition: "all 0.15s",
              }}
            >
              {g ?? "Todos"}
            </Button>
          );
        })}
      </Box>

      {processed.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <QueryStatsIcon
            sx={{ fontSize: 48, color: "rgba(0,0,0,0.12)", mb: 1 }}
          />
          <Typography variant="body1" color="text.secondary">
            No hay resultados para &quot;{search}&quot;
          </Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{
            borderRadius: 2,
            overflowX: "auto",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ ...headSx, minWidth: 40, textAlign: "center" }}
                >
                  #
                </TableCell>

                <TableCell sx={{ ...headSx, minWidth: 180 }}>Equipo</TableCell>

                <TableCell
                  sx={{ ...headSx, minWidth: 60, textAlign: "center" }}
                >
                  Grupo
                </TableCell>

                <TableCell
                  sx={{
                    ...headSx,
                    minWidth: 80,
                    textAlign: "right",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSort("elo")}
                >
                  <TableSortLabel
                    active={sortBy === "elo"}
                    direction={sortBy === "elo" ? sortDir : "desc"}
                    onClick={() => handleSort("elo")}
                    sx={{
                      color: "inherit !important",
                      "& .MuiTableSortLabel-icon": {
                        color: `${FIFA.royalBlue} !important`,
                      },
                    }}
                  >
                    ELO
                  </TableSortLabel>
                </TableCell>

                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.key as string}
                    align={col.align}
                    sx={{
                      ...headSx,
                      minWidth: col.minWidth,
                      color: col.highlight
                        ? `#009933 !important`
                        : undefined,
                      cursor: "pointer",
                    }}
                  >
                    <TableSortLabel
                      active={sortBy === col.key}
                      direction={sortBy === col.key ? sortDir : "desc"}
                      onClick={() => handleSort(col.key)}
                      sx={{
                        color: "inherit !important",
                        "& .MuiTableSortLabel-icon": {
                          color: `${FIFA.royalBlue} !important`,
                        },
                      }}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {processed.map((row) => {
                const flagUrl = getFlagUrl(row.name, 40);
                const rank = rankMap[row.name];

                return (
                  <TableRow
                    key={row.name}
                    onClick={() => router.push(`/teams/${row.slug}`)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        rank <= 2 ? "rgba(0,153,51,0.04)" : "transparent",
                      "&:hover": { backgroundColor: "rgba(230,0,0,0.05)" },
                      transition: "background-color 0.15s",
                    }}
                  >
                    <TableCell
                      sx={{
                        ...cellSx,
                        textAlign: "center",
                        fontWeight: 800,
                        color: rank <= 3 ? "#009933" : "rgba(0,0,0,0.25)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {rank}
                    </TableCell>

                    <TableCell sx={{ ...cellSx }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        {flagUrl ? (
                          <Image
                            src={flagUrl}
                            alt={row.name}
                            width={32}
                            height={22}
                            style={{
                              objectFit: "cover",
                              borderRadius: 2,
                              border: "1px solid rgba(0,0,0,0.1)",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 32,
                              height: 22,
                              borderRadius: 0.5,
                              backgroundColor: "rgba(0,0,0,0.04)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ ...cellSx, textAlign: "center" }}>
                      {row.group ? (
                        <Chip
                          label={row.group}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.62rem",
                            fontWeight: 800,
                            backgroundColor: "rgba(51,51,204,0.1)",
                            color: FIFA.royalBlue,
                            border: `1px solid ${FIFA.royalBlue}44`,
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell
                      sx={{
                        ...cellSx,
                        textAlign: "right",
                        fontWeight: 600,
                        color: FIFA.skyBlue,
                      }}
                    >
                      {row.elo ? Math.round(row.elo).toLocaleString("en-US") : "—"}
                    </TableCell>

                    {COLUMNS.map((col) => {
                      const val = row[col.key] as number;
                      return (
                        <TableCell
                          key={col.key as string}
                          align={col.align}
                          sx={{
                            ...cellSx,
                            fontWeight: col.highlight ? 800 : 500,
                            color: col.highlight
                              ? val > 0.1
                                ? "#009933"
                                : "rgba(0,153,51,0.5)"
                              : val > 0.5
                                ? "text.primary"
                                : "text.secondary",
                          }}
                        >
                          {pct(val)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2, opacity: 0.45, fontSize: "0.65rem" }}
      >
        Probabilidades acumulativas: cada columna representa llegar a esa ronda,
        no ganarla. Fuente: simulación Monte Carlo con 10,000 iteraciones del
        torneo completo.
      </Typography>
    </Box>
  );
}
