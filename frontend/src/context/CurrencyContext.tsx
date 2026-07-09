'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ── Supported currencies ──
// Add new entries here as you expand to more countries.
export type CurrencyCode = 'INR' | 'AED';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  flag: string;
  label: string;
}

// ── Registry — single source of truth ──
// To add a new currency:  1) add to CurrencyCode union   2) add entry here   3) add mapping in COUNTRY_TO_CURRENCY
export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹',    flag: '🇮🇳', label: 'Indian Rupee' },
  AED: { code: 'AED', symbol: 'د.إ',  flag: '🇦🇪', label: 'UAE Dirham' },
};

// ── Conversion rates (base = INR) ──
// TODO: Replace with a live-rate API call when ready.
// Rates represent  1 INR = X target.
const RATES: Record<CurrencyCode, number> = {
  INR: 1,
  AED: 0.044,   // ≈ ₹1 = 0.044 AED
};

// ── Country → Currency mapping ──
// ISO 3166-1 alpha-2 country code → default currency.
// Extend this map when adding new countries.
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  IN: 'INR',
  AE: 'AED',
};

const DEFAULT_CURRENCY: CurrencyCode = 'INR';
const STORAGE_KEY = 'kushmud_currency';

// ── Context shape ──
interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  currencyInfo: CurrencyInfo;
  /** Format an amount stored in INR into the active currency. */
  formatPrice: (amountInINR: number) => string;
  /** Just the symbol for the active currency. */
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// ── Provider ──
export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  // On mount: check localStorage first, then fall back to IP detection.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored && CURRENCIES[stored]) {
      setCurrencyState(stored);
      return;
    }

    // Detect via IP
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        const countryCode: string = data?.country_code ?? '';
        const detected = COUNTRY_TO_CURRENCY[countryCode] ?? DEFAULT_CURRENCY;
        setCurrencyState(detected);
        localStorage.setItem(STORAGE_KEY, detected);
      })
      .catch(() => {
        // Network failure — keep default
      });
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const formatPrice = useCallback(
    (amountInINR: number): string => {
      const rate = RATES[currency] ?? 1;
      const converted = amountInINR * rate;
      const symbol = CURRENCIES[currency].symbol;

      // Use locale-aware formatting
      if (currency === 'INR') {
        return `${symbol}${converted.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
      }
      return `${symbol}\u00A0${converted.toLocaleString('en-AE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    },
    [currency],
  );

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    currencyInfo: CURRENCIES[currency],
    formatPrice,
    currencySymbol: CURRENCIES[currency].symbol,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

// ── Hook ──
export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within <CurrencyProvider>');
  return ctx;
}

// Re-export the list so the Nav switcher can iterate over it.
export const CURRENCY_LIST: CurrencyInfo[] = Object.values(CURRENCIES);
