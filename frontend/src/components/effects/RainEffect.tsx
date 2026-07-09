'use client';

import React, { useMemo } from 'react';
import type { ISourceOptions } from '@tsparticles/engine';
import { ParticlesLayer } from '../ParticlesLayer';

export function RainEffect() {
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles: {
        number: { value: 120, density: { enable: true } },
        shape: { type: 'line' },
        paint: {
          fill: { enable: false },
          stroke: { width: 1.4, color: { value: 'rgba(190,210,235,0.6)' } },
        },
        opacity: { value: { min: 0.35, max: 0.75 } },
        size: { value: { min: 6, max: 12 } },
        rotate: { value: 90 },
        move: {
          enable: true,
          direction: 'bottom',
          speed: { min: 10, max: 18 },
          straight: true,
          outModes: { default: 'out', bottom: 'out', top: 'none' },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return <ParticlesLayer options={options} />;
}
