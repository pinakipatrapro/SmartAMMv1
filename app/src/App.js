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


      <App>
        <ReactKeycloakProvider
          initOptions={{ onLoad: 'login-required' }}
          authClient={authClient}
          onLoad
        >
          <BrowserRouter>
            <AppLayout type="primary">Button</AppLayout>
          </BrowserRouter>
        </ReactKeycloakProvider>
      </App>
    </ConfigProvider>


  );
}

export default Application;
