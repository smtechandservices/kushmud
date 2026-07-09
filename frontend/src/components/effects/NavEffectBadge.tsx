'use client';

import React from 'react';
import { useSiteEffect } from './SiteEffectContext';

const NAV_EFFECT_EMOJI: Record<string, string> = {
  snow: '❄️',
  rain: '🌧️',
  autumn: '🍁',
  independence_day: '🪁',
};

export function NavEffectBadge() {
  const effect = useSiteEffect();
  const emoji = NAV_EFFECT_EMOJI[effect];
  if (!emoji) return null;
  return <span className="nav-effect-badge" aria-hidden="true">{emoji}</span>;
}
