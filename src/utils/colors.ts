import type { AIType } from "../types";

export const COLORS = {
  bg: "#F8F9FA",
  card: "#FFFFFF",
  border: "#E6E6E6",
  text: "#282728",
  textSecondary: "#666666",
  textMuted: "#999999",
  green: "#86BC25",
  greenDark: "#6B9B1E",
  greenLight: "#E8F5D6",
  teal: "#00A3E0",
  navy: "#005587",
  dark: "#282728",
  orange: "#ED8B00",
  red: "#DA291C",
  purple: "#9B59B6"
};

export const AI_COLORS: Record<Exclude<AIType, "all">, string> = {
  agentic: COLORS.green,
  generative: COLORS.teal,
  traditional: COLORS.navy,
  human: COLORS.dark
};

export function dimColor(hex: string, alpha = 0.12): string {
  const value = hex.replace("#", "");
  const bigint = Number.parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getAIColor(type: Exclude<AIType, "all">, active: AIType): string {
  if (active === "all" || active === type) {
    return AI_COLORS[type];
  }
  return dimColor(AI_COLORS[type]);
}
