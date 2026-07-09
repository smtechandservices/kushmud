'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchSiteEffect, SiteEffect } from '@/lib/data';
import { resolveAutoEffect } from '@/lib/autoEffect';

const SiteEffectContext = createContext<SiteEffect>('none');

export function SiteEffectProvider({ children }: { children: React.ReactNode }) {
  const [effect, setEffect] = useState<SiteEffect>('none');

  useEffect(() => {
    fetchSiteEffect()
      .then(s => setEffect(s.active_effect === 'auto' ? resolveAutoEffect() : s.active_effect))
      .catch(() => {});
  }, []);

  return <SiteEffectContext.Provider value={effect}>{children}</SiteEffectContext.Provider>;
}

export function useSiteEffect() {
  return useContext(SiteEffectContext);
}
