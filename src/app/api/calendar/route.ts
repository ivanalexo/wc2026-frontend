import { NextRequest } from "next/server";
import { Match } from "@/lib/types";
import { buildIcs } from "@/lib/ics";
import { CALENDAR_ROUNDS } from "@/lib/calendarRounds";

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

  const ics = buildIcs(matches, request.nextUrl.origin, cfg.calName);

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${cfg.fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
