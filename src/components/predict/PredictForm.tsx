"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { FIFA } from "@/theme/theme";
import { PredictionResponse, ScorePredictionResponse } from "@/lib/types";
import api, { endpoints } from "@/lib/api";
import ProbabilityBar from "@/components/shared/ProbabilityBar";

const WC2026_TEAMS = [
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Bosnia and Herzegovina",
  "Brazil",
  "Canada",
  "Cape Verde",
  "Colombia",
  "Croatia",
  "Curacao",
  "Czech Republic",
  "DR Congo",
  "Ecuador",
  "Egypt",
  "England",
  "France",
  "Germany",
  "Ghana",
  "Haiti",
  "Iraq",
  "Iran",
  "Ivory Coast",
  "Japan",
  "Jordan",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Panama",
  "Paraguay",
  "Portugal",
  "Qatar",
  "Saudi Arabia",
  "Scotland",
  "Senegal",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tunisia",
  "Turkey",
  "United States",
  "Uruguay",
  "Uzbekistan",
].sort();

function outcomeLabel(prediction: "H" | "D" | "A", home: string, away: string) {
  if (prediction === "H") return `${home} gana`;
  if (prediction === "A") return `${away} gana`;
  return "Empate";
}

function outcomeColor(prediction: "H" | "D" | "A") {
  if (prediction === "H") return FIFA.red;
  if (prediction === "A") return FIFA.royalBlue;
  return "#5A5E7A";
}

interface PredictFormProps {
  initialTeams: string[];
}

