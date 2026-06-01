import { createTheme } from "@mui/material/styles";

// =============================================================================
// Paleta oficial FIFA World Cup 2026
// =============================================================================
export const FIFA = {
  // Oscuros
  burgundy: "#7B1A23",
  deepPurple: "#6B00B4",
  navy: "#1C1C6E",
  darkTeal: "#0D3D3A",

  // Vivos
  red: "#E60000",
  lavender: "#C8A8E8",
  royalBlue: "#3333CC",
  green: "#00CC44",

  // Medios
  orange: "#FF5500",
  mauve: "#C89090",
  skyBlue: "#44AAFF",
  lime: "#CCFF00",

  // Neon / claros
  salmon: "#FF9977",
  hotPink: "#E0005A",
  turquoise: "#00FFCC",
  yellow: "#FFFF00",

  // Neutros
  black: "#000000",
  white: "#FFFFFF",
} as const;

// =============================================================================
// Tema global — dark mode con identidad FIFA 2026
// =============================================================================
const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: FIFA.red,
      dark: FIFA.burgundy,
      light: FIFA.salmon,
      contrastText: FIFA.white,
    },

    secondary: {
      main: FIFA.royalBlue,
      dark: FIFA.navy,
      light: FIFA.skyBlue,
      contrastText: FIFA.white,
    },

    background: {
      default: "#080808",
      paper: "#111111",
    },

    text: {
      primary: FIFA.white,
      secondary: "#AAAAAA",
    },

    success: {
      main: FIFA.green,
    },
    warning: {
      main: FIFA.orange,
    },
    info: {
      main: FIFA.skyBlue,
    },
    error: {
      main: FIFA.hotPink,
    },
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
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: "10px 24px",
          "&.MuiButton-containedPrimary": {
            background: `linear-gradient(135deg, ${FIFA.red} 0%, ${FIFA.burgundy} 100%)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${FIFA.burgundy} 0%, ${FIFA.red} 100%)`,
            },
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#080808",
          borderBottom: `1px solid rgba(255,255,255,0.08)`,
        },
      },
    },
  },
});

export default theme;
