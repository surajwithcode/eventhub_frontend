import { COLORS } from './colors';

export const getTheme = (mode = 'light') => ({
  colors: {
    primary: COLORS.primary,
    background: mode === 'dark' ? COLORS.backgroundDark : COLORS.backgroundLight,
    card: mode === 'dark' ? COLORS.cardDark : COLORS.cardLight,
    text: mode === 'dark' ? COLORS.textDark : COLORS.textLight,
    border: mode === 'dark' ? COLORS.borderDark : COLORS.borderLight,
    muted: COLORS.textMuted,
  },
});