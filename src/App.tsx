import { Outlet } from 'react-router-dom';
import { Header } from './modules/shared/Header/Header';
import { Footer } from './modules/shared/Footer/Footer';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from './app/reducers/products';
import { AppDispatch } from './app/store';

export const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchProducts()); // Подгружаем все продукты при запуске сайта
  }, [dispatch]);

  return (
    <div className="App">
      <h1 hidden>Product Catalog</h1>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
