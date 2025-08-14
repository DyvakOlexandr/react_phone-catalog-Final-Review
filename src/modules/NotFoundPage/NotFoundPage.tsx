import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/img/page-not-found.png';
import styles from './NotFoundPage.module.scss';
import { useTranslation } from 'react-i18next';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('..');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <section className={'container'}>
      <div className={styles.nfPage}>
        <h2 className={styles.nfPage_title}>{t('pagenotfound')}</h2>
        <img src={image} alt="page not found" className={styles.nfPage_img} />
      </div>
    </section>
  );
};
