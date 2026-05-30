import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { FIFA } from "@/theme/theme";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: `1px solid rgba(255,255,255,0.07)`,
        backgroundColor: "#080808",
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
        {/* Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SportsSoccerIcon sx={{ color: FIFA.red, fontSize: 18 }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, letterSpacing: "0.04em" }}
            color={FIFA.white}
            component={'body'}
          >
            WC<span style={{ color: FIFA.red }}>26</span> Predictor
          </Typography>
        </Box>

        {/* Tagline */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ letterSpacing: "0.04em", textAlign: "center" }}
        >
          Predicciones con XGBoost · Monte Carlo · SHAP
        </Typography>

        {/* Disclaimer */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ opacity: 0.5, textAlign: { xs: "center", sm: "right" } }}
        >
          No oficial · Solo académico
        </Typography>
      </Box>
    </Box>
  );
}