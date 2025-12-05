'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { languages, type LanguageCode, type Market } from '@/constants/language';

interface MarketContextType {
  market: Market;
  locale: LanguageCode;
  setMarket: (market: Market) => void;
  setLocale: (locale: LanguageCode) => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [market, setMarketState] = useState<Market>('global');
  const [locale, setLocaleState] = useState<LanguageCode>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  const setMarket = (newMarket: Market) => {
    setMarketState(newMarket);
    const marketLang = languages.find(lang => lang.market === newMarket);
    if (marketLang) {
      setLocaleState(marketLang.value);
      localStorage.setItem('locale', marketLang.value);
    }
    document.body.setAttribute('data-market', newMarket);
    localStorage.setItem('salon-market', newMarket);
  };

  const setLocale = (newLocale: LanguageCode) => {
    setLocaleState(newLocale);
    const newMarket = languages.find(lang => lang.value === newLocale)?.market || 'global';
    setMarketState(newMarket);
    document.body.setAttribute('data-market', newMarket);
    localStorage.setItem('locale', newLocale);
    localStorage.setItem('salon-market', newMarket);
  };

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as LanguageCode;
    const savedMarket = localStorage.getItem('salon-market') as Market;
    
    if (savedLocale && languages.some(lang => lang.value === savedLocale)) {
      setLocale(savedLocale);
    } else if (savedMarket && ['finland', 'germany', 'usa', 'global'].includes(savedMarket)) {
      setMarket(savedMarket);
    } else {
      const browserLang = navigator.language.toLowerCase();
      const primaryLang = browserLang.split('-')[0];
      const matchedLang = languages.find(lang => lang.value === primaryLang);
      if (matchedLang) {
        setLocale(matchedLang.value);
      } else {
        setLocale('en');
      }
    }
    
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null;
  }

  return (
    <MarketContext.Provider value={{ market, locale, setMarket, setLocale }}>
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within MarketProvider');
  }
  return context;
};