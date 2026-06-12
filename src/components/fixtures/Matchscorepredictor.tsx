"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import { FIFA } from "@/theme/theme";
import { ScorePredictionResponse } from "@/lib/types";
import api, { endpoints } from "@/lib/api";

interface MatchScorePredictorProps {
  homeTeam: string;
  awayTeam: string;
  realHomeScore?: number | null;
  realAwayScore?: number | null;
  autoLoad?: boolean;
}

export default function MatchScorePredictor({
  homeTeam,
  awayTeam,
  realHomeScore,
  realAwayScore,
  autoLoad = false,
}: MatchScorePredictorProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState<ScorePredictionResponse | null>(null);
  const [error, setError]     = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<ScorePredictionResponse>(endpoints.predictScore, {
        home_team: homeTeam,
        away_team: awayTeam,
      });
      setResult(res.data);
    } catch {
      setError("No se pudo calcular el marcador.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoLoad) return;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post<ScorePredictionResponse>(endpoints.predictScore, {
          home_team: homeTeam,
          away_team: awayTeam,
        });
        setResult(res.data);
      } catch {
        setError("No se pudo calcular el marcador.");
      } finally {
        setLoading(false);
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad]);

  const hasRealScore = realHomeScore != null && realAwayScore != null;
  const realScoreStr = hasRealScore ? `${realHomeScore}-${realAwayScore}` : null;

  const matchedEntry = realScoreStr && result
    ? result.top_scores.find(e => e.score === realScoreStr) ?? null
    : null;

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.75rem", mb: 2, fontWeight: 700 }}
        >
          Predicción de marcador
        </Typography>

        {!result && !loading && !autoLoad && (
          <Button
            onClick={handlePredict}
            variant="outlined"
            startIcon={<SportsSoccerIcon />}
            sx={{ "&:hover": { borderColor: FIFA.royalBlue, color: FIFA.royalBlue } }}
          >
            Calcular marcador probable
          </Button>
        )}

        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">Simulando...</Typography>
          </Box>
        )}

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>
        )}

        {result && (
          <Box>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h2" sx={{ letterSpacing: "0.12em", fontWeight: 900 }}>
                {result.predicted_score}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                marcador más probable
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 2 }}>
              {result.top_scores.map(({ score, probability }) => {
                const isTopPick   = score === result.predicted_score;
                const isRealMatch = score === realScoreStr;

                return (
                  <Chip
                    key={score}
                    label={`${score}  ${(probability * 100).toFixed(1)}%`}
                    size="small"
                    sx={{
                      backgroundColor: isRealMatch
                        ? "rgba(0,153,51,0.14)"
                        : isTopPick
                          ? "rgba(230,0,0,0.12)"
                          : "rgba(0,0,0,0.04)",
                      color: isRealMatch
                        ? "success.main"
                        : isTopPick
                          ? FIFA.red
                          : "text.secondary",
                      border: isRealMatch
                        ? "1px solid rgba(0,153,51,0.35)"
                        : isTopPick
                          ? `1px solid ${FIFA.red}55`
                          : "1px solid rgba(0,0,0,0.1)",
                      fontWeight: isRealMatch || isTopPick ? 700 : 400,
                      fontFamily: "monospace",
                    }}
                  />
                );
              })}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textAlign: "center", opacity: 0.5 }}
            >
              λ {homeTeam}: {result.expected_home_goals} · λ {awayTeam}: {result.expected_away_goals} ·{" "}
              {result.n_simulations.toLocaleString()} simulaciones
            </Typography>

            {hasRealScore && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  mt: 2.5,
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: matchedEntry
                    ? "rgba(0,153,51,0.06)"
                    : "rgba(0,0,0,0.03)",
                  border: matchedEntry
                    ? "1px solid rgba(0,153,51,0.2)"
                    : "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {matchedEntry ? (
                  <>
                    <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "success.main", flexShrink: 0, mt: "1px" }} />
                    <Typography variant="caption" sx={{ color: "success.main", fontWeight: 600, lineHeight: 1.5 }}>
                      El modelo predijo este resultado en un{" "}
                      <strong>{(matchedEntry.probability * 100).toFixed(1)}%</strong>
                      {" "}— marcador real: {realScoreStr}
                    </Typography>
                  </>
                ) : (
                  <>
                    <CancelOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0, mt: "1px" }} />
                    <Typography variant="caption" color="text.disabled" sx={{ lineHeight: 1.5 }}>
                      El modelo no acertó el marcador exacto · Real:{" "}
                      <strong>{realScoreStr}</strong>
                      {" "}· Predijo: <strong>{result.predicted_score}</strong>
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {!hasRealScore && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 2.5,
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 14, color: "text.disabled", flexShrink: 0, mt: "1px" }} />
                <Typography variant="caption" color="text.disabled" sx={{ lineHeight: 1.5 }}>
                  El marcador es referencial. El modelo está optimizado para predecir al ganador, no un resultado exacto.
                  El fútbol tiene un alto componente aleatorio y el marcador esperado depende de variables como el estado
                  físico y anímico de los jugadores, su rendimiento con la selección, los goles esperados y las decisiones
                  del cuerpo técnico.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
