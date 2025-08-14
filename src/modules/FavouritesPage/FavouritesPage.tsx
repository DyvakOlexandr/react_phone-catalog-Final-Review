import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../app/store';
import { ProductCard } from '../shared/ProductCard';
import image from '../../assets/img/product-not-found.png';
import homeDark from '../../assets/img/icons/home-icon-dark.svg';
import homeLight from '../../assets/img/icons/home-icon.svg';
import styles from './FavouritesPage.module.scss';
import { useTranslation } from 'react-i18next';

export const FavouritesPage: React.FC = () => {
  const { t } = useTranslation();
  const favourites = useSelector((state: RootState) => state.favourites.items);
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const iconSrc = theme === 'dark' ? homeDark : homeLight;

  const handleProductClick = (
    selectedId: number | string,
    selectedProductId: string,
    category: string,
  ) => {
    const idToNavigate = selectedProductId || selectedId;

    navigate(`/${category}/${idToNavigate}`);
  };

  return (
    <section className={'container'}>
      <div className={styles.favourites}>
        <div className={styles.favourites_backContainer}>
          <img
            src={iconSrc}
            alt="home"
            className={styles.favourites_backContainer_img}
            onClick={() => navigate('..')}
          />

          <span className={styles.favourites_backContainer_backText}>
            {t('favourites')}
          </span>
        </div>
        <h1 className={styles.favourites_title}>{t('favourites')}</h1>
        <p className={styles.favourites_count}>
          {t('favouritesCount', { count: favourites.length })}
        </p>

        {favourites.length > 0 ? (
          <ul className={styles.favourites_list}>
            {favourites.map(
              (fav: {
                id: string | number;
                itemId: string;
                category: string;
                image: string;
                name: string;
                price: number;
                fullPrice: number;
                screen: string;
                capacity: string;
                ram: string;
              }) => (
                <ProductCard
                  key={fav.id}
                  id={fav.id}
                  itemId={fav.itemId}
                  category={fav.category}
                  image={fav.image}
                  name={fav.name}
                  price={fav.price}
                  fullPrice={fav.fullPrice}
                  screen={fav.screen}
                  capacity={fav.capacity}
                  ram={fav.ram}
                  // isNew={fav.fullPrice !== fav.price} // Визначаємо чи є знижка
                  onClick={() =>
                    handleProductClick(fav.id, fav.itemId, fav.category)
                  }
                  className={styles.favourites_card}
                />
              ),
            )}
          </ul>
        ) : (
          <div className={styles.favourites_empty}>
            <img
              src={image}
              alt="empty"
              className={styles.favourites_emptyImg}
            />
          </div>
        )}
      </div>
    </section>
  );
};
