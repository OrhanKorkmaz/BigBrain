import { createContext, useContext, useState } from 'react';

export const translations = {
  tr: {
    appName: 'BigBrainAI',
    tagline: '2 AI sorar • Anlaşamazsa hakem devreye girer',
    start: 'Hadi Başlayalım 🚀',
    freeNote: 'İlk 3 soru ücretsiz',
    ask: 'Sor',
    history: 'Geçmiş',
    profile: 'Profil',
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    email: 'E-posta',
    password: 'Şifre',
    noAccount: 'Hesabın yok mu? Kayıt ol',
    placeholder: 'Sorunuzu buraya yazın...',
    askButton: "2 AI'ya Sor 🚀",
    category: 'Kategori',
    freeLeft: 'kalan ücretsiz soru',
  },
  en: {
    appName: 'BigBrainAI',
    tagline: '2 AIs answer • Disagreement triggers a judge',
    start: "Let's Go 🚀",
    freeNote: 'First 3 questions free',
    ask: 'Ask',
    history: 'History',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    noAccount: "Don't have an account? Sign up",
    placeholder: 'Type your question here...',
    askButton: 'Ask 2 AIs 🚀',
    category: 'Category',
    freeLeft: 'free questions left',
  }
};

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState('tr');
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);