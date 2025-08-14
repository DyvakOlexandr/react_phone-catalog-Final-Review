/* eslint-disable import/no-extraneous-dependencies */
import { Provider } from 'react-redux';
import { store } from './app/store';
import { HashRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { createRoot } from 'react-dom/client';
import './i18n/i18n';

createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <HashRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <AppRoutes />
    </HashRouter>
  </Provider>,
);
