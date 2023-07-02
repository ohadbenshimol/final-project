import App from './app/App';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store/Store';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-html5-camera-photo/build/css/index.css'; //TODO: check if used
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer position="bottom-left" />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
