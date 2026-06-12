"use client";

function toUTC(dateStr: string): Date {
  return new Date(dateStr.endsWith("Z") ? dateStr : dateStr + "Z");
}

function fmtDate(d: Date, tz?: string): string {
  return d.toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
    ...(tz ? { timeZone: tz } : {}),
  });
}

function fmtTime(d: Date, tz?: string): string {
  return d.toLocaleTimeString("es", {
    hour: "2-digit",
    minute: "2-digit",
    ...(tz ? { timeZone: tz } : {}),
  });
}

function fmtDateFull(d: Date, tz?: string): string {
  return d.toLocaleDateString("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(tz ? { timeZone: tz } : {}),
  });
}

export function MatchDateTimeShort({ dateStr }: { dateStr: string }) {
  const d = toUTC(dateStr);
  const day = fmtDate(d);
  const time = fmtTime(d);

  return <>{day} · {time}</>;
}

export function MatchDateTimeFull({ dateStr }: { dateStr: string }) {
  const d = toUTC(dateStr);
  const full = fmtDateFull(d);
  const time = fmtTime(d);

  return <>{full} · {time}</>;
}
