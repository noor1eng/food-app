import { useEffect, useState } from "react";
import i18next from "i18next";

import en from "./translate/en.json";
import ar from "./translate/ar.json";

const languageListeners = new Set();

i18next.init({
  lng: "en",
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
  },
});

i18next.on("languageChanged", (lng) => {
  languageListeners.forEach((listener) => listener(lng));
});

export const t = (...args) => i18next.t(...args);
export const changeLanguage = (lng) => i18next.changeLanguage(lng);
export const getLanguage = () => i18next.language;

export function useI18n() {
  const [language, setLanguage] = useState(i18next.language || "en");

  useEffect(() => {
    const onLanguageChanged = (lng) => setLanguage(lng);
    languageListeners.add(onLanguageChanged);
    return () => {
      languageListeners.delete(onLanguageChanged);
    };
  }, []);

  return {
    t: i18next.t.bind(i18next),
    changeLanguage: i18next.changeLanguage.bind(i18next),
    language,
  };
}

export default i18next;
