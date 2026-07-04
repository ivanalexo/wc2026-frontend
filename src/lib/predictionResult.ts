import { Match, PredictionSummary } from "./types";

const OUTCOME_LABEL: Record<"H" | "D" | "A", string> = {
  H: "Victoria local",
  D: "Empate",
  A: "Victoria visitante",
};

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
  if (match.winner === "HOME") return match.home_team;
  if (match.winner === "AWAY") return match.away_team;
  return "Empate";
}

export function outcomeProb(pred: PredictionSummary, outcome: "H" | "D" | "A"): number {
  if (outcome === "H") return pred.p_home_win;
  if (outcome === "A") return pred.p_away_win;
  return pred.p_draw;
}

export function outcomeLabel(outcome: "H" | "D" | "A"): string {
  return OUTCOME_LABEL[outcome];
}
