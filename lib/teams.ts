// Superteam chapters in the bean battle. A visitor's country (from Vercel's IP geolocation)
// decides which team their spilt beans count for. Anywhere else counts for "Rest of the world".
export type Team = { id: string; name: string; flag: string; countries: string[] };

// The 25 official chapters listed on superteam.fun (checked Sept 2026).
export const TEAMS: Team[] = [
  { id: 'uk', name: 'Superteam UK', flag: '🇬🇧', countries: ['GB', 'IM', 'JE', 'GG'] },
  { id: 'ae', name: 'Superteam UAE', flag: '🇦🇪', countries: ['AE'] },
  { id: 'es', name: 'Superteam Spain', flag: '🇪🇸', countries: ['ES'] },
  { id: 'pl', name: 'Superteam Poland', flag: '🇵🇱', countries: ['PL'] },
  { id: 'br', name: 'Superteam Brazil', flag: '🇧🇷', countries: ['BR'] },
  { id: 'ua', name: 'Superteam Ukraine', flag: '🇺🇦', countries: ['UA'] },
  { id: 'nl', name: 'Superteam Netherlands', flag: '🇳🇱', countries: ['NL'] },
  { id: 'kz', name: 'Superteam Kazakhstan', flag: '🇰🇿', countries: ['KZ'] },
  { id: 'ar', name: 'Superteam Argentina', flag: '🇦🇷', countries: ['AR'] },
  { id: 'th', name: 'Superteam Thailand', flag: '🇹🇭', countries: ['TH'] },
  { id: 'vn', name: 'Superteam Vietnam', flag: '🇻🇳', countries: ['VN'] },
  { id: 'jp', name: 'Superteam Japan', flag: '🇯🇵', countries: ['JP'] },
  { id: 'sg', name: 'Superteam Singapore', flag: '🇸🇬', countries: ['SG'] },
  // Active in Croatia, Serbia, Montenegro, Slovenia, Bulgaria and Romania, plus the rest of the Balkans.
  { id: 'balkan', name: 'Superteam Balkan', flag: '🏔️', countries: ['HR', 'RS', 'ME', 'SI', 'BG', 'RO', 'BA', 'MK', 'XK', 'AL'] },
  { id: 'kr', name: 'Superteam Korea', flag: '🇰🇷', countries: ['KR'] },
  { id: 'de', name: 'Superteam Germany', flag: '🇩🇪', countries: ['DE'] },
  { id: 'us', name: 'Superteam USA', flag: '🇺🇸', countries: ['US', 'PR'] },
  { id: 'ie', name: 'Superteam Ireland', flag: '🇮🇪', countries: ['IE'] },
  { id: 'ge', name: 'Superteam Georgia', flag: '🇬🇪', countries: ['GE'] },
  { id: 'my', name: 'Superteam Malaysia', flag: '🇲🇾', countries: ['MY'] },
  { id: 'tr', name: 'Superteam Turkey', flag: '🇹🇷', countries: ['TR'] },
  { id: 'ca', name: 'Superteam Canada', flag: '🇨🇦', countries: ['CA'] },
  { id: 'in', name: 'Superteam India', flag: '🇮🇳', countries: ['IN'] },
  { id: 'au', name: 'Superteam Australia', flag: '🇦🇺', countries: ['AU'] },
  { id: 'ng', name: 'Superteam Nigeria', flag: '🇳🇬', countries: ['NG'] },
];

export const REST_OF_WORLD: Team = { id: 'world', name: 'Rest of the world', flag: '🌍', countries: [] };

const byCountry = new Map(TEAMS.flatMap(t => t.countries.map(c => [c, t] as const)));
export const teamForCountry = (cc: string | null | undefined) => (cc && byCountry.get(cc.toUpperCase())) || REST_OF_WORLD;
export const teamById = (id: string) => TEAMS.find(t => t.id === id) || (id === REST_OF_WORLD.id ? REST_OF_WORLD : null);
