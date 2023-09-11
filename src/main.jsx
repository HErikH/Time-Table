import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import 'normalize.css';
import './index.scss'

i18n.use(initReactI18next).use(LanguageDetector).use(HttpApi).init({
    supportedLngs: ['en', 'ru', 'am'],
    fallbackLng: "en",
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['cookie']
    },
    backend: {
        loadPath: '/assets/locales/{{lng}}/translation.json',
    },
    react: {
        useSuspense: false,
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)
