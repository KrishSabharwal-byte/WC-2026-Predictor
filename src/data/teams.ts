export type GroupId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';

export interface Team {
  id: string;
  name: string;
  code: string;
  /** ISO code for flagcdn.com (e.g. mx, gb-eng, gb-sct) */
  flagCode: string;
  group: GroupId;
}

export const GROUPS: GroupId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const GROUP_TEAMS: Record<GroupId, Omit<Team, 'group'>[]> = {
  A: [
    { id: 'mex', name: 'Mexico', code: 'MEX', flagCode: 'mx' },
    { id: 'rsa', name: 'South Africa', code: 'RSA', flagCode: 'za' },
    { id: 'kor', name: 'South Korea', code: 'KOR', flagCode: 'kr' },
    { id: 'cze', name: 'Czech Republic', code: 'CZE', flagCode: 'cz' },
  ],
  B: [
    { id: 'can', name: 'Canada', code: 'CAN', flagCode: 'ca' },
    { id: 'bih', name: 'Bosnia & Herzegovina', code: 'BIH', flagCode: 'ba' },
    { id: 'qat', name: 'Qatar', code: 'QAT', flagCode: 'qa' },
    { id: 'sui', name: 'Switzerland', code: 'SUI', flagCode: 'ch' },
  ],
  C: [
    { id: 'bra', name: 'Brazil', code: 'BRA', flagCode: 'br' },
    { id: 'mar', name: 'Morocco', code: 'MAR', flagCode: 'ma' },
    { id: 'sco', name: 'Scotland', code: 'SCO', flagCode: 'gb-sct' },
    { id: 'hai', name: 'Haiti', code: 'HAI', flagCode: 'ht' },
  ],
  D: [
    { id: 'usa', name: 'USA', code: 'USA', flagCode: 'us' },
    { id: 'par', name: 'Paraguay', code: 'PAR', flagCode: 'py' },
    { id: 'aus', name: 'Australia', code: 'AUS', flagCode: 'au' },
    { id: 'tur', name: 'Turkey', code: 'TUR', flagCode: 'tr' },
  ],
  E: [
    { id: 'ger', name: 'Germany', code: 'GER', flagCode: 'de' },
    { id: 'cuw', name: 'Curaçao', code: 'CUW', flagCode: 'cw' },
    { id: 'civ', name: 'Ivory Coast', code: 'CIV', flagCode: 'ci' },
    { id: 'ecu', name: 'Ecuador', code: 'ECU', flagCode: 'ec' },
  ],
  F: [
    { id: 'ned', name: 'Netherlands', code: 'NED', flagCode: 'nl' },
    { id: 'jpn', name: 'Japan', code: 'JPN', flagCode: 'jp' },
    { id: 'swe', name: 'Sweden', code: 'SWE', flagCode: 'se' },
    { id: 'tun', name: 'Tunisia', code: 'TUN', flagCode: 'tn' },
  ],
  G: [
    { id: 'bel', name: 'Belgium', code: 'BEL', flagCode: 'be' },
    { id: 'egy', name: 'Egypt', code: 'EGY', flagCode: 'eg' },
    { id: 'irn', name: 'Iran', code: 'IRN', flagCode: 'ir' },
    { id: 'nzl', name: 'New Zealand', code: 'NZL', flagCode: 'nz' },
  ],
  H: [
    { id: 'esp', name: 'Spain', code: 'ESP', flagCode: 'es' },
    { id: 'cpv', name: 'Cape Verde', code: 'CPV', flagCode: 'cv' },
    { id: 'uru', name: 'Uruguay', code: 'URU', flagCode: 'uy' },
    { id: 'ksa', name: 'Saudi Arabia', code: 'KSA', flagCode: 'sa' },
  ],
  I: [
    { id: 'fra', name: 'France', code: 'FRA', flagCode: 'fr' },
    { id: 'sen', name: 'Senegal', code: 'SEN', flagCode: 'sn' },
    { id: 'nor', name: 'Norway', code: 'NOR', flagCode: 'no' },
    { id: 'irq', name: 'Iraq', code: 'IRQ', flagCode: 'iq' },
  ],
  J: [
    { id: 'arg', name: 'Argentina', code: 'ARG', flagCode: 'ar' },
    { id: 'alg', name: 'Algeria', code: 'ALG', flagCode: 'dz' },
    { id: 'aut', name: 'Austria', code: 'AUT', flagCode: 'at' },
    { id: 'jor', name: 'Jordan', code: 'JOR', flagCode: 'jo' },
  ],
  K: [
    { id: 'por', name: 'Portugal', code: 'POR', flagCode: 'pt' },
    { id: 'cod', name: 'DR Congo', code: 'COD', flagCode: 'cd' },
    { id: 'uzb', name: 'Uzbekistan', code: 'UZB', flagCode: 'uz' },
    { id: 'col', name: 'Colombia', code: 'COL', flagCode: 'co' },
  ],
  L: [
    { id: 'eng', name: 'England', code: 'ENG', flagCode: 'gb-eng' },
    { id: 'cro', name: 'Croatia', code: 'CRO', flagCode: 'hr' },
    { id: 'gha', name: 'Ghana', code: 'GHA', flagCode: 'gh' },
    { id: 'pan', name: 'Panama', code: 'PAN', flagCode: 'pa' },
  ],
};

export function getTeam(group: GroupId, teamId: string): Team | undefined {
  const base = GROUP_TEAMS[group].find((t) => t.id === teamId);
  return base ? { ...base, group } : undefined;
}

export function getAllTeams(): Team[] {
  return GROUPS.flatMap((g) => GROUP_TEAMS[g].map((t) => ({ ...t, group: g })));
}
