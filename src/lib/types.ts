export interface Team {
  id: number;
  name: string;
  slug: string;
  group: string | null;
  confederation: string | null;
  elo_rating: number | null;
  flag_code: string | null;
  flag_url: string | null;
}

export interface Player {
  id: number;
  team_name: string;
  name: string;
  position: string | null;
  number: number | null;
  age: number | null;
  nacionality: string | null;
  club: string | null;
  photo_url: string | null;
}

export interface PredictionSummary {
  p_home_win: number;
  p_draw: number;
  p_away_win: number;
  prediction: "H" | "D" | "A";
  prediction_label: string;
}

export type MatchStatus = "scheduled" | "live" | "finished";

export interface Match {
  id: number;
  home_team: string;
  away_team: string;
  date: string;
  city: string | null;
  country: string | null;
  stage: string | null;
  group: string | null;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  prediction: PredictionSummary | null;
}

export interface ShapExplanation {
  main_factor: string;
  factors: string[];
}

export interface PredictionResponse {
  home_team: string;
  away_team: string;
  p_home_win: number;
  p_draw: number;
  p_away_win: number;
  prediction: "H" | "D" | "A";
  prediction_label: string;
  home_elo: number | null;
  away_elo: number | null;
  elo_diff: number | null;
  explanation: ShapExplanation | null;
  cached: boolean;
}

export interface ScoreEntry {
  score: string;
  probability: number;
}

export interface ScorePredictionResponse {
  home_team: string;
  away_team: string;
  predicted_home_goals: number;
  predicted_away_goals: number;
  predicted_score: string;
  expected_home_goals: number;
  expected_away_goals: number;
  p_home_win: number;
  p_draw: number;
  p_away_win: number;
  top_scores: ScoreEntry[];
  n_simulations: number;
}

export interface TeamSimulation {
  team: string;
  elo: number;
  p_qualify: number;
  p_reach_r16: number;
  p_reach_qf: number;
  p_reach_sf: number;
  p_reach_final: number;
  p_champion: number;
}

export interface H2HResponse {
  team1: string;
  team2: string;
  total_matches_weighted: number;
  team1_wins_weighted: number;
  draws_weighted: number;
  team2_wins_weighted: number;
  team1_win_rate: number;
  note: string;
}

export interface GroupsResponse {
  groups: Record<string, GroupMatch[]>;
}

export interface GroupMatch {
  id: number;
  home_team: string;
  away_team: string;
  date: string;
  city: string | null;
  prediction: PredictionSummary | null;
}

export interface HealthResponse {
  status: "ok" | "degraded";
  components: {
    api: string;
    database: string;
    ml_artifacts: string;
  };
}