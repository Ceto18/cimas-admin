import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CIMAS | Panel Administrativo",
    template: "%s | CIMAS",
  },
  description:
    "Panel administrativo de CIMAS & Ingenieros E.I.R.L. para la gestión de proyectos, servicios, certificaciones y contenido institucional.",
  applicationName: "CIMAS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={outfit.className}>
        {children}

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              marginTop: "80px",
              borderRadius: "12px",
              padding: "14px 18px",
              fontSize: "14px",
              fontWeight: 500,
            },
            success: {
              style: {
                background: "#ECFDF3",
                color: "#027A48",
                border: "1px solid #A6F4C5",
              },
            },
            error: {
              style: {
                background: "#FEF3F2",
                color: "#B42318",
                border: "1px solid #FECDCA",
              },
            },
          }}
        />
      </body>
    </html>
  );
}