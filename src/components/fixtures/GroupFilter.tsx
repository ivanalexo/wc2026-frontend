"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { FIFA } from "@/theme/theme";

const GROUPS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
] as const;

interface GroupFilterProps {
  currentGroup: string | null;
  matchCounts: Record<string, number>;
}

export default function GroupFilter({
  currentGroup,
  matchCounts,
}: GroupFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (group: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (group) {
      params.set("group", group);
    } else {
      params.delete("group");
    }
    router.push(`/fixtures?${params.toString()}`);
  };

  const btnSx = (active: boolean) => ({
    minWidth: 44,
    height: 36,
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: "0.06em",
    borderRadius: 1,
    border: "1px solid",
    borderColor: active ? FIFA.red : "rgba(0,0,0,0.18)",
    color: active ? FIFA.red : "text.secondary",
    backgroundColor: active ? "rgba(230,0,0,0.06)" : "transparent",
    "&:hover": {
      borderColor: FIFA.red,
      color: FIFA.red,
      backgroundColor: "rgba(230,0,0,0.05)",
    },
    transition: "all 0.15s",
  });

  return (
    <Box
      sx={{
        display: "flex",
        gap: 0.75,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Button onClick={() => navigate(null)} sx={btnSx(!currentGroup)}>
        Todos
      </Button>

      <Box
        sx={{
          width: 1,
          height: 24,
          backgroundColor: "rgba(0,0,0,0.12)",
          mx: 0.5,
        }}
      />

      {GROUPS.map((g) => (
        <Button
          key={g}
          onClick={() => navigate(g)}
          sx={btnSx(currentGroup === g)}
        >
          {g}
          {matchCounts[g] !== undefined && (
            <Box
              component="span"
              sx={{
                ml: 0.5,
                fontSize: "0.6rem",
                opacity: 0.6,
                fontWeight: 400,
              }}
            >
              ({matchCounts[g]})
            </Box>
          )}
        </Button>
      ))}
    </Box>
  );
}
