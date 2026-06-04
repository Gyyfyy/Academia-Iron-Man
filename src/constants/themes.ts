const FontScale = {
  size: {
    small: 14,
    medium: 16,
    large: 22,
  }
};

export const LightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#F4F5F4',
    text: '#0F140E',
    textSecondary: '#474A48',
    
    primary: '#08F04D',
    primaryDark: '#04A834',
    border: '#E0E2E0',
    error: '#FF3B30',
  },
  fonts: FontScale,
};

export const DarkTheme = {
  dark: true,
  colors: {
    background: '#0F140E',
    surface: '#1C221A',
    text: '#D0D0C0',
    textSecondary: '#8E8E93',
    
    primary: '#08F04D',
    primaryDark: '#02631E',
    border: '#2E382A',
    error: '#FF453A',
  },
  fonts: FontScale,
};
export type ThemeType = typeof LightTheme;
