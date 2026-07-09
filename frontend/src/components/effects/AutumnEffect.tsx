'use client';

import React, { useMemo } from 'react';
import type { ISourceOptions } from '@tsparticles/engine';
import { ParticlesLayer } from '../ParticlesLayer';

export function AutumnEffect() {
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles: {
        number: { value: 26, density: { enable: true } },
        shape: {
          type: 'emoji',
          options: { emoji: { value: ['🍁', '🍂', '🍃'] } },
        },
        opacity: { value: { min: 0.6, max: 1 } },
        size: { value: { min: 14, max: 22 } },
        rotate: {
          value: { min: 0, max: 360 },
          animation: { enable: true, speed: 6, sync: false },
        },
        move: {
          enable: true,
          direction: 'bottom',
          speed: { min: 1, max: 2.5 },
          straight: false,
          random: true,
          outModes: { default: 'out', bottom: 'out', top: 'none' },
        },
        wobble: { enable: true, distance: 20, speed: { min: 3, max: 6 } },
      },
      detectRetina: true,
    }),
    []
  );

  return <ParticlesLayer options={options} />;
}
