export interface ColorTheme {
  id: string;
  name: string;
  category: "viridis" | "magma" | "cividis" | "neutral" | "creative";
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBorder: string;
  primaryForeground: string;
  surface: string;
  surfaceCard: string;
  surfaceBorder: string;
  textMain: string;
  textMuted: string;
  ring: string;
  description: string;
}

export interface FontPairing {
  id: string;
  name: string;
  headingFamily: string;
  bodyFamily: string;
  codeFamily: string;
  headingName: string;
  bodyName: string;
  codeName: string;
  description: string;
}

export const COLOR_THEMES: Record<string, ColorTheme> = {
  viridis: {
    id: "viridis",
    name: "Viridis Teal",
    category: "viridis",
    primary: "#0D9488",
    primaryHover: "#0F766E",
    primaryLight: "rgba(13, 148, 136, 0.08)",
    primaryBorder: "rgba(13, 148, 136, 0.25)",
    primaryForeground: "#FFFFFF",
    surface: "#F8FAFA",
    surfaceCard: "#FFFFFF",
    surfaceBorder: "#E2E8F0",
    textMain: "#0F172A",
    textMuted: "#64748B",
    ring: "#0D9488",
    description: "Scientific teal and emerald accents inspired by the Viridis color scale",
  },
  magma: {
    id: "magma",
    name: "Magma Flame",
    category: "magma",
    primary: "#E11D48",
    primaryHover: "#BE123C",
    primaryLight: "rgba(225, 29, 72, 0.08)",
    primaryBorder: "rgba(225, 29, 72, 0.25)",
    primaryForeground: "#FFFFFF",
    surface: "#FAF9FB",
    surfaceCard: "#FFFFFF",
    surfaceBorder: "#E4E4E7",
    textMain: "#18181B",
    textMuted: "#71717A",
    ring: "#E11D48",
    description: "Deep rose and coral accents inspired by the Magma color map",
  },
  cividis: {
    id: "cividis",
    name: "Cividis Ocean",
    category: "cividis",
    primary: "#2563EB",
    primaryHover: "#1D4ED8",
    primaryLight: "rgba(37, 99, 235, 0.08)",
    primaryBorder: "rgba(37, 99, 235, 0.25)",
    primaryForeground: "#FFFFFF",
    surface: "#F8FAFC",
    surfaceCard: "#FFFFFF",
    surfaceBorder: "#E2E8F0",
    textMain: "#0F172A",
    textMuted: "#64748B",
    ring: "#2563EB",
    description: "Precision cobalt blue and slate inspired by the Cividis palette",
  },
  terracotta: {
    id: "terracotta",
    name: "Warm Ochre",
    category: "creative",
    primary: "#D97706",
    primaryHover: "#B45309",
    primaryLight: "rgba(217, 119, 6, 0.08)",
    primaryBorder: "rgba(217, 119, 6, 0.25)",
    primaryForeground: "#FFFFFF",
    surface: "#FBFBFA",
    surfaceCard: "#FFFFFF",
    surfaceBorder: "#E7E5E4",
    textMain: "#1C1917",
    textMuted: "#78716C",
    ring: "#D97706",
    description: "Warm amber and terracotta studio palette",
  },
  nordic: {
    id: "nordic",
    name: "Nordic Mint",
    category: "neutral",
    primary: "#059669",
    primaryHover: "#047857",
    primaryLight: "rgba(5, 150, 105, 0.08)",
    primaryBorder: "rgba(5, 150, 105, 0.25)",
    primaryForeground: "#FFFFFF",
    surface: "#F6FAF8",
    surfaceCard: "#FFFFFF",
    surfaceBorder: "#E2E8F0",
    textMain: "#0F172A",
    textMuted: "#64748B",
    ring: "#059669",
    description: "Crisp pine and sage green tones with serene neutral surfaces",
  },
  obsidian: {
    id: "obsidian",
    name: "Obsidian Slate",
    category: "neutral",
    primary: "#18181B",
    primaryHover: "#27272A",
    primaryLight: "rgba(24, 24, 27, 0.06)",
    primaryBorder: "rgba(24, 24, 27, 0.20)",
    primaryForeground: "#FFFFFF",
    surface: "#FAFAFA",
    surfaceCard: "#FFFFFF",
    surfaceBorder: "#E4E4E7",
    textMain: "#09090B",
    textMuted: "#71717A",
    ring: "#18181B",
    description: "Minimalist graphite and titanium monochrome styling",
  },
};

