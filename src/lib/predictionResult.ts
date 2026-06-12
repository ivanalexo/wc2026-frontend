import { Match } from "./types";

export function realOutcome(match: Match): "H" | "D" | "A" | null {
  if (match.home_score === null || match.away_score === null) return null;
  if (match.home_score > match.away_score) return "H";
  if (match.home_score < match.away_score) return "A";
  return "D";
}

export function isPredictionCorrect(match: Match): boolean | null {
  const outcome = realOutcome(match);
  if (outcome === null || !match.prediction) return null;
  return match.prediction.prediction === outcome;
}

export function winnerName(match: Match): string | null {
  const outcome = realOutcome(match);
  if (outcome === null) return null;
  if (outcome === "H") return match.home_team;
  if (outcome === "A") return match.away_team;
  return "Empate";
}
