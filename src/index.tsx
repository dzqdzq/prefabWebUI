import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ConfigProvider, theme } from "antd";
import './index.css';

const theme2 = { 
    // algorithm: theme.darkAlgorithm,
};
createRoot(document.getElementById('container')).render(
    <ConfigProvider theme={theme2}>
        <App />
    </ConfigProvider>
);
