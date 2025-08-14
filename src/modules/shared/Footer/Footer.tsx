import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoDark from '../../../assets/img/Logo/logo-dark.png';
import LogoLight from '../../../assets/img/Logo/logo-light.png';
import styles from './Footer.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useTranslation } from 'react-i18next';

const links = [
  { nameKey: 'github', url: 'https://github.com/DyvakOlexandr' },
  { nameKey: 'contacts', url: 'https://www.instagram.com/DyvakOlexandr/' },
  { nameKey: 'rights', url: 'https://github.com/DyvakOlexandr' },
];

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const isDarkMode = theme === 'dark';
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.footer_block}>
          <NavLink to="/">
            <img
              src={isDarkMode ? LogoLight : LogoDark}
              alt="logo"
              className={styles.footer_logo}
            />
          </NavLink>
          <nav>
            <ul className={styles.footer_list}>
              {links.map(({ nameKey, url }) => (
                <li key={nameKey} className={styles.footer_item}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footer_link}
                  >
                    {t(nameKey)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.footer_toTop}>
            <span className={styles.footer_toTopText} onClick={scrollToTop}>
              {t('backtop')}
            </span>
            <span
              className={styles.footer_toTopLink}
              onClick={scrollToTop}
              role="button"
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  scrollToTop();
                }
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
