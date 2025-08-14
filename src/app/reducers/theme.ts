/* eslint-disable import/no-extraneous-dependencies */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

export interface ThemeState {
  currentTheme: Theme;
}

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme;

  if (savedTheme) {
    return savedTheme;
  }

  // Check system preference
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
};

const initialState: ThemeState = {
  currentTheme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: state => {
      const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';

      return {
        ...state,
        currentTheme: newTheme,
      };
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      return {
        ...state,
        currentTheme: action.payload,
      };
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
