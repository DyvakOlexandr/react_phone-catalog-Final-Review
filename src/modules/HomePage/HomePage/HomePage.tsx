import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchProducts } from '../../../app/reducers/products';
import { Banner } from '../Banner/Banner';
import { Categories } from '../Categories/Categories';
import { NewModels } from '../NewModels/NewModels';
import { HotPrices } from '../HotPrices/HotPrices';

export const HomePage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const allProducts = useSelector((state: RootState) => state.products.items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const newProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes('iphone-14'),
  );

  return (
    <section className="container">
      <Banner />
      <NewModels products={newProducts} />
      <Categories />
      <HotPrices products={allProducts} />
    </section>
  );
};
