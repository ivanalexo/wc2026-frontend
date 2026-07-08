import Fab from "@mui/material/Fab";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { CURRENT_CALENDAR_ROUND, CURRENT_CALENDAR_LABEL } from "@/lib/calendarRounds";

export default function DownloadCalendarButton() {
  return (
    <Fab
      variant="extended"
      color="primary"
      component="a"
      href={`/api/calendar?round=${CURRENT_CALENDAR_ROUND}`}
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
      <CalendarMonthIcon sx={{ mr: 1 }} />
      {CURRENT_CALENDAR_LABEL}
    </Fab>
  );
}
