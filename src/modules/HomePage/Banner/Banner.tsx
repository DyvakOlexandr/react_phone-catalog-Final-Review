import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Navigation, Pagination, Autoplay, EffectCube } from 'swiper/modules';

import bannerBig from '../../../assets/img/banners/banner-big.png';
import bannerbig1 from '../../../assets/img/banners/banner-big-1.png';
import bannerbig2 from '../../../assets/img/banners/banner-big_2.png';
import bannerSmall from '../../../assets/img/banners/banner-small.png';
import bannerSmall1 from '../../../assets/img/banners/banner-small_1.png';
import bannerSmall2 from '../../../assets/img/banners/banner-small_2.png';

import styles from './Banner.module.scss';
import { useTranslation } from 'react-i18next';

const banners = [
  {
    linkTo: 'phones/apple-iphone-14-pro-128gb-spaceblack',
    big: bannerBig,
    small: bannerSmall,
  },
  {
    linkTo: 'phones/apple-iphone-14-pro-128gb-gold',
    big: bannerbig1,
    small: bannerSmall1,
  },
  {
    linkTo: 'phones/apple-iphone-14-pro-256gb-gold',
    big: bannerbig2,
    small: bannerSmall2,
  },
];

export const Banner: React.FC = () => {
  const { t } = useTranslation();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  // Для отслеживания загрузки изображений — массив булевых флагов
  const [loaded, setLoaded] = useState<boolean[]>(
    new Array(banners.length).fill(false),
  );

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 640);

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Функция, вызываемая при загрузке каждого изображения
  const onImageLoad = (index: number) => {
    setLoaded(prev => {
      const newLoaded = [...prev];

      newLoaded[index] = true;

      return newLoaded;
    });
  };

  return (
    <section className={styles.slaider}>
      <h2 className={styles.slaider_title}>{t('banner.title')}</h2>

      <Swiper
        effect="cube"
        navigation={{ nextEl: '.bannerNext', prevEl: '.bannerPrev' }}
        pagination={{ el: `.${styles.slaider_pagination}`, clickable: true }}
        modules={[Navigation, Pagination, EffectCube, Autoplay]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        {banners.map((banner, index) => {
          const currentImage = isSmallScreen ? banner.small : banner.big;

          if (!currentImage) {
            return null;
          }

          return (
            <SwiperSlide key={index}>
              <div>
                <button className={`${styles.button_prev} bannerPrev`}></button>
                <button className={`${styles.button_next} bannerNext`}></button>

                {/* Скелетон, пока изображение не загрузилось */}
                {!loaded[index] && (
                  <div className={styles.slaider_skeleton}></div>
                )}

                <img
                  src={currentImage}
                  alt="Banner"
                  className={styles.slaider_banner}
                  style={{ display: loaded[index] ? 'block' : 'none' }}
                  onLoad={() => onImageLoad(index)}
                />

                <Link to={banner.linkTo} className={styles.slaider_button}>
                  {t('banner.orderNow')}
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className={styles.slaider_pagination}></div>
    </section>
  );
};
