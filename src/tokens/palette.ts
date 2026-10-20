export const palette = {
  primary: {
    main: "#1e6244",
    light: "#2c8a61",
    dark: "#154731",
    contrastText: "#fbfaf9",
  },
  secondary: {
    main: "#8f9a74",
    light: "#bcc2a8",
    dark: "#6a7455",
    contrastText: "#0b0f08",
  },
  accent: {
    main: "#f4ad15",
    light: "#f7c24f",
    dark: "#c98c0a",
    contrastText: "#241a03",
  },
  success: {
    main: "#2e7d32",
    light: "#e7f4e8",
    dark: "#1b5e20",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#b26a00",
    light: "#fdf0dd",
    dark: "#8a5200",
    contrastText: "#ffffff",
  },
  error: {
    main: "#b3261e",
    light: "#fbe9e7",
    dark: "#8c1d17",
    contrastText: "#ffffff",
  },
  info: {
    main: "#1a4f8b",
    light: "#e6f0fb",
    dark: "#123a66",
    contrastText: "#ffffff",
  },
  background: {
    default: "#f7f4ef",
    paper: "#ffffff",
  },
  surface: {
    sunken: "#efece5",
    base: "#fbfaf9",
    raised: "#ffffff",
    overlay: "#ffffff",
  },
  text: {
    primary: "#14100b",
    secondary: "#5c574d",
    disabled: "#9b968c",
    onPrimary: "#fbfaf9",
    onAccent: "#241a03",
  },
  divider: "#e6e1d8",
} as const;

export const paletteDark = {
  primary: {
    main: "#62a886",
    light: "#8bcfa9",
    dark: "#3e7d5e",
    contrastText: "#08130d",
  },
  secondary: {
    main: "#a9b48c",
    light: "#c6cfad",
    dark: "#7f8a63",
    contrastText: "#0b0f08",
  },
  accent: {
    main: "#f4ad15",
    light: "#f7c24f",
    dark: "#c98c0a",
    contrastText: "#241a03",
  },
  success: {
    main: "#81c784",
    light: "#122b14",
    dark: "#2e7d32",
    contrastText: "#08130d",
  },
  warning: {
    main: "#e0a542",
    light: "#2e2109",
    dark: "#b26a00",
    contrastText: "#1a1204",
  },
  error: {
    main: "#e2726b",
    light: "#2e1210",
    dark: "#b3261e",
    contrastText: "#1a0908",
  },
  info: {
    main: "#7aaede",
    light: "#0e2137",
    dark: "#1a4f8b",
    contrastText: "#08111c",
  },
  background: {
    default: "#0c0f0d",
    paper: "#262c27",
  },
  surface: {
    sunken: "#131715",
    base: "#1d221e",
    raised: "#262c27",
    overlay: "#30372f",
  },
  text: {
    primary: "#f3f1ec",
    secondary: "#b8b3a7",
    disabled: "#797469",
    onPrimary: "#08130d",
    onAccent: "#241a03",
  },
  divider: "#2c322d",
} as const;

export const paletteHalloween = {
  primary: {
    main: "#a8430a",
    light: "#cc6420",
    dark: "#7c2f05",
    contrastText: "#fffaf3",
  },
  secondary: {
    main: "#5f4682",
    light: "#8a6fb0",
    dark: "#43305e",
    contrastText: "#fffaf3",
  },
  accent: {
    main: "#f2a516",
    light: "#f7c35a",
    dark: "#c9830a",
    contrastText: "#241a03",
  },
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  info: palette.info,
  background: {
    default: "#fbf3e6",
    paper: "#fffaf3",
  },
  surface: {
    sunken: "#f4e9d8",
    base: "#fdf7ee",
    raised: "#fffaf3",
    overlay: "#fffaf3",
  },
  text: {
    primary: "#1d1422",
    secondary: "#5a4a5f",
    disabled: "#9c8e96",
    onPrimary: "#fffaf3",
    onAccent: "#241a03",
  },
  divider: "#eadcc6",
} as const;

export const paletteHalloweenDark = {
  primary: {
    main: "#ff8a1f",
    light: "#ffad5c",
    dark: "#d96a00",
    contrastText: "#1a0c02",
  },
  secondary: {
    main: "#a58bd6",
    light: "#c7b5ea",
    dark: "#7c62ad",
    contrastText: "#120b1a",
  },
  accent: {
    main: "#a3e35b",
    light: "#c4f08d",
    dark: "#7cb83a",
    contrastText: "#0d1a04",
  },
  success: paletteDark.success,
  warning: paletteDark.warning,
  error: paletteDark.error,
  info: paletteDark.info,
  background: {
    default: "#100b16",
    paper: "#251c2f",
  },
  surface: {
    sunken: "#150f1c",
    base: "#1c1524",
    raised: "#251c2f",
    overlay: "#2f243b",
  },
  text: {
    primary: "#f5eee6",
    secondary: "#c4b8cc",
    disabled: "#7d7186",
    onPrimary: "#1a0c02",
    onAccent: "#0d1a04",
  },
  divider: "#3a2e46",
} as const;