export default function PredictForm({ initialTeams }: PredictFormProps) {
  const teams = initialTeams.length > 0 ? initialTeams : WC2026_TEAMS;

  const [homeTeam, setHomeTeam] = useState<string | null>(null);
  const [awayTeam, setAwayTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<PredictionResponse | null>(
    null,
  );
  const [scoreResult, setScoreResult] =
    useState<ScorePredictionResponse | null>(null);

  const handleSwap = () => {
    setHomeTeam(awayTeam);
    setAwayTeam(homeTeam);
    setMatchResult(null);
    setScoreResult(null);
  };

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam) return;
    if (homeTeam === awayTeam) {
      setError("Los dos equipos deben ser diferentes.");
      return;
    }

    setLoading(true);
    setError(null);
    setMatchResult(null);
    setScoreResult(null);

    try {
      const [matchRes, scoreRes] = await Promise.allSettled([
        api.post<PredictionResponse>(endpoints.predictMatch, {
          home_team: homeTeam,
          away_team: awayTeam,
        }),
        api.post<ScorePredictionResponse>(endpoints.predictScore, {
          home_team: homeTeam,
          away_team: awayTeam,
        }),
      ]);

      if (matchRes.status === "fulfilled") {
        setMatchResult(matchRes.value.data);
      } else {
        setError(
          "No se pudo generar la predicción. ¿Están los artefactos ML cargados?",
        );
      }

      if (scoreRes.status === "fulfilled") {
        setScoreResult(scoreRes.value.data);
      }
    } catch {
      setError("Error de conexión con el backend.");
    } finally {
      setLoading(false);
    }
  };

  const canPredict =
    !!homeTeam && !!awayTeam && homeTeam !== awayTeam && !loading;

  return (
    <Box>
      <Card
        sx={{
          borderTop: `3px solid ${FIFA.red}`,
          mb: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr auto 1fr" },
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: FIFA.red,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  mb: 1,
                }}
              >
                Local
              </Typography>
              <Autocomplete
                options={teams}
                value={homeTeam}
                getOptionDisabled={(option) => option === awayTeam}
                onChange={(_, v) => {
                  setHomeTeam(v);
                  setMatchResult(null);
                  setScoreResult(null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecciona equipo"
                    size="small"
                    disabled={homeTeam === awayTeam}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
                        "&:hover fieldset": { borderColor: FIFA.red },
                        "&.Mui-focused fieldset": { borderColor: FIFA.red },
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                pb: 0.5,
              }}
            >
              <IconButton
                onClick={handleSwap}
                sx={{
                  border: "1px solid rgba(0,0,0,0.15)",
                  "&:hover": {
                    backgroundColor: "rgba(230,0,0,0.1)",
                    borderColor: FIFA.red,
                  },
                }}
              >
                <SwapHorizIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: FIFA.royalBlue,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "block",
                  mb: 1,
                }}
              >
                Visitante
              </Typography>
              <Autocomplete
                options={teams}
                value={awayTeam}
                getOptionDisabled={(option) => option === homeTeam}
                onChange={(_, v) => {
                  setAwayTeam(v);
                  setMatchResult(null);
                  setScoreResult(null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Selecciona equipo"
                    size="small"
                    disabled={homeTeam === awayTeam}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "rgba(0,0,0,0.15)" },
                        "&:hover fieldset": { borderColor: FIFA.royalBlue },
                        "&.Mui-focused fieldset": {
                          borderColor: FIFA.royalBlue,
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: "rgba(228,0,90,0.1)",
                color: FIFA.hotPink,
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            onClick={handlePredict}
            disabled={!canPredict}
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={
              loading ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SportsSoccerIcon />
              )
            }
            sx={{ fontWeight: 700, py: 1.5, fontSize: "1rem" }}
          >
            {loading ? "Prediciendo..." : "Predecir partido"}
          </Button>
        </CardContent>
      </Card>

      <Collapse in={!!matchResult}>
        {matchResult && (
          <Box>
            <Card
              sx={{ mb: 3 }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color:
                          matchResult.prediction === "H"
                            ? FIFA.red
                            : "text.primary",
                        transition: "color 0.3s",
                        fontWeight: 900,
                      }}
                    >
                      {matchResult.home_team}
                    </Typography>
                    {matchResult.home_elo && (
                      <Typography variant="caption" color="text.secondary">
                        ELO {matchResult.home_elo.toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ letterSpacing: "0.15em" }}
                    >
                      VS
                    </Typography>
                    {matchResult.elo_diff !== null && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "text.secondary",
                          fontSize: "0.65rem",
                        }}
                      >
                        Δ ELO {matchResult.elo_diff > 0 ? "+" : ""}
                        {matchResult.elo_diff}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color:
                          matchResult.prediction === "A"
                            ? FIFA.royalBlue
                            : "text.primary",
                        transition: "color 0.3s",
                        fontWeight: 900,
                      }}
                    >
                      {matchResult.away_team}
                    </Typography>
                    {matchResult.away_elo && (
                      <Typography variant="caption" color="text.secondary">
                        ELO {matchResult.away_elo.toLocaleString()}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <ProbabilityBar
                  pHome={matchResult.p_home_win}
                  pDraw={matchResult.p_draw}
                  pAway={matchResult.p_away_win}
                  homeLabel={matchResult.home_team}
                  awayLabel={matchResult.away_team}
                  height={10}
                />

                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: "center" }}>
                  <Chip
                    label={outcomeLabel(
                      matchResult.prediction,
                      matchResult.home_team,
                      matchResult.away_team,
                    )}
                    sx={{
                      backgroundColor: `${outcomeColor(matchResult.prediction)}22`,
                      color: outcomeColor(matchResult.prediction),
                      border: `1px solid ${outcomeColor(matchResult.prediction)}66`,
                      fontWeight: 800,
                      fontSize: "1rem",
                      height: 40,
                      px: 2,
                      letterSpacing: "0.02em",
                    }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mt: 1 }}
                  >
                    predicción del modelo XGBoost
                  </Typography>
                  {matchResult.cached && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        opacity: 0.5,
                        fontSize: "0.65rem",
                      }}
                    >
                      (resultado cacheado)
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {matchResult.explanation && (
              <Card
                sx={{ mb: 3 }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <TrendingUpIcon sx={{ color: FIFA.royalBlue, fontSize: 20 }} />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      Por qué este resultado
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{ mb: 2, fontWeight: 600 }}
                  >
                    {matchResult.explanation.main_factor}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {matchResult.explanation.factors.map((factor, i) => (
                      <Chip
                        key={i}
                        label={factor}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(51,51,204,0.08)",
                          color: FIFA.royalBlue,
                          border: "1px solid rgba(51,51,204,0.2)",
                          fontWeight: 500,
                          fontSize: "0.72rem",
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {scoreResult && (
              <Card
                sx={{}}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Marcador probable · Poisson + Monte Carlo
                  </Typography>

                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        letterSpacing: "0.1em",
                        fontWeight: 900,
                      }}
                    >
                      {scoreResult.predicted_score}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      λ {scoreResult.home_team}:{" "}
                      {scoreResult.expected_home_goals} · λ{" "}
                      {scoreResult.away_team}: {scoreResult.expected_away_goals}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    {scoreResult.top_scores.map(({ score, probability }) => (
                      <Chip
                        key={score}
                        label={`${score}  ${(probability * 100).toFixed(1)}%`}
                        size="small"
                        sx={{
                          backgroundColor:
                            score === scoreResult.predicted_score
                              ? "rgba(230,0,0,0.12)"
                              : "rgba(0,0,0,0.04)",
                          color:
                            score === scoreResult.predicted_score
                              ? FIFA.red
                              : "text.secondary",
                          border:
                            score === scoreResult.predicted_score
                              ? `1px solid ${FIFA.red}55`
                              : "1px solid rgba(0,0,0,0.1)",
                          fontWeight:
                            score === scoreResult.predicted_score ? 700 : 400,
                          fontFamily: "monospace",
                          fontSize: "0.78rem",
                        }}
                      />
                    ))}
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      mt: 2,
                      opacity: 0.5,
                    }}
                  >
                    {scoreResult.n_simulations.toLocaleString()} simulaciones
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Collapse>
    </Box>
  );
}
