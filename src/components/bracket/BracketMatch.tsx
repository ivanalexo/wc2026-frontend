import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Match } from "@/lib/types";
import { getFlagUrl } from "@/lib/flagCodes";
import { teamDisplay } from "@/lib/slotLabel";

function Side({
  team,
  slot,
  score,
  win,
  finished,
}: {
  team: string | null;
  slot: string | null;
  score: number | null;
  win: boolean;
  finished: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.75,
        px: 1,
        py: 0.5,
        opacity: finished && !win ? 0.5 : 1,
        backgroundColor: win ? "rgba(0,153,51,0.08)" : "transparent",
      }}
    >
      {team ? (
        <Image src={getFlagUrl(team, 40) as string} alt={team} width={18} height={13} />
      ) : (
        <Box
          sx={{
            width: 18,
            height: 13,
            borderRadius: 0.3,
            backgroundColor: "rgba(0,0,0,0.06)",
            border: "1px dashed rgba(0,0,0,0.2)",
          }}
        />
      )}
      <Typography
        noWrap
        sx={{
          flex: 1,
          fontWeight: win ? 800 : 600,
          fontStyle: team ? "normal" : "italic",
          color: team ? "text.primary" : "text.secondary",
          fontSize: "0.72rem",
          lineHeight: 1.3,
        }}
      >
        {teamDisplay(team, slot)}
      </Typography>
      {finished && score !== null && (
        <Typography sx={{ fontWeight: 800, fontSize: "0.72rem" }}>{score}</Typography>
      )}
    </Box>
  );
}

export default function BracketMatch({ match }: { match: Match }) {
  const finished = match.status === "finished";
  const hs = match.home_score;
  const as = match.away_score;

  let homeWin = false;
  let awayWin = false;
  if (finished && hs !== null && as !== null) {
    if (hs > as) homeWin = true;
    else if (as > hs) awayWin = true;
    else if (match.winner === "HOME") homeWin = true;
    else if (match.winner === "AWAY") awayWin = true;
  }

  return (
    <Box
      sx={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 1,
        backgroundColor: "background.paper",
        overflow: "hidden",
        width: "100%",
        "& > *:first-of-type": { borderBottom: "1px solid rgba(0,0,0,0.07)" },
      }}
    >
      <Side team={match.home_team} slot={match.home_slot} score={hs} win={homeWin} finished={finished} />
      <Side team={match.away_team} slot={match.away_slot} score={as} win={awayWin} finished={finished} />
    </Box>
  );
}
