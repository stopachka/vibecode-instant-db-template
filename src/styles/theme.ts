export const theme = {
  colors: {
    // Primary brand colors - Airbnb inspired
    primary: "#FF385C", // Airbnb's signature red
    primaryDark: "#D10025",
    primaryLight: "#FF5A70",
    primarySubtle: "#FFF0F2",

    // Secondary colors
    secondary: "#6B7280", // Gray accent
    secondaryDark: "#4B5563",
    secondaryLight: "#9CA3AF",
    secondarySubtle: "#F3F4F6",

    // Neutral colors - Modern grays
    black: "#000000",
    white: "#FFFFFF",
    gray900: "#111827",
    gray800: "#1F2937",
    gray700: "#374151",
    gray600: "#4B5563",
    gray500: "#6B7280",
    gray400: "#9CA3AF",
    gray300: "#D1D5DB",
    gray200: "#E5E7EB",
    gray100: "#F3F4F6",
    gray50: "#F9FAFB",

    // Semantic colors
    success: "#059669",
    successLight: "#10B981",
    successSubtle: "#ECFDF5",

    warning: "#F59E0B",
    warningLight: "#FCD34D",
    warningSubtle: "#FFFBEB",

    error: "#DC2626",
    errorLight: "#EF4444",
    errorSubtle: "#FEF2F2",

    info: "#3B82F6",
    infoLight: "#60A5FA",
    infoSubtle: "#EFF6FF",

    // Background colors
    background: "#FFFFFF",
    backgroundSecondary: "#F7F7F7",
    surface: "#FFFFFF",
    surfaceHover: "#F7F7F7",
    overlay: "rgba(0, 0, 0, 0.5)",

    // Text colors
    text: "#222222",
    textSecondary: "#717171",
    textMuted: "#B0B0B0",
    textInverse: "#FFFFFF",

    // Border colors
    border: "#DDDDDD",
    borderLight: "#EBEBEB",
    borderFocus: "#222222",

    // Dark mode colors
    $backgroundDark: "#0F0F0F",
    $backgroundSecondaryDark: "#1A1A1A",
    $surfaceDark: "#1F1F1F",
    $borderDark: "#2A2A2A",
    $textDark: "#F7F7F7",
    $textSecondaryDark: "#B0B0B0",
    $textMutedDark: "#717171",
  },

  space: {
    $none: 0,
    $xs: 4,
    $sm: 8,
    $md: 16,
    $lg: 24,
    $xl: 32,
    $2xl: 48,
    $3xl: 64,
    $4xl: 80,
    $5xl: 96,
  },

  fontSizes: {
    $xs: 11,
    $sm: 13,
    $md: 15,
    $lg: 17,
    $xl: 21,
    $2xl: 26,
    $3xl: 32,
    $4xl: 38,
    $5xl: 48,
    $6xl: 60,
  },

  fontWeights: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  radii: {
    $none: 0,
    $xs: 2,
    $sm: 4,
    $md: 8,
    $lg: 12,
    $xl: 16,
    $2xl: 24,
    $3xl: 32,
    $full: 9999,
  },

  shadows: {
    $none: {
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    $xs: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      elevation: 1,
      shadowColor: "#000",
    },
    $sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      shadowColor: "#000",
    },
    $md: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
      shadowColor: "#000",
    },
    $lg: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
      shadowColor: "#000",
    },
    $xl: {
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 12,
      shadowColor: "#000",
    },
    $2xl: {
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.2,
      shadowRadius: 32,
      elevation: 16,
      shadowColor: "#000",
    },
  },

  borders: {
    $thin: {
      borderWidth: 1,
      borderStyle: "solid",
    },
    $medium: {
      borderWidth: 2,
      borderStyle: "solid",
    },
    $thick: {
      borderWidth: 4,
      borderStyle: "solid",
    },
  },

  // Button variants
  buttons: {
    primary: {
      backgroundColor: "primary",
      paddingX: "$lg",
      paddingY: 14,
      borderRadius: "$md",
      shadowColor: "primary",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    secondary: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "border",
      paddingX: "$lg",
      paddingY: 14,
      borderRadius: "$md",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    ghost: {
      backgroundColor: "transparent",
      paddingX: "$lg",
      paddingY: 14,
      borderRadius: "$md",
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: "text",
      paddingX: "$lg",
      paddingY: 14,
      borderRadius: "$md",
    },
    danger: {
      backgroundColor: "error",
      paddingX: "$lg",
      paddingY: 14,
      borderRadius: "$md",
      shadowColor: "error",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
  },

  // Text variants
  text: {
    h1: {
      fontSize: "$5xl",
      fontWeight: "bold",
      color: "text",
      lineHeight: "tight",
      letterSpacing: -1,
    },
    h2: {
      fontSize: "$4xl",
      fontWeight: "bold",
      color: "text",
      lineHeight: "tight",
      letterSpacing: -0.5,
    },
    h3: {
      fontSize: "$3xl",
      fontWeight: "semibold",
      color: "text",
      lineHeight: "tight",
    },
    h4: {
      fontSize: "$2xl",
      fontWeight: "semibold",
      color: "text",
      lineHeight: "normal",
    },
    h5: {
      fontSize: "$xl",
      fontWeight: "semibold",
      color: "text",
      lineHeight: "normal",
    },
    h6: {
      fontSize: "$lg",
      fontWeight: "semibold",
      color: "text",
      lineHeight: "normal",
    },
    body: {
      fontSize: "$md",
      color: "text",
      fontWeight: "normal",
      lineHeight: "normal",
    },
    bodyLarge: {
      fontSize: "$lg",
      color: "text",
      fontWeight: "normal",
      lineHeight: "relaxed",
    },
    bodySmall: {
      fontSize: "$sm",
      color: "textSecondary",
      fontWeight: "normal",
      lineHeight: "normal",
    },
    button: {
      fontSize: "$md",
      fontWeight: "semibold",
      textAlign: "center",
      letterSpacing: 0.5,
    },
    caption: {
      fontSize: "$xs",
      color: "textMuted",
      fontWeight: "normal",
      lineHeight: "normal",
    },
    label: {
      fontSize: "$sm",
      color: "text",
      fontWeight: "medium",
      lineHeight: "normal",
      letterSpacing: 0.25,
    },
  },

  // Layout variants
  layout: {
    container: {
      flex: 1,
      paddingX: "$md",
      backgroundColor: "background",
    },
    card: {
      backgroundColor: "surface",
      borderRadius: "$2xl",
      padding: "$lg",
      paddingY: "$lg",
      borderWidth: 1,
      borderColor: "borderLight",
    },
    cardHover: {
      backgroundColor: "surface",
      borderRadius: "$lg",
      padding: "$lg",
      borderWidth: 1,
      borderColor: "border",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  },
};
