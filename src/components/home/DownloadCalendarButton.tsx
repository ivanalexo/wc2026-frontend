"use client";

import { useState } from "react";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import api, { endpoints } from "@/lib/api";
import { Match } from "@/lib/types";
import { downloadCalendar } from "@/lib/ics";

// Ronda vigente del calendario descargable (actualizar al avanzar el torneo).
const ROUND = {
  stage: "Round of 16",
  buttonLabel: "Calendario 8vos de final",
  calName: "Mundial FIFA 2026 · Octavos de final",
  fileName: "mundial-2026-octavos.ics",
};

export default function DownloadCalendarButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await api.get<Match[]>(endpoints.fixtures, {
        params: { stage: ROUND.stage, limit: 16 },
      });
      // Solo descargamos si ya hay cruces confirmados en esta ronda.
      if (data.some((m) => m.home_team && m.away_team)) {
        downloadCalendar(data, { calName: ROUND.calName, fileName: ROUND.fileName });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fab
      variant="extended"
      color="primary"
      onClick={handleClick}
      disabled={loading}
      sx={{
        position: "fixed",
        bottom: { xs: 16, md: 24 },
        right: { xs: 16, md: 24 },
        zIndex: 1200,
        fontWeight: 700,
        textTransform: "none",
        px: 2.5,
      }}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
      ) : (
        <CalendarMonthIcon sx={{ mr: 1 }} />
      )}
      {ROUND.buttonLabel}
    </Fab>
  );
}
