import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import Image from "next/image";
import fifaLogo from "../../../public/images/fifa-logo.png"

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        backgroundColor: "background.paper",
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

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.75,
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ letterSpacing: "0.12em", lineHeight: 1, fontWeight: 600 }}
          >
            Contactos
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Link
              href="https://www.linkedin.com/in/ivan-omonte-carreno/"
              target="_blank"
              rel="noopener"
              color="text.secondary"
              aria-label="LinkedIn"
              sx={{
                display: "inline-flex",
                transition: "color 0.2s ease, transform 0.2s ease",
                "&:hover": { color: "primary.main", transform: "translateY(-2px)" },
              }}
            >
              <LinkedInIcon fontSize="small" />
            </Link>
            <Link
              href="https://www.instagram.com/ivanalexo/"
              target="_blank"
              rel="noopener"
              color="text.secondary"
              aria-label="Instagram"
              sx={{
                display: "inline-flex",
                transition: "color 0.2s ease, transform 0.2s ease",
                "&:hover": { color: "primary.main", transform: "translateY(-2px)" },
              }}
            >
              <InstagramIcon fontSize="small" />
            </Link>
            <Link
              href="mailto:ivanalex.oc@gmail.com"
              color="text.secondary"
              aria-label="Correo"
              sx={{
                display: "inline-flex",
                transition: "color 0.2s ease, transform 0.2s ease",
                "&:hover": { color: "primary.main", transform: "translateY(-2px)" },
              }}
            >
              <EmailIcon fontSize="small" />
            </Link>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ letterSpacing: "0.04em", textAlign: "center", opacity: 0.8 }}
          >
            © Iván Omonte — All rights reserved 2026
          </Typography>
        </Box>

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