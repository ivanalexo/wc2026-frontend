"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { FIFA } from "@/theme/theme";

// =============================================================================
// Definición de rutas
// =============================================================================
const NAV_LINKS = [
  { label: "Partidos",   href: "/fixtures"  },
  { label: "Grupos",     href: "/groups"    },
  { label: "Equipos",    href: "/teams"     },
  { label: "Predictor",  href: "/predict"   },
  { label: "Simulación", href: "/simulate"  },
] as const;

// =============================================================================
// Navbar
// =============================================================================
export default function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(8,8,8,0.92)",
          borderBottom: `1px solid rgba(255,255,255,0.07)`,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, height: 64 }}>

          {/* Logo */}
          <NextLink href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <SportsSoccerIcon sx={{ color: FIFA.red, fontSize: 28 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                letterSpacing: "0.04em",
                color: FIFA.white,
                "& span": { color: FIFA.red },
              }}
            >
              WC<span>26</span>
            </Typography>
          </NextLink>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            {NAV_LINKS.map(({ label, href }) => (
              <Button
                key={href}
                component={NextLink}
                href={href}
                disableRipple
                sx={{
                  color: isActive(href) ? FIFA.white : "rgba(255,255,255,0.55)",
                  fontWeight: isActive(href) ? 700 : 500,
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1,
                  position: "relative",
                  transition: "color 0.2s",
                  "&:hover": {
                    color: FIFA.white,
                    backgroundColor: "rgba(255,255,255,0.06)",
                  },
                  // Indicador activo — línea inferior lime
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: isActive(href) ? "60%" : "0%",
                    height: 2,
                    backgroundColor: FIFA.lime,
                    borderRadius: 1,
                    transition: "width 0.25s ease",
                  },
                  "&:hover::after": {
                    width: "60%",
                  },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: FIFA.white, ml: 1 }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 260,
              backgroundColor: "#0D0D0D",
              borderLeft: `1px solid rgba(255,255,255,0.08)`,
            },
          },
        }}
      >
        {/* Header del drawer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SportsSoccerIcon sx={{ color: FIFA.red, fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 900 }} color={FIFA.white} component={'h6'}>
              WC<span style={{ color: FIFA.red }}>26</span>
            </Typography>
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            size="small"
            sx={{ color: "rgba(255,255,255,0.5)" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />

        <List sx={{ pt: 1 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <ListItem key={href} disablePadding>
              <ListItemButton
                component={NextLink}
                href={href}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderLeft: isActive(href)
                    ? `3px solid ${FIFA.lime}`
                    : "3px solid transparent",
                  backgroundColor: isActive(href)
                    ? "rgba(204,255,0,0.06)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: isActive(href) ? 700 : 400,
                        color: isActive(href) ? FIFA.white : "rgba(255,255,255,0.6)",
                        fontSize: "0.9rem",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {label}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}