/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { BounceLoader } from 'react-spinners';
import { AppDispatch, RootState } from '../../app/store';
import { resetStatusProducts } from '../../app/reducers/products';
import { setCurrentPage, setTotalPages } from '../../app/reducers/pagination';
import { fetchAccessories } from '../../app/reducers/accessories';
import { fetchTablets } from '../../app/reducers/tablets';
import { fetchPhones } from '../../app/reducers/phones';
import { clearName } from '../../app/reducers/productName';
import { Product } from '../../types/Product';
import { ProductDetails } from '../ProductDetailsPage/ProductDetails';
import { ProductCard } from '../shared/ProductCard/ProductCard';
import { Pagination } from '../shared/Pagination/Pagination';
import styles from './ProductListPage.module.scss';
import homeDark from '../../assets/img/icons/home-icon-dark.svg';
import homeLight from '../../assets/img/icons/home-icon.svg';
import { useTranslation } from 'react-i18next';

type Props = {
  category: string;
};

export const ProductListPage: React.FC<Props> = ({ category }) => {
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let status;
  const allProducts = useSelector((state: RootState) => state.products.items);
  const statusPhones = useSelector((state: RootState) => state.phones.status);
  const statusTablets = useSelector((state: RootState) => state.tablets.status);
  const statusAccessories = useSelector(
    (state: RootState) => state.accessories.status,
  );

  if (category === 'phones') {
    status = statusPhones;
  } else if (category === 'tablets') {
    status = statusTablets;
  } else if (category === 'accessories') {
    status = statusAccessories;
  } else {
    status = 'idle';
  }

  useEffect(() => {
    if (statusAccessories === 'idle') {
      dispatch(fetchPhones());
    }

    if (statusPhones === 'idle') {
      dispatch(fetchTablets());
    }

    if (statusTablets === 'idle') {
      dispatch(fetchAccessories());
    }
  }, [dispatch, statusTablets, statusPhones, statusAccessories]);

  // Читаем параметры из URL
  const queryParams = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(queryParams.get('page') || '1', 10);
  const itemsPerPageFromUrl = parseInt(queryParams.get('perPage') || '8', 10);
  const sortTypeFromUrl = queryParams.get('sort') || 'Newest';
  const queryFromUrl = queryParams.get('query') || '';

  const currentPage = useSelector(
    (state: RootState) => state.pagination.currentPage,
  );
  const totalPages = useSelector(
    (state: RootState) => state.pagination.totalPages,
  );

  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageFromUrl);
  const [product, setProduct] = useState<Product[]>([]);
  const [sortType, setSortType] = useState(sortTypeFromUrl);

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [itemsDropdownOpen, setItemsDropdownOpen] = useState(false);

  const theme = useSelector((state: RootState) => state.theme.currentTheme);
  const productId = location.pathname.split('/').pop();
  const isProductPage = productId !== category;
  const iconSrc = theme === 'dark' ? homeDark : homeLight;
  const sortDropdownRef = useRef<HTMLDivElement | null>(null);
  const itemsDropdownRef = useRef<HTMLDivElement | null>(null);

  // Загрузка данных по категории
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(resetStatusProducts());
    dispatch(clearName());
    if (category === 'phones') {
      dispatch(fetchPhones());
    } else if (category === 'tablets') {
      dispatch(fetchTablets());
    } else if (category === 'accessories') {
      dispatch(fetchAccessories());
    }
  }, [dispatch, category]);

  // Синхронизируем состояние сортировки и itemsPerPage с URL
  useEffect(() => {
    setSortType(sortTypeFromUrl);
    setItemsPerPage(itemsPerPageFromUrl);
  }, [sortTypeFromUrl, itemsPerPageFromUrl]);

  // Фильтрация товаров по query из URL
  useEffect(() => {
    const filteredProducts = allProducts.filter(products => {
      if (category && ['phones', 'tablets', 'accessories'].includes(category)) {
        if (products.category !== category) {
          return false;
        }
      }

      const translatedName = t(products.name);

      return translatedName.toLowerCase().includes(queryFromUrl.toLowerCase());
    });

    // --- ДОБАВЛЕННАЯ ЛОГИКА ---
    if (queryFromUrl && filteredProducts.length === 1) {
      const productFound = filteredProducts[0];

      navigate(`/${productFound.category}/${productFound.itemId}`, {
        replace: true,
      });

      return;
    }
    // -------------------------

    setProduct(filteredProducts);
    dispatch(setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage)));
  }, [
    allProducts,
    queryFromUrl,
    itemsPerPage,
    category,
    dispatch,
    t,
    navigate,
  ]);

  // Установка текущей страницы из URL
  useEffect(() => {
    if (pageFromUrl >= 1 && pageFromUrl <= totalPages) {
      dispatch(setCurrentPage(pageFromUrl));
    } else {
      dispatch(setCurrentPage(1));
    }
  }, [pageFromUrl, totalPages, dispatch]);

  // Сортируем товары в зависимости от выбранного типа сортировки
  const sortedPhones = React.useMemo(() => {
    return [...product].sort((a, b) => {
      if (sortType === 'Newest') {
        return b.year - a.year;
      }

      if (sortType === 'Alphabetically') {
        return a.name.localeCompare(b.name);
      }

      if (sortType === 'Cheapest') {
        return a.price - b.price;
      }

      return 0;
    });
  }, [product, sortType]);

  const getProductsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return sortedPhones.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const parsedValue = value === 'all' ? product.length : parseInt(value, 10);

    setItemsPerPage(parsedValue);
    dispatch(setCurrentPage(1));
    setItemsDropdownOpen(false);

    // Обновим URL параметр perPage и page
    const params = new URLSearchParams(location.search);

    if (parsedValue === product.length) {
      params.delete('perPage');
    } else {
      params.set('perPage', parsedValue.toString());
    }

    params.set('page', '1');
    navigate(`/${category}?${params.toString()}`, { replace: true });
  };

  const handleSortChange = (value: string) => {
    setSortType(value);
    dispatch(setCurrentPage(1));
    setSortDropdownOpen(false);

    // Обновим URL параметр sort и page
    const params = new URLSearchParams(location.search);

    if (value === 'Newest') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }

    params.set('page', '1');
    navigate(`/${category}?${params.toString()}`, { replace: true });
  };

  const handleProductClick = (selectedProduct: Product) => {
    navigate(`/${category}/${selectedProduct.itemId}`);
  };

  const back = () => {
    navigate('..');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sortDropdownRef.current &&
      !sortDropdownRef.current.contains(event.target as Node) &&
      itemsDropdownRef.current &&
      !itemsDropdownRef.current.contains(event.target as Node)
    ) {
      setSortDropdownOpen(false);
      setItemsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {isProductPage ? (
        <ProductDetails category={category} />
      ) : (
        <section className={classNames(styles.productList, 'container')}>
          <div className={styles.productList_backContainer}>
            {/* Поисковый input убран из сюда */}
            <img
              src={iconSrc}
              alt="home"
              className={styles.productList_backContainer_img}
              onClick={back}
            />
            <span className={styles.productList_backContainer_category}>
              {t(`categories.${category}`)}
            </span>
          </div>

          <h2 className={styles.productList_title}>
            {t(`categories.${category}`)}
          </h2>

          {status === 'loading' ? (
            <div className={styles.loader}>
              <BounceLoader size={150} color="#313237" />
            </div>
          ) : (
            <>
              {product.length > 0 ? (
                <>
                  <p className={styles.productList_count}>
                    {product.length} {t('models')}
                  </p>
                  <div className={styles.productList_filters}>
                    <div className={styles.productList_container}>
                      <p className={styles.productList_filterText}>
                        {t('sortby')}
                      </p>
                      <div
                        ref={sortDropdownRef}
                        className={classNames(
                          styles.productList_customDropdown,
                        )}
                        onClick={() => {
                          setSortDropdownOpen(o => !o);
                          setItemsDropdownOpen(false);
                        }}
                      >
                        <span>{t(`sortTypes.${sortType}`)}</span>
                        <span
                          className={classNames(
                            styles.productList_dropdownIcon,
                            {
                              [styles.open]: sortDropdownOpen,
                            },
                          )}
                        ></span>
                        {sortDropdownOpen && (
                          <div className={styles.productList_dropdownMenu}>
                            <div
                              className={styles.productList_dropdownItem}
                              onClick={() => handleSortChange('Newest')}
                            >
                              {t('newest')}
                            </div>
                            <div
                              className={styles.productList_dropdownItem}
                              onClick={() => handleSortChange('Alphabetically')}
                            >
                              {t('alphabetically')}
                            </div>
                            <div
                              className={styles.productList_dropdownItem}
                              onClick={() => handleSortChange('Cheapest')}
                            >
                              {t('cheapest')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.productList_container}>
                      <p className={styles.productList_filterText}>
                        {t('itemsonpage')}
                      </p>
                      <div
                        ref={itemsDropdownRef}
                        className={classNames(
                          styles.productList_customDropdown,
                        )}
                        onClick={() => {
                          setItemsDropdownOpen(o => !o);
                          setSortDropdownOpen(false);
                        }}
                      >
                        <span>
                          {itemsPerPage === product.length
                            ? t('pagination.all')
                            : itemsPerPage}
                        </span>
                        <span
                          className={classNames(
                            styles.productList_dropdownIcon,
                            {
                              [styles.open]: itemsDropdownOpen,
                            },
                          )}
                        ></span>
                        {itemsDropdownOpen && (
                          <div className={styles.productList_dropdownMenu}>
                            <div
                              className={styles.productList_dropdownItem}
                              onClick={() => handleItemsPerPageChange('4')}
                            >
                              4
                            </div>
                            <div
                              className={styles.productList_dropdownItem}
                              onClick={() => handleItemsPerPageChange('8')}
                            >
                              8
                            </div>
                            <div
                              className={styles.productList_dropdownItem}
                              onClick={() => handleItemsPerPageChange('16')}
                            >
                              16
                            </div>
                            <div
                              className={styles.productList_dropdownItem}
                              onClick={() => handleItemsPerPageChange('all')}
                            >
                              {t('pagination.all')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <ul className={styles.productList_list}>
                    {getProductsForCurrentPage().map(item => (
                      <ProductCard
                        key={item.id}
                        {...item}
                        onClick={() => handleProductClick(item)}
                      />
                    ))}
                  </ul>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <p className={styles.noResults}>
                  {t('no_products_matching_query', {
                    category: t(`categories.${category}`),
                  })}
                </p>
              )}
            </>
          )}
        </section>
      )}
    </>
  );
};
