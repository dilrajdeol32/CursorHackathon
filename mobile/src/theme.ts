export const colors = {
  background: "#F5F7FA",
  foreground: "#1A2332",
  card: "#FFFFFF",
  cardForeground: "#1A2332",
  primary: "#4A90D9",
  primaryForeground: "#FFFFFF",
  secondary: "#5BA8A0",
  secondaryForeground: "#FFFFFF",
  muted: "#E8ECF1",
  mutedForeground: "#6B7A8D",
  border: "rgba(0,0,0,0.08)",
  destructive: "#E54D4D",
  success: "#4CAF7D",
  warning: "#E5A84D",
  purple: "#7B6BD9",
  chart1: "#4A90D9",
  chart2: "#5BA8A0",
  chart3: "#E5A84D",
  chart4: "#E54D4D",
  chart5: "#7B6BD9",
  statusNormalBg: "#E8F5E9",
  statusNormalText: "#2E7D32",
  statusInterruptedBg: "#FFF3E0",
  statusInterruptedText: "#E65100",
  statusHighRiskBg: "#FFEBEE",
  statusHighRiskText: "#C62828",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const fonts = {
  regular: { fontSize: 14, color: colors.foreground },
  body: { fontSize: 16, color: colors.foreground },
  h1: { fontSize: 24, fontWeight: "600" as const, color: colors.foreground },
  h3: { fontSize: 18, fontWeight: "600" as const, color: colors.foreground },
  h4: { fontSize: 16, fontWeight: "600" as const, color: colors.foreground },
  caption: { fontSize: 13, color: colors.mutedForeground },
  small: { fontSize: 11, color: colors.mutedForeground },
} as const;
