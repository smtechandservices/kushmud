'use client';

import React from 'react';
import { useSiteEffect } from './effects/SiteEffectContext';
import { SnowEffect } from './effects/SnowEffect';
import { RainEffect } from './effects/RainEffect';
import { AutumnEffect } from './effects/AutumnEffect';
import { IndependenceDayEffect } from './effects/IndependenceDayEffect';

export function SeasonalEffect() {
  const effect = useSiteEffect();

  if (effect === 'snow') return <SnowEffect />;
  if (effect === 'rain') return <RainEffect />;
  if (effect === 'autumn') return <AutumnEffect />;
  if (effect === 'independence_day') return <IndependenceDayEffect />;
  return null;
}
