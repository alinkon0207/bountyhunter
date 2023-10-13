import React from 'react';
import ReactDOM from 'react-dom/client';
import { LocationProvider } from '@reach/router';
import { GlobalProvider } from './contexts/GlobalContext';
import { ReduxContext } from './contexts/ReduxContext';
import { WalletProvider } from './contexts/WalletContext';
import { ContractProvider } from './contexts/ContractContext';
import App from './App.jsx';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import './index.css';
import './style.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <LocationProvider>
    <GlobalProvider>
      <ReduxContext>
        <WalletProvider>
          <ContractProvider>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </ContractProvider>
        </WalletProvider>
      </ReduxContext>
    </GlobalProvider>    
  </LocationProvider>
);
