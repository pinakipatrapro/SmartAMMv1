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
        <BrowserRouter>
          <AppLayout type="primary">Button</AppLayout>
        </BrowserRouter>
      </App>
    </ConfigProvider>


  );
}

export default Application;
