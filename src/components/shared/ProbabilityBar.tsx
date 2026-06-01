"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { FIFA } from "@/theme/theme";

interface ProbabilityBarProps {
  pHome: number;
  pDraw: number;
  pAway: number;
  homeLabel: string;
  awayLabel: string;
  height?: number;
  showLabels?: boolean;
}

export default function ProbabilityBar({
  pHome,
  pDraw,
  pAway,
  homeLabel,
  awayLabel,
  height = 8,
  showLabels = true,
}: ProbabilityBarProps) {
  const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

  return (
    <Box>
      {/* Barra tripartita */}
      <Box
        sx={{
          display: "flex",
          height,
          borderRadius: height / 2,
          overflow: "hidden",
          gap: "2px",
        }}
      >
        <Tooltip title={`${homeLabel} gana: ${pct(pHome)}`}>
          <Box
            sx={{
              width: pct(pHome),
              backgroundColor: FIFA.red,
              transition: "width 0.4s ease",
              minWidth: pHome > 0 ? 4 : 0,
            }}
          />
        </Tooltip>
        <Tooltip title={`Empate: ${pct(pDraw)}`}>
          <Box
            sx={{
              width: pct(pDraw),
              backgroundColor: "rgba(0,0,0,0.15)",
              transition: "width 0.4s ease",
              minWidth: pDraw > 0 ? 4 : 0,
            }}
          />
        </Tooltip>
        <Tooltip title={`${awayLabel} gana: ${pct(pAway)}`}>
          <Box
            sx={{
              flex: 1,
              backgroundColor: FIFA.royalBlue,
              transition: "width 0.4s ease",
              minWidth: pAway > 0 ? 4 : 0,
            }}
          />
        </Tooltip>
      </Box>

      {/* Labels */}
      {showLabels && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 0.75,
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: FIFA.red, fontWeight: 700 }}
          >
            {pct(pHome)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary" }}
          >
            {pct(pDraw)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: FIFA.skyBlue, fontWeight: 700 }}
          >
            {pct(pAway)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}