export const FONT_PAIRINGS: Record<string, FontPairing> = {
  "modern-product": {
    id: "modern-product",
    name: "Modern Product",
    headingFamily: "var(--font-plus-jakarta), sans-serif",
    bodyFamily: "var(--font-plus-jakarta), sans-serif",
    codeFamily: "var(--font-jetbrains-mono), monospace",
    headingName: "Plus Jakarta Sans",
    bodyName: "Plus Jakarta Sans",
    codeName: "JetBrains Mono",
    description: "Contemporary, clean product aesthetic with balanced typography",
  },
  "tech-minimal": {
    id: "tech-minimal",
    name: "Technical Minimalist",
    headingFamily: "var(--font-space-grotesk), sans-serif",
    bodyFamily: "var(--font-inter), sans-serif",
    codeFamily: "var(--font-jetbrains-mono), monospace",
    headingName: "Space Grotesk",
    bodyName: "Inter",
    codeName: "JetBrains Mono",
    description: "Architectural geometric headers with structured, neutral UI text",
  },
  "swiss": {
    id: "swiss",
    name: "Clean Swiss",
    headingFamily: "var(--font-ibm-plex-sans), sans-serif",
    bodyFamily: "var(--font-ibm-plex-sans), sans-serif",
    codeFamily: "var(--font-ibm-plex-mono), monospace",
    headingName: "IBM Plex Sans",
    bodyName: "IBM Plex Sans",
    codeName: "IBM Plex Mono",
    description: "Authoritative engineered typography with distinctive technical hierarchy",
  },
  "editorial-serif": {
    id: "editorial-serif",
    name: "Editorial Serif",
    headingFamily: "var(--font-lora), Georgia, serif",
    bodyFamily: "var(--font-inter), sans-serif",
    codeFamily: "var(--font-fira-code), monospace",
    headingName: "Lora Serif",
    bodyName: "Inter",
    codeName: "Fira Code",
    description: "Publishing and consulting report feel with refined serif titles",
  },
  "geometric": {
    id: "geometric",
    name: "Modern Geometric",
    headingFamily: "var(--font-outfit), sans-serif",
    bodyFamily: "var(--font-plus-jakarta), sans-serif",
    codeFamily: "var(--font-jetbrains-mono), monospace",
    headingName: "Outfit",
    bodyName: "Plus Jakarta Sans",
    codeName: "JetBrains Mono",
    description: "High-clarity geometric headings with highly legible UI controls",
  },
};

export const DEFAULT_THEME_ID = "obsidian";
export const DEFAULT_FONT_ID = "swiss";

export function applyThemeToDocument(theme: ColorTheme, font: FontPairing) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Colors
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-hover", theme.primaryHover);
  root.style.setProperty("--primary-light", theme.primaryLight);
  root.style.setProperty("--primary-border", theme.primaryBorder);
  root.style.setProperty("--primary-foreground", theme.primaryForeground);
  root.style.setProperty("--surface", theme.surface);
  root.style.setProperty("--surface-card", theme.surfaceCard);
  root.style.setProperty("--surface-border", theme.surfaceBorder);
  root.style.setProperty("--text-main", theme.textMain);
  root.style.setProperty("--text-muted", theme.textMuted);
  root.style.setProperty("--ring", theme.ring);

  // Typography Families
  root.style.setProperty("--font-heading-family", font.headingFamily);
  root.style.setProperty("--font-body-family", font.bodyFamily);
  root.style.setProperty("--font-code-family", font.codeFamily);
}
