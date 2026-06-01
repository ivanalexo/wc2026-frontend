"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { FIFA } from "@/theme/theme";
import { getFlagUrl } from "@/lib/flagCodes";
import Image from "next/image";

interface TeamCardProps {
  name: string;
  slug: string;
  group: string | null;
  elo: number | null;
  pChampion: number | null;
  rank?: number;
}

// ELO máximo aproximado para escalar la barra (España ~2171)
const ELO_MAX = 2200;
const ELO_MIN = 1400;

export default function TeamCard({
  name,
  slug,
  group,
  elo,
  pChampion,
  rank,
}: TeamCardProps) {
  const flagUrl   = getFlagUrl(name, 160);
  const eloWidth  = elo ? ((elo - ELO_MIN) / (ELO_MAX - ELO_MIN)) * 100 : 0;
  const champPct  = pChampion ? (pChampion * 100).toFixed(1) : null;

  return (
    <Card
      sx={{
        background: "#111",
        border: "1px solid rgba(255,255,255,0.07)",
        transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: "rgba(230,0,0,0.35)",
          boxShadow: "0 8px 24px rgba(230,0,0,0.1)",
        },
        height: "100%",
      }}
    >
      <CardActionArea
        component={NextLink}
        href={`/teams/${slug}`}
        sx={{ p: 2.5, height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}
      >
        {/* Bandera */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {flagUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <Image
              src={flagUrl}
              alt={`Bandera de ${name}`}
              width={80}
              height={54}
              style={{
                objectFit: "cover",
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          ) : (
            <Box
              sx={{
                width: 80, height: 54, borderRadius: 1,
                backgroundColor: "rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {name.slice(0, 2).toUpperCase()}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Nombre y grupo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, width: "100%" }}>
          <Typography variant="body1" sx={{ flex: 1, lineHeight: 1.2, fontWeight: 700 }}>
            {name}
          </Typography>
          {group && (
            <Chip
              label={group}
              size="small"
              sx={{
                height: 20, fontSize: "0.65rem", fontWeight: 800,
                backgroundColor: "rgba(204,255,0,0.1)",
                color: FIFA.lime, border: `1px solid ${FIFA.lime}33`,
                letterSpacing: "0.06em",
              }}
            />
          )}
        </Box>

        {/* ELO */}
        {elo && (
          <Box sx={{ width: "100%", mb: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                ELO
              </Typography>
              <Typography variant="caption" sx={{ fontSize: "0.7rem", fontWeight: 700 }}>
                {elo.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.07)" }}>
              <Box
                sx={{
                  width: `${Math.min(eloWidth, 100)}%`,
                  height: "100%", borderRadius: 2,
                  backgroundColor: FIFA.skyBlue,
                }}
              />
            </Box>
          </Box>
        )}

        {/* Probabilidad campeón */}
        {champPct && (
          <Box sx={{ mt: "auto", pt: 1.5, borderTop: "1px solid rgba(255,255,255,0.06)", width: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography variant="h6" sx={{ color: FIFA.red, fontWeight: 900 }}>
                {champPct}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                prob. campeón
              </Typography>
            </Box>
          </Box>
        )}

      </CardActionArea>
    </Card>
  );
}