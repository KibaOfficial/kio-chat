"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

type KioToastTheme = "aurora" | "glass" | "neon" | "classic" | undefined;

const themeStyles: Record<string, React.CSSProperties> = {
  aurora: {
    background: "linear-gradient(90deg, #1e3a8a99 0%, #6d28d999 50%, #05966999 100%)",
    color: "#e0f2fe",
    border: "1px solid #60a5fa66",
    boxShadow: "0 4px 32px 0 #312e81cc",
    backdropFilter: "blur(12px)",
  },
  glass: {
    background: "rgba(30,41,59,0.7)",
    color: "#6ee7b7",
    border: "1px solid #33415599",
    boxShadow: "0 4px 24px 0 #334155cc",
    backdropFilter: "blur(16px)",
  },
  neon: {
    background: "#0f172a",
    color: "#7dd3fc",
    border: "1px solid #a78bfa99",
    boxShadow: "0 0 16px 2px #6366f1cc",
    backdropFilter: "blur(8px)",
  },
  classic: {
    background: "#1e293b",
    color: "#fff",
    border: "1px solid #334155",
    boxShadow: "0 2px 8px 0 #0008",
    backdropFilter: "blur(4px)",
  },
};

interface KioToasterProps extends ToasterProps {
  kioTheme?: KioToastTheme;
}

const Toaster = ({ kioTheme, ...props }: KioToasterProps) => {
  const { theme = "system" } = useTheme();
  const style = kioTheme ? themeStyles[kioTheme] : {
    "--normal-bg": "var(--popover)",
    "--normal-text": "var(--popover-foreground)",
    "--normal-border": "var(--border)",
  };
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={`toaster group ${kioTheme ? `kio-toast-${kioTheme}` : ""}`}
      style={style as React.CSSProperties}
      {...props}
    />
  );
};

export { Toaster }
