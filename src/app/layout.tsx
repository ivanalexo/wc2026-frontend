import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Box from "@mui/material/Box";
import ThemeRegistry from "@/components/ThemeRegistry";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "WC 2026 Predictor",
    template: "%s · WC 2026",
  },
  description: "Predicciones del Mundial FIFA 2026 con Machine Learning, XGBoost y Monte Carlo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className} style={{ margin: 0 }}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
        <ThemeRegistry>
          {/* Flex column para que el footer quede al fondo */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: "background.default",
            }}
          >
            <Navbar />

            {/* Contenido principal — crece para empujar el footer */}
            <Box component="main" sx={{ flex: 1 }}>
              {children}
            </Box>

            <Footer />
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}