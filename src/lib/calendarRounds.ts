export interface CalendarRound {
  stage: string;
  calName: string;
  fileName: string;
}

export const CALENDAR_ROUNDS: Record<string, CalendarRound> = {
  "round-of-16": {
    stage: "Round of 16",
    calName: "Mundial FIFA 2026 · Octavos de final",
    fileName: "mundial-2026-octavos.ics",
  },
  "quarter-finals": {
    stage: "Quarter-finals",
    calName: "Mundial FIFA 2026 · Cuartos de final",
    fileName: "mundial-2026-cuartos.ics",
  },
  "semi-finals": {
    stage: "Semi-finals",
    calName: "Mundial FIFA 2026 · Semifinales",
    fileName: "mundial-2026-semifinales.ics",
  },
};

export const CURRENT_CALENDAR_ROUND = "quarter-finals";
export const CURRENT_CALENDAR_LABEL = "Calendario cuartos de final";
