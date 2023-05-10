import './App.css';
import {
  App,
  ConfigProvider,
  theme
} from 'antd';
import React from 'react';

import 'antd/dist/reset.css';
import AppLayout from './AppLayout';
import { BrowserRouter } from "react-router-dom";
import { ReactKeycloakProvider } from '@react-keycloak/web'


import authClient from './keycloak'


const { defaultAlgorithm, darkAlgorithm } = theme;
function Application() {
  return (
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm,
        token: {
          colorPrimary: '#e20074',
        },
      }}
    >
      <ReactKeycloakProvider
        initOptions={{ onLoad: 'login-required' }}
        authClient={authClient}
        onLoad
      >
        <React.StrictMode>
          <App>
            <BrowserRouter>
              <AppLayout type="primary">Button</AppLayout>
            </BrowserRouter>
          </App>
        </React.StrictMode>
      </ReactKeycloakProvider>
    </ConfigProvider>


  );
}

export default Application;
