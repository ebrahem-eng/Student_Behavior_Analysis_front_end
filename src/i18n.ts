import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Placeholder translations
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to Student Behavior Analysis",
    }
  },
  ar: {
    translation: {
      "welcome": "مرحباً بك في نظام تحليل سلوك الطلاب",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
