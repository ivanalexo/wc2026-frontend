import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import fifaLogo from "../../../public/images/fifa-logo.png"

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: `1px solid rgba(255,255,255,0.07)`,
        backgroundColor: "rgba(43, 37, 37, 0.92)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Image src={fifaLogo} alt="FIFA 2026" width={65} height={65} />
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ letterSpacing: "0.04em", textAlign: "center" }}
        >
          Autor: Iván Omonte
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ opacity: 0.5, textAlign: { xs: "center", sm: "right" } }}
        >
          No oficial · Los resultados reales pueden variar, esto tiene fines académicos
        </Typography>
      </Box>
    </Box>
  );
}