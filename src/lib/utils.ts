import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMarketGradientClass(market: string): string {
  switch (market) {
    case 'finland':
      return 'bg-gradient-finland';
    case 'germany':
      return 'bg-gradient-germany';
    case 'usa':
      return 'bg-gradient-usa';
    default:
      return 'bg-gradient-global';
  }
}

export function getMarketTextGradientClass(market: string): string {
  switch (market) {
    case 'finland':
      return 'text-gradient-finland';
    case 'germany':
      return 'text-gradient-germany';
    case 'usa':
      return 'text-gradient-usa';
    default:
      return 'text-gradient-global';
  }
}

export function getMarketFromLocale(locale: string): string {
  switch (locale) {
    case 'fi':
      return 'finland';
    case 'de':
      return 'germany';
    case 'en':
      return 'usa';
    default:
      return 'global';
  }
}

export function getLocaleFromMarket(market: string): string {
  switch (market) {
    case 'finland':
      return 'fi';
    case 'germany':
      return 'de';
    case 'usa':
      return 'en';
    default:
      return 'en';
  }
}

  export function getEmailPlaceholder (market: string): string {
    switch (market) {
      case 'finland':
        return 'admin@salon.fi';
      case 'germany':
        return 'admin@salon.de';
      default:
        return 'admin@salon.com';
    }
  };