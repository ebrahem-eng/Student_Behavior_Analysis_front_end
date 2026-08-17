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

const STORAGE_KEY = 'sba-lang';

// Retrieve stored language or fallback to 'en'
const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('i18nextLng');
    if (saved === 'ar' || saved === 'en') {
      return saved;
    }
  }
  return 'en';
};

const initialLang = getInitialLanguage();

// Apply direction & lang attribute immediately
if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLang;
  document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

// Keep localStorage and document attributes in sync whenever language changes
i18n.on('languageChanged', (lng: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
    localStorage.setItem('i18nextLng', lng);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  }
});

export default i18n;
