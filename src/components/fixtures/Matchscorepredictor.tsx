"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { FIFA } from "@/theme/theme";
import { ScorePredictionResponse } from "@/lib/types";
import api, { endpoints } from "@/lib/api";

interface MatchScorePredictorProps {
  homeTeam: string;
  awayTeam: string;
}

export default function MatchScorePredictor({
  homeTeam,
  awayTeam,
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

  return (
    <Card
      sx={{}}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.75rem", mb: 2, fontWeight: 700 }}
        >
          Predicción de marcador
        </Typography>

        {!result && (
          <Button
            onClick={handlePredict}
            disabled={loading}
            variant="outlined"
            startIcon={loading ? <CircularProgress size={16} /> : <SportsSoccerIcon />}
            sx={{
              "&:hover": { borderColor: FIFA.royalBlue, color: FIFA.royalBlue },
            }}
          >
            {loading ? "Simulando..." : "Calcular marcador probable"}
          </Button>
        )}

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        {result && (
          <Box>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography
                variant="h2"
                sx={{ letterSpacing: "0.12em", fontWeight: 900 }}
              >
                {result.predicted_score}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                marcador más probable
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center", mb: 2 }}>
              {result.top_scores.map(({ score, probability }) => (
                <Chip
                  key={score}
                  label={`${score}  ${(probability * 100).toFixed(1)}%`}
                  size="small"
                  sx={{
                    backgroundColor: score === result.predicted_score
                      ? "rgba(230,0,0,0.12)"
                      : "rgba(0,0,0,0.04)",
                    color: score === result.predicted_score ? FIFA.red : "text.secondary",
                    border: score === result.predicted_score
                      ? `1px solid ${FIFA.red}55`
                      : "1px solid rgba(0,0,0,0.1)",
                    fontWeight: score === result.predicted_score ? 700 : 400,
                    fontFamily: "monospace",
                  }}
                />
              ))}
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", textAlign: "center", opacity: 0.5 }}
            >
              λ {homeTeam}: {result.expected_home_goals} · λ {awayTeam}: {result.expected_away_goals} ·{" "}
              {result.n_simulations.toLocaleString()} simulaciones
            </Typography>

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
          </Box>
        )}
      </CardContent>
    </Card>
  );
}