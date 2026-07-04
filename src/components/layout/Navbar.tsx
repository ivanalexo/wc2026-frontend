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
import { FIFA } from "@/theme/theme";
import Image from "next/image";
import fifaLogo from "../../../public/images/fifa-logo.png";

const NAV_LINKS = [
  { label: "Partidos", href: "/fixtures" },
  { label: "Llave", href: "/bracket" },
  { label: "Grupos", href: "/groups" },
  { label: "Equipos", href: "/teams" },
  { label: "Predictor", href: "/predict" },
  { label: "Simulación", href: "/simulate" },
] as const;

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
        sx={{ backdropFilter: "blur(12px)" }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 }, height: 64 }}>
          <NextLink
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Image src={fifaLogo} alt="FIFA 2026" width={65} height={65} />
          </NextLink>

          <Box sx={{ flex: 1 }} />

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

          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
              color: FIFA.white,
              ml: 1,
            }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 260,
              backgroundColor: "background.paper",
              borderLeft: `1px solid rgba(0,0,0,0.08)`,
            },
          },
        }}
      >
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
            <Image src={fifaLogo} alt="FIFA 2026" width={65} height={65} />
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            size="small"
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider />

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
                    ? `3px solid ${FIFA.red}`
                    : "3px solid transparent",
                  backgroundColor: isActive(href)
                    ? "rgba(230,0,0,0.06)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.04)",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: isActive(href) ? 700 : 400,
                        color: isActive(href)
                          ? "text.primary"
                          : "text.secondary",
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
