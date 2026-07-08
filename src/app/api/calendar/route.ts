import { after, NextRequest } from "next/server";
import { Match } from "@/lib/types";
import { buildIcs } from "@/lib/ics";
import { CALENDAR_ROUNDS } from "@/lib/calendarRounds";

// Origin público del sitio. Detrás del proxy de Railway, request.nextUrl.origin
// resuelve a localhost; usamos los headers forwarded (o una env var explícita).
function publicOrigin(request: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : request.nextUrl.origin;
}

// Registra la descarga en el backend (navegador + geo), sin bloquear al usuario.
function recordDownload(round: string, request: NextRequest): void {
  const user_agent = request.headers.get("user-agent") ?? "";
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  after(async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/metrics/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Metrics-Secret": process.env.SYNC_SECRET ?? "",
        },
        body: JSON.stringify({ round, user_agent, ip }),
      });
    } catch {
      // best-effort: una métrica fallida nunca afecta la descarga
    }
  });
}

export async function GET(request: NextRequest) {
  const round = request.nextUrl.searchParams.get("round") ?? "";
  const cfg = CALENDAR_ROUNDS[round];
  if (!cfg) {
    return new Response("Ronda no válida", { status: 400 });
  }

  let matches: Match[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/fixtures` +
        `?stage=${encodeURIComponent(cfg.stage)}&limit=16`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`backend ${res.status}`);
    matches = await res.json();
  } catch {
    return new Response("No se pudo generar el calendario", { status: 502 });
  }

  const ics = buildIcs(matches, publicOrigin(request), cfg.calName);

  recordDownload(round, request);

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${cfg.fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
