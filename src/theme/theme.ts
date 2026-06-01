import { createTheme } from "@mui/material/styles";

// =============================================================================
// Paleta oficial FIFA World Cup 2026
// =============================================================================
export const FIFA = {
  // Oscuros
  burgundy:   "#7B1A23",
  deepPurple: "#6B00B4",
  navy:       "#1C1C6E",
  darkTeal:   "#0D3D3A",

  // Vivos
  red:       "#E60000",
  lavender:  "#C8A8E8",
  royalBlue: "#3333CC",
  green:     "#00CC44",

  // Medios
  orange:  "#FF5500",
  mauve:   "#C89090",
  skyBlue: "#44AAFF",
  lime:    "#CCFF00",

  // Neon / claros
  salmon:    "#FF9977",
  hotPink:   "#E0005A",
  turquoise: "#00FFCC",
  yellow:    "#FFFF00",

  // Neutros
  black: "#000000",
  white: "#FFFFFF",
} as const;

// =============================================================================
// Tema semi dark-light
// =============================================================================
// Concepto: fondos claros con ligera tinta navy (eco del FIFA navy),
// AppBar mantiene el azul oscuro para identidad de marca,
// tarjetas blancas con sombra sutil, acentos FIFA vivos sobre fondos claros.
// =============================================================================

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main:         FIFA.red,
      dark:         FIFA.burgundy,
      light:        FIFA.salmon,
      contrastText: FIFA.white,
    },

    secondary: {
      main:         FIFA.royalBlue,
      dark:         FIFA.navy,
      light:        FIFA.skyBlue,
      contrastText: FIFA.white,
    },

    background: {
      // Tinta navy muy sutil — no es gris genérico, tiene carácter
      default: "#EEF0F8",
      paper:   "#FFFFFF",
    },

    text: {
      primary:   "#0F1124",  // Near-black con tinte navy
      secondary: "#5A5E7A",  // Gris-azulado medio
    },

    divider: "rgba(0,0,0,0.08)",

    success: { main: "#009933" },  // Verde más oscuro para legibilidad en blanco
    warning: { main: FIFA.orange },
    info:    { main: FIFA.royalBlue },
    error:   { main: FIFA.hotPink },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: { fontWeight: 900, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },

    button: {
      fontWeight:      700,
      letterSpacing:   "0.05em",
      textTransform:   "uppercase",
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    // ── Cards ──────────────────────────────────────────────────────────────
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border:    "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 6px rgba(15,17,36,0.06)",
        },
      },
    },

    // ── Buttons ────────────────────────────────────────────────────────────
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: "10px 24px",
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            background: `linear-gradient(135deg, ${FIFA.red} 0%, ${FIFA.burgundy} 100%)`,
            color:      FIFA.white,
            "&:hover": {
              background: `linear-gradient(135deg, ${FIFA.burgundy} 0%, ${FIFA.red} 100%)`,
            },
          },
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            background: `linear-gradient(135deg, ${FIFA.royalBlue} 0%, ${FIFA.navy} 100%)`,
            color:      FIFA.white,
            "&:hover": {
              background: `linear-gradient(135deg, ${FIFA.navy} 0%, ${FIFA.royalBlue} 100%)`,
            },
          },
        },
      ],
    },

    // ── AppBar — siempre oscuro independientemente del modo ────────────────
    // El header mantiene identidad de marca FIFA incluso en tema claro.
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage:  "none",
          backgroundColor:  FIFA.navy,
          color:            FIFA.white,
          borderBottom:     "none",
          boxShadow:        "0 2px 12px rgba(15,17,36,0.18)",
        },
      },
    },

    // ── Chips ──────────────────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },

    // ── LinearProgress ─────────────────────────────────────────────────────
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height:       8,
          backgroundColor: "rgba(0,0,0,0.08)",
        },
      },
    },

    // ── Tables ─────────────────────────────────────────────────────────────
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border:    "1px solid rgba(0,0,0,0.08)",
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#F4F5FC",
            color:           "#5A5E7A",
            fontWeight:      700,
            borderBottom:    "2px solid rgba(0,0,0,0.1)",
          },
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(230,0,0,0.04)",
          },
          "&:last-child td": {
            borderBottom: 0,
          },
        },
      },
    },

    // ── Paper ──────────────────────────────────────────────────────────────
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    // ── TextField ──────────────────────────────────────────────────────────
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: FIFA.white,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: FIFA.royalBlue,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: FIFA.red,
          },
        },
        notchedOutline: {
          borderColor: "rgba(0,0,0,0.15)",
        },
      },
    },

    // ── Tabs ───────────────────────────────────────────────────────────────
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: FIFA.red,
          height: 3,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: "#5A5E7A",
          "&.Mui-selected": {
            color:      FIFA.red,
            fontWeight: 700,
          },
        },
      },
    },
  },
});

export default theme;