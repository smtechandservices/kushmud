import { SiteEffect } from './data';

const SOUTHERN_HEMISPHERE_TIMEZONES = [
  'Australia/', 'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Chatham',
  'America/Sao_Paulo', 'America/Argentina', 'America/Santiago', 'America/Lima',
  'America/Asuncion', 'America/Montevideo', 'Africa/Johannesburg', 'Africa/Windhoek',
  'Indian/Antananarivo', 'Indian/Mauritius', 'Indian/Reunion',
];

function isSouthernHemisphere(timeZone: string): boolean {
  return SOUTHERN_HEMISPHERE_TIMEZONES.some(tz => timeZone.startsWith(tz));
}

/** Resolves the 'auto' setting to a concrete effect using the visitor's local date and hemisphere. */
export function resolveAutoEffect(): SiteEffect {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  if (month === 8 && day === 15) return 'independence_day';

  const southern = isSouthernHemisphere(timeZone);
  const effectiveMonth = southern ? ((month + 5) % 12) + 1 : month; // shift by 6 months

  if (effectiveMonth === 12 || effectiveMonth === 1 || effectiveMonth === 2) return 'snow';
  if (effectiveMonth >= 6 && effectiveMonth <= 9) return 'rain';
  if (effectiveMonth === 10 || effectiveMonth === 11) return 'autumn';
  return 'none';
}
