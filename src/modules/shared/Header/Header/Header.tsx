import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { RootState, AppDispatch } from '../../../../app/store';
import { ModalHeader } from '../ModalHeader/ModalHeader';
import { ThemeToggle } from '../../ThemeToggle';
import { LanguageSwitcher } from '../../LanguageSwitcher/LanguageSwitcher';
import LogoDark from '../../../../assets/img/Logo/logo-dark.png';
import LogoLight from '../../../../assets/img/Logo/logo-light.png';
import styles from './Header.module.scss';
import { useTranslation } from 'react-i18next';
import { fetchPhones } from '../../../../app/reducers/phones';
import { fetchAccessories } from '../../../../app/reducers/accessories';
import { fetchTablets } from '../../../../app/reducers/tablets';

export const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const phones = useSelector((state: RootState) => state.phones.items);
  const tablets = useSelector((state: RootState) => state.tablets.items);
  const accessories = useSelector(
    (state: RootState) => state.accessories.items,
  );
  const phonesStatus = useSelector((state: RootState) => state.phones.status);
  const tabletsStatus = useSelector((state: RootState) => state.tablets.status);
  const accessoriesStatus = useSelector(
    (state: RootState) => state.accessories.status,
  );

  const isLoaded =
    phonesStatus === 'succeeded' &&
    tabletsStatus === 'succeeded' &&
    accessoriesStatus === 'succeeded';
  const products = useSelector((state: RootState) => state.products.items);
  const productsStatus = useSelector(
    (state: RootState) => state.products.status,
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const favoriteItems = useSelector(
    (state: RootState) => state.favourites.items,
  );
  const theme = useSelector((state: RootState) => state.theme.currentTheme);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isDarkMode = theme === 'dark';

  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isModal, setIsModal] = useState(false);

  // --- Определяем категорию из URL ---
  const getCategoryFromPath = (path: string) => {
    const parts = path.toLowerCase().split('/').filter(Boolean);
    const categories = ['phones', 'tablets', 'accessories'];

    return parts.find(part => categories.includes(part)) || null;
  };

  const [currentCategory, setCurrentCategory] = useState<string | null>(
    getCategoryFromPath(location.pathname),
  );

  useEffect(() => {
    setCurrentCategory(getCategoryFromPath(location.pathname));
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/phones', label: t('Phones') },
    { to: '/tablets', label: t('Tablets') },
    { to: '/accessories', label: t('Accessories') },
  ];

  // --- Загружаем продукты при старте ---
  useEffect(() => {
    if (productsStatus === 'idle') {
      dispatch(fetchPhones());
      dispatch(fetchTablets());
      dispatch(fetchAccessories());
    }
  }, [dispatch, productsStatus]);

  // --- Инициализация поиска из URL ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';

    setSearchValue(query);
  }, [location.search]);

  // --- Обновление URL при вводе с debounce ---
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(location.search);

      if (searchValue) {
        params.set('query', searchValue);
      } else {
        params.delete('query');
      }

      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue, location.pathname, location.search, navigate]);

  // --- Подсказки при вводе ---
  useEffect(() => {
    if (!searchValue || !isLoaded) {
      setSuggestions([]);

      return;
    }

    const value = searchValue.toLowerCase();
    const allProducts = [...phones, ...tablets, ...accessories];

    const matches = allProducts
      .filter(
        p =>
          (!currentCategory ? true : p.category === currentCategory) &&
          t(p.name).toLowerCase().includes(value),
      )
      .slice(0, 10)
      .map(p => t(p.name));

    setSuggestions(matches);
  }, [searchValue, phones, tablets, accessories, isLoaded, t, currentCategory]);

  // --- Авто-редирект на ProductDetails при точном совпадении ---
  useEffect(() => {
    if (!searchValue || productsStatus !== 'succeeded') {
      return;
    }

    const value = searchValue.trim().toLowerCase();
    const foundProduct = products.find(
      p =>
        (!currentCategory ? true : p.category === currentCategory) &&
        t(p.name).toLowerCase() === value,
    );

    if (foundProduct) {
      navigate(`/${foundProduct.category}/${foundProduct.itemId}`);
    }
  }, [searchValue, products, productsStatus, t, navigate, currentCategory]);

  const handleSelectSuggestion = (translatedName: string) => {
    const foundProduct = products.find(p => t(p.name) === translatedName);

    if (foundProduct) {
      setSearchValue(translatedName);
      setShowDropdown(false);
      navigate(`/${foundProduct.category}/${foundProduct.itemId}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      return;
    }

    const foundProduct = products.find(
      p =>
        (!currentCategory ? true : p.category === currentCategory) &&
        t(p.name).toLowerCase() === searchValue.trim().toLowerCase(),
    );

    if (foundProduct) {
      navigate(`/${foundProduct.category}/${foundProduct.itemId}`);
    } else {
      navigate(`/products?query=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const toggleModal = () => setIsModal(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 640) {
        setIsModal(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header className={styles.header} id="top">
        <div className={styles.header_container}>
          <div className={styles.header_block}>
            <NavLink to="/">
              <img
                src={isDarkMode ? LogoLight : LogoDark}
                alt="logo"
                className={styles.header_logo}
              />
            </NavLink>

            <nav className={styles.header_nav}>
              <ul className={styles.header_list}>
                {navLinks.map(({ to, label }) => (
                  <li key={to} className={styles.header_item}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        classNames(styles.header_link, {
                          [styles.is_active]: isActive,
                        })
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <NavLink
                to="favourites"
                role="button"
                className={styles.header_favourites}
              >
                <span className={styles.header_heartIcon}>
                  {favoriteItems.length > 0 && (
                    <span className={styles.header_countIcon}>
                      {favoriteItems.length}
                    </span>
                  )}
                </span>
              </NavLink>

              <NavLink to="cart" role="button" className={styles.header_cart}>
                <span className={styles.header_cartIcon}>
                  {totalItems > 0 && (
                    <span className={styles.header_countIcon}>
                      {totalItems}
                    </span>
                  )}
                </span>
              </NavLink>
            </nav>
            <div className={styles.searchContainer}>
              <form onSubmit={handleSearch}>
                <input
                  type="search"
                  value={searchValue}
                  onChange={e => {
                    setSearchValue(e.target.value);
                    setShowDropdown(true);
                  }}
                  placeholder={t('search')}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                />

                {showDropdown && suggestions.length > 0 && (
                  <ul
                    className={classNames(
                      styles.suggestionsDropdown,
                      showDropdown && suggestions.length > 0 ? styles.show : '',
                    )}
                  >
                    {suggestions.map(name => (
                      <li
                        key={name}
                        onClick={() => handleSelectSuggestion(name)}
                        className={styles.suggestionItem}
                      >
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>

            <ThemeToggle />
            <LanguageSwitcher />

            <div className={styles.header_modalMenu}>
              <button
                className={classNames(styles.header_icon, {
                  [styles.header_icon_open]: !isModal,
                  [styles.header_icon_close]: isModal,
                })}
                onClick={toggleModal}
                aria-label="Toggle menu"
              />
            </div>
          </div>
        </div>
      </header>

      {windowWidth <= 1199.9 && (
        <ModalHeader onClose={toggleModal} isModal={isModal} />
      )}
    </>
  );
};
