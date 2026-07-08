import { Match } from "@/lib/types";
import { getFlagCode } from "@/lib/flagCodes";
import { teamDisplay } from "@/lib/slotLabel";

const MATCH_DURATION_MS = 2 * 60 * 60 * 1000;

/**
 * Emoji de bandera a partir del código de flagCodes.
 * - Código ISO-2 ("mx")        -> regional indicators (🇲🇽)
 * - Subdivisión ("gb-eng")     -> tag sequence (🏴󠁧󠁢󠁥󠁮󠁧󠁿)
 * Devuelve "" si el equipo no tiene bandera mapeada.
 */
export function teamFlagEmoji(teamName: string | null): string {
  if (!teamName) return "";
  const code = getFlagCode(teamName);
  if (!code) return "";

  if (code.includes("-")) {
    const sub = code.replace(/-/g, "");
    const base = String.fromCodePoint(0x1f3f4);
    const tags = [...sub]
      .map((c) => String.fromCodePoint(0xe0000 + c.charCodeAt(0)))
      .join("");
    return base + tags + String.fromCodePoint(0xe007f);
  }

  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export function matchFavorite(
  match: Match
): { team: string; pct: number } | null {
  if (!match.prediction || !match.home_team || !match.away_team) return null;
  const { p_home_win, p_away_win } = match.prediction;
  const homeIsFavorite = p_home_win >= p_away_win;
  return {
    team: homeIsFavorite ? match.home_team : match.away_team,
    pct: Math.round((homeIsFavorite ? p_home_win : p_away_win) * 100),
  };
}

function toDate(dateStr: string): Date {
  return new Date(dateStr.endsWith("Z") ? dateStr : dateStr + "Z");
}

function toICSStamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`
  );
}

function esc(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function foldLine(line: string): string {
  const chars = [...line];
  if (chars.length <= 75) return line;

  const out: string[] = [chars.slice(0, 74).join("")];
  for (let i = 74; i < chars.length; i += 73) {
    out.push(" " + chars.slice(i, i + 73).join(""));
  }
  return out.join("\r\n");
}

function buildEvent(match: Match, origin: string, dtstamp: string): string[] {
  const start = toDate(match.date);
  const end = new Date(start.getTime() + MATCH_DURATION_MS);

  const home = `${teamFlagEmoji(match.home_team)} ${teamDisplay(match.home_team, match.home_slot)}`.trim();
  const away = `${teamFlagEmoji(match.away_team)} ${teamDisplay(match.away_team, match.away_slot)}`.trim();
  const groupPrefix = match.group ? `[Grupo ${match.group}] ` : "";

  const fav = matchFavorite(match);
  const descLines: string[] = [];
  if (fav) descLines.push(`Favorito a ganar: ${fav.team} (${fav.pct}%)`);
  descLines.push('');
  descLines.push('Si quieres saber más detalles de este partido, visita el enlace:');
  descLines.push(`${origin}/fixtures/${match.id}`);
  descLines.push('');
  descLines.push('Si quieres probar otros encuentros, visita el simulador:');
  descLines.push(`${origin}/simulate`);

  const location = [match.city, match.country].filter(Boolean).join(", ");

  const lines = [
    "BEGIN:VEVENT",
    `UID:wc2026-match-${match.id}@worldcup`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${toICSStamp(start)}`,
    `DTEND:${toICSStamp(end)}`,
    `SUMMARY:${esc(`${groupPrefix}${home} vs ${away}`)}`,
    `DESCRIPTION:${esc(descLines.join("\n"))}`,
  ];
  if (location) lines.push(`LOCATION:${esc(location)}`);
  lines.push("END:VEVENT");

  return lines;
}

/** Construye el .ics solo con los partidos que ya tienen ambos equipos confirmados. */
export function buildIcs(matches: Match[], origin: string, calName: string): string {
  const dtstamp = toICSStamp(new Date());

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WC2026//Fixtures//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(calName)}`,
    ...matches
      .filter((m) => m.home_team && m.away_team)  // solo cruces ya confirmados
      .flatMap((m) => buildEvent(m, origin, dtstamp)),
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n");
}
