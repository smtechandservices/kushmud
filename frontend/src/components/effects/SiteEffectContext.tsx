'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchSiteEffect, SiteEffect } from '@/lib/data';

const SiteEffectContext = createContext<SiteEffect>('none');

export function SiteEffectProvider({ children }: { children: React.ReactNode }) {
  const [effect, setEffect] = useState<SiteEffect>('none');

  useEffect(() => {
    fetchSiteEffect().then(s => setEffect(s.active_effect)).catch(() => {});
  }, []);

  return <SiteEffectContext.Provider value={effect}>{children}</SiteEffectContext.Provider>;
}

export function useSiteEffect() {
  return useContext(SiteEffectContext);
}
