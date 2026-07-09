'use client';

import React, { useId } from 'react';
import { Particles, ParticlesProvider, type ParticlesPluginRegistrar } from '@tsparticles/react';
import type { ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

const initEngine: ParticlesPluginRegistrar = async engine => {
  await loadSlim(engine);
};

export function ParticlesLayer({ options }: { options: ISourceOptions }) {
  const reactId = useId();
  const containerId = `particles-${reactId.replace(/:/g, '')}`;

  return (
    <ParticlesProvider init={initEngine}>
      <Particles id={containerId} className="section-weather-canvas" options={options} />
    </ParticlesProvider>
  );
}
