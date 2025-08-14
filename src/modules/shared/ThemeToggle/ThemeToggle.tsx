import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../app/hooks/useTheme';
import styles from './ThemeToggle.module.scss';

export const ThemeToggle: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  // Эмулируем загрузку — например, ждем, пока currentTheme определится
  useEffect(() => {
    if (currentTheme) {
      setLoading(false);
    }
  }, [currentTheme]);

  if (loading) {
    return <div className={styles.themeToggle_skeleton} aria-hidden="true" />;
  }

  return (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      <span className={styles.themeToggle__icon}>
        {currentTheme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
};
