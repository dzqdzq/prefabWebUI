import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ConfigProvider, theme } from "antd";
import "antd/dist/reset.css";
import "./index.css";

const theme2 = {
  algorithm: theme.darkAlgorithm,
};


const root = document.getElementById("container");
root.style.backgroundColor = "#000";
createRoot(root).render(
  <ConfigProvider theme={theme2} componentSize={"small"}>
    <App />
  </ConfigProvider>
);
