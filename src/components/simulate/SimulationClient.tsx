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

// =============================================================================
// Definición de columnas
// =============================================================================

type SortKey = keyof SimulationRow;

interface Column {
  key: SortKey;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  highlight?: boolean;
}

const COLUMNS: Column[] = [
  { key: "p_qualify",     label: "Clasifica", minWidth: 90,  align: "right" },
  { key: "p_reach_r16",   label: "R32",        minWidth: 75,  align: "right" },
  { key: "p_reach_qf",    label: "Cuartos",    minWidth: 75,  align: "right" },
  { key: "p_reach_sf",    label: "Semis",      minWidth: 75,  align: "right" },
  { key: "p_reach_final", label: "Final",      minWidth: 75,  align: "right" },
  { key: "p_champion",    label: "Campeón",    minWidth: 90,  align: "right", highlight: true },
];

const GROUPS = ["A","B","C","D","E","F","G","H","I","J","K","L"] as const;

// =============================================================================
// Helper: formatea probabilidad
// =============================================================================

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

// =============================================================================
// SimulationClient
// =============================================================================

interface SimulationClientProps {
  rows: SimulationRow[];
}

export default function SimulationClient({ rows }: SimulationClientProps) {
  const router = useRouter();

  const [search,       setSearch]       = useState("");
  const [selectedGroup, setGroup]       = useState<string | null>(null);
  const [sortBy,       setSortBy]       = useState<SortKey>("p_champion");
  const [sortDir,      setSortDir]      = useState<"asc" | "desc">("desc");

  // --- Ordenamiento ---
  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  // --- Datos filtrados y ordenados ---
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

  // --- Rank global (siempre por p_champion desc) ---
  const rankMap = useMemo(() => {
    const sorted = [...rows].sort((a, b) => b.p_champion - a.p_champion);
    const map: Record<string, number> = {};
    sorted.forEach((r, i) => { map[r.name] = i + 1; });
    return map;
  }, [rows]);

  const cellSx = {
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    py: 1.5,
    px: 2,
    fontSize: "0.82rem",
  };

  const headSx = {
    ...cellSx,
    backgroundColor: "#0A0A0A",
    color: "rgba(255,255,255,0.5)",
    fontWeight: 700,
    fontSize: "0.72rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
  };

  return (
    <Box>
      {/* ── CONTROLES ──────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>

        {/* Búsqueda */}
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
              backgroundColor: "#0D0D0D",
              "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&.Mui-focused fieldset": { borderColor: FIFA.red },
            },
          }}
        />

        {/* Contador */}
        <Typography variant="body2" color="text.secondary" sx={{ ml: "auto" }}>
          {processed.length} equipos
        </Typography>
      </Box>

      {/* Filtro por grupo */}
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
                borderColor: active ? FIFA.lime : "rgba(255,255,255,0.1)",
                color: active ? FIFA.lime : "rgba(255,255,255,0.4)",
                backgroundColor: active ? "rgba(204,255,0,0.08)" : "transparent",
                "&:hover": { borderColor: FIFA.lime, color: FIFA.lime, backgroundColor: "rgba(204,255,0,0.06)" },
                transition: "all 0.15s",
              }}
            >
              {g ?? "Todos"}
            </Button>
          );
        })}
      </Box>

      {/* ── TABLA ──────────────────────────────────────────────────── */}
      {processed.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <QueryStatsIcon sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)", mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            No hay resultados para &quot;{search}&quot;
          </Typography>
        </Box>
      ) : (
        <TableContainer
          sx={{
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.07)",
            overflowX: "auto",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {/* Rank */}
                <TableCell sx={{ ...headSx, minWidth: 40, textAlign: "center" }}>#</TableCell>

                {/* Equipo */}
                <TableCell sx={{ ...headSx, minWidth: 180 }}>Equipo</TableCell>

                {/* Grupo */}
                <TableCell sx={{ ...headSx, minWidth: 60, textAlign: "center" }}>Grupo</TableCell>

                {/* ELO */}
                <TableCell
                  sx={{ ...headSx, minWidth: 80, textAlign: "right", cursor: "pointer" }}
                  onClick={() => handleSort("elo")}
                >
                  <TableSortLabel
                    active={sortBy === "elo"}
                    direction={sortBy === "elo" ? sortDir : "desc"}
                    onClick={() => handleSort("elo")}
                    sx={{ color: "inherit !important", "& .MuiTableSortLabel-icon": { color: `${FIFA.lime} !important` } }}
                  >
                    ELO
                  </TableSortLabel>
                </TableCell>

                {/* Columnas de rondas */}
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col.key as string}
                    align={col.align}
                    sx={{
                      ...headSx,
                      minWidth: col.minWidth,
                      color: col.highlight ? `${FIFA.lime} !important` : undefined,
                      cursor: "pointer",
                    }}
                  >
                    <TableSortLabel
                      active={sortBy === col.key}
                      direction={sortBy === col.key ? sortDir : "desc"}
                      onClick={() => handleSort(col.key)}
                      sx={{
                        color: "inherit !important",
                        "& .MuiTableSortLabel-icon": { color: `${FIFA.lime} !important` },
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
                const rank    = rankMap[row.name];

                return (
                  <TableRow
                    key={row.name}
                    onClick={() => router.push(`/teams/${row.slug}`)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: rank <= 2 ? "rgba(204,255,0,0.02)" : "transparent",
                      "&:hover": { backgroundColor: "rgba(230,0,0,0.05)" },
                      transition: "background-color 0.15s",
                    }}
                  >
                    {/* Rank */}
                    <TableCell
                      sx={{
                        ...cellSx,
                        textAlign: "center",
                        fontWeight: 800,
                        color: rank <= 3 ? FIFA.lime : "rgba(255,255,255,0.3)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {rank}
                    </TableCell>

                    {/* Equipo con bandera */}
                    <TableCell sx={{ ...cellSx }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        {flagUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <Image
                            src={flagUrl}
                            alt={row.name}
                            width={32}
                            height={22}
                            style={{
                              objectFit: "cover",
                              borderRadius: 2, border: "1px solid rgba(255,255,255,0.1)",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <Box sx={{ width: 32, height: 22, borderRadius: 0.5, backgroundColor: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.name}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Grupo */}
                    <TableCell sx={{ ...cellSx, textAlign: "center" }}>
                      {row.group ? (
                        <Chip
                          label={row.group}
                          size="small"
                          sx={{
                            height: 18, fontSize: "0.62rem", fontWeight: 800,
                            backgroundColor: "rgba(204,255,0,0.08)",
                            color: FIFA.lime, border: `1px solid ${FIFA.lime}33`,
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">—</Typography>
                      )}
                    </TableCell>

                    {/* ELO */}
                    <TableCell sx={{ ...cellSx, textAlign: "right", fontWeight: 600, color: FIFA.skyBlue }}>
                      {row.elo ? row.elo.toLocaleString() : "—"}
                    </TableCell>

                    {/* Probabilidades por ronda */}
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
                              ? val > 0.1 ? FIFA.lime : "rgba(204,255,0,0.5)"
                              : val > 0.5 ? FIFA.white : "rgba(255,255,255,0.45)",
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

      {/* Nota al pie */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2, opacity: 0.45, fontSize: "0.65rem" }}
      >
        Probabilidades acumulativas: cada columna representa llegar a esa ronda, no ganarla.
        Fuente: simulación Monte Carlo con 10,000 iteraciones del torneo completo.
      </Typography>
    </Box>
  );
}