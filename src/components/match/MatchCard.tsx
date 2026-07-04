import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Match } from "@/lib/types";
import { FIFA } from "@/theme/theme";
import ProbabilityBar from "@/components/shared/ProbabilityBar";
import LinkButton from "@/components/shared/LinkButton";
import Image from "next/image";
import { getFlagUrl } from "@/lib/flagCodes";
import { teamDisplay } from "@/lib/slotLabel";
import { MatchDateTimeShort } from "@/components/shared/MatchDateTime";
import { isPredictionCorrect, winnerName } from "@/lib/predictionResult";

interface MatchCardProps {
  match: Match;
}

function TeamSide({ team, slot }: { team: string | null; slot: string | null }) {
  const name = teamDisplay(team, slot);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      {team ? (
        <Image src={getFlagUrl(team, 40) as string} alt={team} width={20} height={15} />
      ) : (
        <Box
          sx={{
            width: 20,
            height: 15,
            borderRadius: 0.5,
            backgroundColor: "rgba(0,0,0,0.06)",
            border: "1px dashed rgba(0,0,0,0.2)",
          }}
        />
      )}
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          lineHeight: 1.2,
          fontWeight: team ? 700 : 500,
          color: team ? "text.primary" : "text.secondary",
          fontStyle: team ? "normal" : "italic",
        }}
      >
        {name}
      </Typography>
    </Box>
  );
}

export default function MatchCard({ match }: MatchCardProps) {
  const finished = match.status === "finished";
  const hasScore = match.home_score !== null && match.away_score !== null;
  const resolved = match.home_team !== null && match.away_team !== null;
  const correct = finished ? isPredictionCorrect(match) : null;
  const winner = finished ? winnerName(match) : null;

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
          gap: 0.5,
        }}
      >
        {match.group && (
          <Chip
            label={`Grupo ${match.group}`}
            size="small"
            sx={{
              backgroundColor: "rgba(51,51,204,0.1)",
              color: FIFA.royalBlue,
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

        {finished && (
          <Chip
            label="Finalizado"
            size="small"
            sx={{
              backgroundColor: "rgba(0,0,0,0.06)",
              color: "text.secondary",
              fontWeight: 700,
              fontSize: "0.6rem",
              height: 18,
            }}
          />
        )}

        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
          <MatchDateTimeShort dateStr={match.date} />
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 1,
          mb: 1.5,
        }}
      >
        <TeamSide team={match.home_team} slot={match.home_slot} />

        <Box sx={{ textAlign: "center", px: 1 }}>
          {hasScore ? (
            <Typography variant="h6" sx={{ lineHeight: 1, fontWeight: 900 }}>
              {match.home_score} — {match.away_score}
            </Typography>
          ) : (
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: "0.1em" }}
            >
              VS
            </Typography>
          )}
        </Box>

        <TeamSide team={match.away_team} slot={match.away_slot} />
      </Box>

      {match.city && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mb: 1.5, opacity: 0.6 }}
        >
          📍 {match.city}
        </Typography>
      )}

      {finished && match.prediction && hasScore && winner !== null && (
        <Box
          sx={{
            mt: 0.5,
            pt: 0.75,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.4,
          }}
        >
          {correct ? (
            <Typography variant="caption" sx={{ color: "success.main", fontWeight: 700, fontSize: "0.7rem" }}>
              ✓ Modelo acertó · {winner}
            </Typography>
          ) : (
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, fontSize: "0.7rem", opacity: 0.65 }}>
              Modelo no acertó · ganó {winner}
            </Typography>
          )}
        </Box>
      )}

      {match.prediction && !finished && match.home_team && match.away_team && (
        <ProbabilityBar
          pHome={match.prediction.p_home_win}
          pDraw={match.prediction.p_draw}
          pAway={match.prediction.p_away_win}
          homeLabel={match.home_team}
          awayLabel={match.away_team}
          height={6}
        />
      )}
    </>
  );

  return (
    <Card
      sx={{
        transition: "border-color 0.2s, transform 0.2s",
        maxHeight: "100%",
        "&:hover": {
          borderColor: `rgba(230,0,0,0.4)`,
          transform: "translateY(-2px)",
        },
      }}
    >
      {resolved ? (
        <CardActionArea component={LinkButton} href={`/fixtures/${match.id}`} sx={{ p: 2 }}>
          {content}
        </CardActionArea>
      ) : (
        // Sin equipos definidos no hay detalle/predicción que mostrar: card estática.
        <Box sx={{ p: 2 }}>{content}</Box>
      )}
    </Card>
  );
}
