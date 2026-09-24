"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ColorTheme,
  FontPairing,
  COLOR_THEMES,
  FONT_PAIRINGS,
  DEFAULT_THEME_ID,
  DEFAULT_FONT_ID,
  applyThemeToDocument,
} from "@/lib/theme";

interface ThemeContextType {
  currentTheme: ColorTheme;
  currentFont: FontPairing;
  themeId: string;
  fontId: string;
  setThemeId: (id: string) => void;
  setFontId: (id: string) => void;
  resetDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_THEME_KEY = "quickplot_theme_id";
const STORAGE_FONT_KEY = "quickplot_font_id";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(DEFAULT_THEME_ID);
  const [fontId, setFontIdState] = useState<string>(DEFAULT_FONT_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
    const savedFont = localStorage.getItem(STORAGE_FONT_KEY);

    const initialTheme = savedTheme && COLOR_THEMES[savedTheme] ? savedTheme : DEFAULT_THEME_ID;
    const initialFont = savedFont && FONT_PAIRINGS[savedFont] ? savedFont : DEFAULT_FONT_ID;

    setThemeIdState(initialTheme);
    setFontIdState(initialFont);
    setMounted(true);

    applyThemeToDocument(COLOR_THEMES[initialTheme], FONT_PAIRINGS[initialFont]);
  }, []);

  const setThemeId = (id: string) => {
    if (COLOR_THEMES[id]) {
      setThemeIdState(id);
      localStorage.setItem(STORAGE_THEME_KEY, id);
      applyThemeToDocument(COLOR_THEMES[id], FONT_PAIRINGS[fontId]);
    }
  };

  const setFontId = (id: string) => {
    if (FONT_PAIRINGS[id]) {
      setFontIdState(id);
      localStorage.setItem(STORAGE_FONT_KEY, id);
      applyThemeToDocument(COLOR_THEMES[themeId], FONT_PAIRINGS[id]);
    }
  };

  const resetDefaults = () => {
    setThemeIdState(DEFAULT_THEME_ID);
    setFontIdState(DEFAULT_FONT_ID);
    localStorage.removeItem(STORAGE_THEME_KEY);
    localStorage.removeItem(STORAGE_FONT_KEY);
    applyThemeToDocument(COLOR_THEMES[DEFAULT_THEME_ID], FONT_PAIRINGS[DEFAULT_FONT_ID]);
  };

  const currentTheme = COLOR_THEMES[themeId] || COLOR_THEMES[DEFAULT_THEME_ID];
  const currentFont = FONT_PAIRINGS[fontId] || FONT_PAIRINGS[DEFAULT_FONT_ID];

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        currentFont,
        themeId,
        fontId,
        setThemeId,
        setFontId,
        resetDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
