export function slotLabel(slot: string | null | undefined): string {
  if (!slot) return "Por definir";
  if (slot === "3rd") return "Mejor 3.º";

  const group = /^([12])([A-L])$/.exec(slot);
  if (group) {
    const pos = group[1] === "1" ? "1.º" : "2.º";
    return `${pos} Grupo ${group[2]}`;
  }

  const ref = /^([WL])(\d+)$/.exec(slot);
  if (ref) {
    return `${ref[1] === "W" ? "Ganador" : "Perdedor"} P${ref[2]}`;
  }

  return slot;
}

export function teamDisplay(team: string | null, slot: string | null): string {
  return team ?? slotLabel(slot);
}
