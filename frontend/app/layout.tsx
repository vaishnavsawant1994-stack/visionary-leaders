import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import ThemeWrapper from "./theme-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ================= METADATA ================= */
export const metadata: Metadata = {
  title: {
    default: "Visionary Leaders",
    template: "%s | Visionary Leaders",
  },
  description:
    "Visionary Leaders Magazine — Discover inspiring entrepreneurs, startup founders, global innovators, business leaders, and technology pioneers shaping the future.",
};

/* ================= ROOT LAYOUT ================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <ThemeWrapper>{children}</ThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}