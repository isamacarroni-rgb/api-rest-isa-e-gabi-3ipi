export const Colors = {
  // Backgrounds
  bg: '#141414',
  bgCard: '#1f1f1f',
  bgModal: '#242424',
  bgInput: '#2a2a2a',
  bgHeader: '#0a0a0a',

  // Text
  text: '#ffffff',
  textSub: '#b3b3b3',
  textMuted: '#6b6b6b',

  // Brand
  red: '#E50914',
  redDark: '#b20710',
  redLight: '#ff1f2b',

  // Feedback
  success: '#46d369',
  warning: '#f5a623',
  danger: '#E50914',

  // Stars
  star: '#f5c518',

  // Platform badge colors
  platforms: {
    'Netflix': '#E50914',
    'Disney+': '#113CCF',
    'Amazon Prime Video': '#00A8E1',
    'HBO Max': '#8E2DE2',
    'Apple TV+': '#555555',
    'Globoplay': '#E55E00',
    'Paramount+': '#0064FF',
    'default': '#444444',
  } as Record<string, string>,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  hero: 38,
} as const;
