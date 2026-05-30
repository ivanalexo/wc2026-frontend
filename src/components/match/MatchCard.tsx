import NextLink from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Match } from "@/lib/types";
import { FIFA } from "@/theme/theme";
import ProbabilityBar from "@/components/shared/ProbabilityBar";
import LinkButton from "@/components/shared/LinkButton";

interface MatchCardProps {
  match: Match;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("es", { day: "2-digit", month: "short" }),
    time: date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const { day, time } = formatDate(match.date);
  const hasScore = match.home_score !== null && match.away_score !== null;

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #141414 0%, #0F0F0F 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "border-color 0.2s, transform 0.2s",
        "&:hover": {
          borderColor: `rgba(230,0,0,0.4)`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardActionArea
        component={LinkButton}
        href={`/fixtures/${match.id}`}
        sx={{ p: 2 }}
      >
        {/* Header: grupo + fecha */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          {match.group && (
            <Chip
              label={`Grupo ${match.group}`}
              size="small"
              sx={{
                backgroundColor: "rgba(204,255,0,0.1)",
                color: FIFA.lime,
                fontWeight: 700,
                fontSize: "0.65rem",
                letterSpacing: "0.08em",
                height: 20,
              }}
            />
          )}
          {match.stage && !match.group && (
            <Chip
              label={match.stage}
              size="small"
              sx={{
                backgroundColor: "rgba(230,0,0,0.12)",
                color: FIFA.red,
                fontWeight: 700,
                fontSize: "0.65rem",
                height: 20,
              }}
            />
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ ml: "auto" }}
          >
            {day} · {time}
          </Typography>
        </Box>

        {/* Equipos y marcador */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
          }}
        >
          {/* Home */}
          <Typography
            variant="body2"
            sx={{ textAlign: "right", lineHeight: 1.2, fontWeight: 700 }}
          >
            {match.home_team}
          </Typography>

          {/* Marcador o VS */}
          <Box sx={{ textAlign: "center", px: 1 }}>
            {hasScore ? (
              <Typography
                variant="h6"
                sx={{ color: FIFA.white, lineHeight: 1, fontWeight: 900 }}
              >
                {match.home_score} — {match.away_score}
              </Typography>
            ) : (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                VS
              </Typography>
            )}
          </Box>

          {/* Away */}
          <Typography
            variant="body2"
            sx={{ textAlign: "left", lineHeight: 1.2, fontWeight: 700 }}
          >
            {match.away_team}
          </Typography>
        </Box>

        {/* Ciudad */}
        {match.city && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center", mb: 1.5, opacity: 0.6 }}
          >
            📍 {match.city}
          </Typography>
        )}

        {/* Probability bar */}
        {match.prediction && !hasScore && (
          <ProbabilityBar
            pHome={match.prediction.p_home_win}
            pDraw={match.prediction.p_draw}
            pAway={match.prediction.p_away_win}
            homeLabel={match.home_team}
            awayLabel={match.away_team}
            height={6}
          />
        )}
      </CardActionArea>
    </Card>
  );
}