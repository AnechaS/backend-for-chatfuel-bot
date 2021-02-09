/**
 * Create React App entry point. This and `public/index.html` files can not be
 * changed or moved.
 */
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import moment from "moment";
import { /* mockAxios,  */ setupAxios } from "./_metronic";
import store, { persistor } from "./app/store/store";

import "./globals";
import "./index.scss";

import App from "./App";

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL, REACT_APP_API_URL } = process.env;

/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
// /* const mock = */ mockAxios(axios);

/**
 * Inject metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 */
axios.defaults.baseURL = REACT_APP_API_URL;
setupAxios(axios, store);

moment.locale("th");

ReactDOM.render(
  <App store={store} persistor={persistor} basename={PUBLIC_URL} />,
  document.getElementById("root")
);
