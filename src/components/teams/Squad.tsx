import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { FIFA } from "@/theme/theme";
import { Player } from "@/lib/types";

interface SquadProps {
  players: Player[];
}

const POSITION_ORDER: { keys: string[]; label: string }[] = [
  { keys: ["goalkeeper", "portero", "arquero", "gk", "por"], label: "Porteros" },
  { keys: ["defender", "defensa", "defence", "df", "def"], label: "Defensas" },
  {
    keys: ["midfielder", "mediocampista", "medio", "mf", "med", "cc"],
    label: "Mediocampistas",
  },
  {
    keys: ["forward", "delantero", "attacker", "fw", "del", "dc"],
    label: "Delanteros",
  },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

function categoryFor(position: string | null): number {
  if (!position) return POSITION_ORDER.length;
  const p = normalize(position);
  const idx = POSITION_ORDER.findIndex((c) =>
    c.keys.some((k) => p.includes(k)),
  );
  return idx === -1 ? POSITION_ORDER.length : idx;
}

export default function Squad({ players }: SquadProps) {
  const groups = new Map<number, Player[]>();
  for (const player of players) {
    const cat = categoryFor(player.position);
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(player);
  }

  const orderedCats = [...groups.keys()].sort((a, b) => a - b);

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            Plantilla convocada
          </Typography>
          <Chip
            label={`${players.length} jugadores`}
            size="small"
            sx={{
              backgroundColor: "rgba(230,0,0,0.08)",
              color: FIFA.red,
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {orderedCats.map((cat) => {
            const label = POSITION_ORDER[cat]?.label ?? "Otros";
            const groupPlayers = [...groups.get(cat)!].sort(
              (a, b) =>
                (a.number ?? 99) - (b.number ?? 99) ||
                a.name.localeCompare(b.name),
            );

            return (
              <Box key={cat}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                  }}
                >
                  {label}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    mt: 1,
                  }}
                >
                  {groupPlayers.map((player) => (
                    <Box
                      key={player.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1,
                        borderRadius: 1,
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.03)" },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          width: 24,
                          textAlign: "center",
                          fontWeight: 800,
                          color: "text.secondary",
                          flexShrink: 0,
                        }}
                      >
                        {player.number ?? "–"}
                      </Typography>

                      <Avatar
                        src={player.photo_url ?? undefined}
                        alt={player.name}
                        sx={{ width: 32, height: 32, flexShrink: 0 }}
                      >
                        {player.name.slice(0, 1).toUpperCase()}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, lineHeight: 1.2 }}
                          noWrap
                        >
                          {player.name}
                        </Typography>
                        {player.club && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{ display: "block" }}
                          >
                            {player.club}
                          </Typography>
                        )}
                      </Box>

                      {player.age != null && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ flexShrink: 0 }}
                        >
                          {player.age} años
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
