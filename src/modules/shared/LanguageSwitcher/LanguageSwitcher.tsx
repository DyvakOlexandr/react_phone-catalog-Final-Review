import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styles from './LanguageSwicher.module.scss';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ua' : 'en';

    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  // Класс для фона в зависимости от языка, на который переключаемся
  const nextLangClass =
    i18n.language === 'en' ? styles.enBackground : styles.uaBackground;

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={classNames(styles.languageSwitcher, nextLangClass)}
    >
      {i18n.language === 'en' ? 'EN' : 'UA'}
    </button>
  );
};
