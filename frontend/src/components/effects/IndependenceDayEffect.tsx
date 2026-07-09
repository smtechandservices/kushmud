'use client';

import React, { useMemo } from 'react';
import type { ISourceOptions } from '@tsparticles/engine';
import { ParticlesLayer } from '../ParticlesLayer';

export function IndependenceDayEffect() {
  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: 'transparent' } },
      fpsLimit: 60,
      particles: {
        number: { value: 22, density: { enable: true } },
        shape: {
          type: 'emoji',
          options: { emoji: { value: ['🪁'] } },
        },
        opacity: { value: { min: 0.2, max: 0.6 } },
        size: { value: { min: 16, max: 26 } },
        rotate: {
          value: { min: -25, max: 25 },
          animation: { enable: true, speed: 8, sync: false },
        },
        move: {
          enable: true,
          direction: 'top',
          speed: { min: 1.2, max: 3 },
          straight: false,
          random: true,
          outModes: { default: 'out', top: 'out', bottom: 'none' },
        },
        wobble: { enable: true, distance: 28, speed: { min: 5, max: 10 } },
      },
      detectRetina: true,
    }),
    []
  );

  return <ParticlesLayer options={options} />;
}
