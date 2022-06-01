import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import { BrowserRouter } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import { ToastContainer } from 'react-toastify';
import App from './App';
import { store } from './store';

const persistor = persistStore(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent open />} persistor={persistor}>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


