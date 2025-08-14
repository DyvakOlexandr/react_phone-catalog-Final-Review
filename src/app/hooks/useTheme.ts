/* eslint-disable import/no-extraneous-dependencies */
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../store';
import { toggleTheme, setTheme, Theme } from '../reducers/theme';

export const useTheme = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme,
  );

  useEffect(() => {
    // Set initial theme on document
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleSetTheme = (theme: Theme) => {
    dispatch(setTheme(theme));
  };

  return {
    currentTheme,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
  };
};
