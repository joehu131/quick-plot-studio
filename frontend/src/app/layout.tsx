import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Inter,
  Space_Grotesk,
  JetBrains_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Lora,
  Outfit,
  Fira_Code,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QuickPlot Studio - AI-Powered Analytics & Seaborn Visualization",
  description: "Transform raw CSV datasets into publication-ready charts instantly with Google Gemini & Seaborn.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariables = [
    plusJakarta.variable,
    inter.variable,
    spaceGrotesk.variable,
    jetbrainsMono.variable,
    ibmPlexSans.variable,
    ibmPlexMono.variable,
    lora.variable,
    outfit.variable,
    firaCode.variable,
  ].join(" ");

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-body bg-surface text-text-main antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
