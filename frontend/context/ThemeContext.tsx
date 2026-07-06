"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

/* 🎨 THEME TYPES */
export type ThemeType = "light" | "dark" | "corporate";

/* 🧠 CONTEXT TYPE */
interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

/* 🔁 THEME ORDER (for toggle cycle) */
const THEME_ORDER: ThemeType[] = [
  "light",
  "dark",
  "corporate",
];

/* 📦 DEFAULT CONTEXT */
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

/* 🌐 PROVIDER */
export const ThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setThemeState] = useState<ThemeType>("light");
  const [mounted, setMounted] = useState(false);

  /* ==============================
     LOAD THEME (localStorage / system)
  =============================== */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeType | null;

    if (savedTheme && THEME_ORDER.includes(savedTheme)) {
      setThemeState(savedTheme);
    } else {
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      setThemeState(prefersDark ? "dark" : "light");
    }

    setMounted(true);
  }, []);

  /* ==============================
     APPLY THEME TO BODY CLASS
  =============================== */
  useEffect(() => {
    if (!mounted) return;

    const body = document.body;

    // clean previous themes
    body.classList.remove("light", "dark", "corporate");

    // apply new theme
    body.classList.add(theme);

    // persist theme
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  /* ==============================
     SET THEME (manual switch)
  =============================== */
  const setTheme = (newTheme: ThemeType) => {
    if (THEME_ORDER.includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  /* ==============================
     TOGGLE LOGIC (3-theme cycle)
  =============================== */
  const toggleTheme = () => {
    setThemeState((prev) => {
      const currentIndex = THEME_ORDER.indexOf(prev);
      const nextIndex = (currentIndex + 1) % THEME_ORDER.length;
      return THEME_ORDER[nextIndex];
    });
  };

  /* ==============================
     PREVENT HYDRATION FLASH
  =============================== */
  if (!mounted) {
    return null; // avoids mismatch on SSR
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/* 🧩 CUSTOM HOOK */
export const useTheme = () => useContext(ThemeContext);