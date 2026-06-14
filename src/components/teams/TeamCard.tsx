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

const ELO_MAX = 2200;
const ELO_MIN = 1400;

export default function TeamCard({
  name,
  slug,
  group,
  elo,
  pChampion,
}: TeamCardProps) {
  const flagUrl = getFlagUrl(name, 160);
  const eloWidth = elo ? ((elo - ELO_MIN) / (ELO_MAX - ELO_MIN)) * 100 : 0;
  const champPct = pChampion ? (pChampion * 100).toFixed(1) : null;

  return (
    <Card
      sx={{
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
        sx={{
          p: 2.5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          {flagUrl ? (
            <Image
              src={flagUrl}
              alt={`Bandera de ${name}`}
              width={80}
              height={54}
              style={{
                objectFit: "cover",
                borderRadius: 4,
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            />
          ) : (
            <Box
              sx={{
                width: 80,
                height: 54,
                borderRadius: 1,
                backgroundColor: "rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {name.slice(0, 2).toUpperCase()}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
            width: "100%",
          }}
        >
          <Typography
            variant="body1"
            sx={{ flex: 1, lineHeight: 1.2, fontWeight: 700 }}
          >
            {name}
          </Typography>
          {group && (
            <Chip
              label={group}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 800,
                backgroundColor: "rgba(51,51,204,0.1)",
                color: FIFA.royalBlue,
                border: `1px solid ${FIFA.royalBlue}44`,
                letterSpacing: "0.06em",
              }}
            />
          )}
        </Box>

        {elo && (
          <Box sx={{ width: "100%", mb: 1.5 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ELO
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.7rem", fontWeight: 700 }}
              >
                {Math.round(elo).toLocaleString("en-US")}
              </Typography>
            </Box>
            <Box
              sx={{
                height: 3,
                borderRadius: 2,
                backgroundColor: "rgba(0,0,0,0.07)",
              }}
            >
              <Box
                sx={{
                  width: `${Math.min(eloWidth, 100)}%`,
                  height: "100%",
                  borderRadius: 2,
                  backgroundColor: FIFA.skyBlue,
                }}
              />
            </Box>
          </Box>
        )}

        {champPct && (
          <Box
            sx={{
              mt: "auto",
              pt: 1.5,
              borderTop: "1px solid rgba(0,0,0,0.08)",
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography
                variant="h6"
                sx={{ color: FIFA.red, fontWeight: 900 }}
              >
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
