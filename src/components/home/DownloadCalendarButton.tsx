"use client";

import { useState } from "react";
import Fab from "@mui/material/Fab";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import api, { endpoints } from "@/lib/api";
import { Match } from "@/lib/types";
import { downloadCalendar } from "@/lib/ics";

export default function DownloadCalendarButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await api.get<Match[]>(endpoints.fixtures, {
        params: { limit: 72 },
      });
      downloadCalendar(data);
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
      Descargar calendario
    </Fab>
  );
}
