'use client';

import React, { useMemo } from 'react';
import type { ISourceOptions } from '@tsparticles/engine';
import { ParticlesLayer } from '../ParticlesLayer';

export function SnowEffect() {
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles: {
        number: { value: 60, density: { enable: true } },
        shape: {
          type: 'emoji',
          options: { emoji: { value: '❄️' } },
        },
        opacity: { value: { min: 0.2, max: 0.6 } },
        size: { value: { min: 6, max: 14 } },
        move: {
          enable: true,
          direction: 'bottom',
          speed: { min: 1, max: 3 },
          straight: false,
          random: true,
          outModes: { default: 'out', bottom: 'out', top: 'none' },
        },
        wobble: { enable: true, distance: 8, speed: { min: 3, max: 6 } },
      },
      detectRetina: true,
    }),
    []
  );

  return <ParticlesLayer options={options} />;
}
