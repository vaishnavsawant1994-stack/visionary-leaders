"use client";

import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  useEffect(() => {
    const body = document.body;

    body.classList.remove("light", "dark", "corporate");
    body.classList.add(theme);
  }, [theme]);

  return <main className="app-wrapper">{children}</main>;
}