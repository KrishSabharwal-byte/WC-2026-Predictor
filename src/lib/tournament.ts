import { annexCMap, type RoundOf32Slot } from '../data/annexC';
import { GROUPS, type GroupId, type Team, getTeam } from '../data/teams';

export type Position = 1 | 2 | 3 | 4;

export interface GroupStanding {
  group: GroupId;
  first: string;
  second: string;
  third: string;
  fourth: string;
}

export interface KnockoutMatch {
  id: string;
  label: string;
  home: Team | null;
  away: Team | null;
  winnerId: string | null;
  round: KnockoutRound;
  feedsInto?: string;
}

export type KnockoutRound = 'r32' | 'r16' | 'qf' | 'sf' | 'final';

export interface TournamentState {
  standings: Record<GroupId, GroupStanding | null>;
  qualifyingThirdGroups: Set<GroupId>;
  knockout: Record<string, KnockoutMatch>;
  champion: Team | null;
}

interface MatchDef {
  id: string;
  label: string;
  round: KnockoutRound;
  home: string;
  away: string;
  thirdSlot?: RoundOf32Slot;
}

const R32_TEMPLATE: MatchDef[] = [
  { id: 'M73', label: 'Round of 32', round: 'r32', home: '2A', away: '2B' },
  { id: 'M74', label: 'Round of 32', round: 'r32', home: '1E', away: '3RD', thirdSlot: '1E' },
  { id: 'M75', label: 'Round of 32', round: 'r32', home: '1F', away: '2C' },
  { id: 'M76', label: 'Round of 32', round: 'r32', home: '1C', away: '2F' },
  { id: 'M77', label: 'Round of 32', round: 'r32', home: '1I', away: '3RD', thirdSlot: '1I' },
  { id: 'M78', label: 'Round of 32', round: 'r32', home: '2E', away: '2I' },
  { id: 'M79', label: 'Round of 32', round: 'r32', home: '1A', away: '3RD', thirdSlot: '1A' },
  { id: 'M80', label: 'Round of 32', round: 'r32', home: '1L', away: '3RD', thirdSlot: '1L' },
  { id: 'M81', label: 'Round of 32', round: 'r32', home: '1D', away: '3RD', thirdSlot: '1D' },
  { id: 'M82', label: 'Round of 32', round: 'r32', home: '1G', away: '3RD', thirdSlot: '1G' },
  { id: 'M83', label: 'Round of 32', round: 'r32', home: '2K', away: '2L' },
  { id: 'M84', label: 'Round of 32', round: 'r32', home: '1H', away: '2J' },
  { id: 'M85', label: 'Round of 32', round: 'r32', home: '1B', away: '3RD', thirdSlot: '1B' },
  { id: 'M86', label: 'Round of 32', round: 'r32', home: '1J', away: '2H' },
  { id: 'M87', label: 'Round of 32', round: 'r32', home: '1K', away: '3RD', thirdSlot: '1K' },
  { id: 'M88', label: 'Round of 32', round: 'r32', home: '2D', away: '2G' },
];

const KNOCKOUT_CHAIN: MatchDef[] = [
  ...R32_TEMPLATE,
  { id: 'M89', label: 'Round of 16', round: 'r16', home: 'W74', away: 'W77' },
  { id: 'M90', label: 'Round of 16', round: 'r16', home: 'W73', away: 'W75' },
  { id: 'M91', label: 'Round of 16', round: 'r16', home: 'W76', away: 'W78' },
  { id: 'M92', label: 'Round of 16', round: 'r16', home: 'W79', away: 'W80' },
  { id: 'M93', label: 'Round of 16', round: 'r16', home: 'W83', away: 'W84' },
  { id: 'M94', label: 'Round of 16', round: 'r16', home: 'W81', away: 'W82' },
  { id: 'M95', label: 'Round of 16', round: 'r16', home: 'W86', away: 'W88' },
  { id: 'M96', label: 'Round of 16', round: 'r16', home: 'W85', away: 'W87' },
  { id: 'M97', label: 'Quarter-final', round: 'qf', home: 'W89', away: 'W90' },
  { id: 'M98', label: 'Quarter-final', round: 'qf', home: 'W93', away: 'W94' },
  { id: 'M99', label: 'Quarter-final', round: 'qf', home: 'W91', away: 'W92' },
  { id: 'M100', label: 'Quarter-final', round: 'qf', home: 'W95', away: 'W96' },
  { id: 'M101', label: 'Semi-final', round: 'sf', home: 'W97', away: 'W98' },
  { id: 'M102', label: 'Semi-final', round: 'sf', home: 'W99', away: 'W100' },
  { id: 'M104', label: 'Final', round: 'final', home: 'W101', away: 'W102' },
];

export function createEmptyStandings(): Record<GroupId, GroupStanding | null> {
  return Object.fromEntries(GROUPS.map((g) => [g, null])) as Record<GroupId, GroupStanding | null>;
}

export function isGroupComplete(standing: GroupStanding | null): standing is GroupStanding {
  return standing !== null && !!standing.first && !!standing.second && !!standing.third && !!standing.fourth;
}

export function allGroupsComplete(standings: Record<GroupId, GroupStanding | null>): boolean {
  return GROUPS.every((g) => isGroupComplete(standings[g]));
}

export function getThirdPlaceTeams(standings: Record<GroupId, GroupStanding | null>): Team[] {
  return GROUPS.map((g) => {
    const s = standings[g];
    if (!s?.third) return null;
    return getTeam(g, s.third) ?? null;
  }).filter((t): t is Team => t !== null);
}

export function canProceedToKnockout(standings: Record<GroupId, GroupStanding | null>, qualifyingThirdGroups: Set<GroupId>): boolean {
  if (!allGroupsComplete(standings)) return false;
  return qualifyingThirdGroups.size === 8;
}

function resolveSlot(
  token: string,
  standings: Record<GroupId, GroupStanding | null>,
  qualifyingThirdGroups: Set<GroupId>,
  thirdMapping: Record<RoundOf32Slot, string> | null,
  winners: Record<string, string>
): Team | null {
  if (token.startsWith('W')) {
    const matchId = token.replace('W', 'M');
    const winnerId = winners[matchId];
    if (!winnerId) return null;
    for (const g of GROUPS) {
      const team = getTeam(g, winnerId);
      if (team) return team;
    }
    return null;
  }

  const pos = token[0];
  const group = token[1] as GroupId;
  const standing = standings[group];
  if (!standing) return null;

  if (pos === '1') {
    return getTeam(group, standing.first) ?? null;
  }
  if (pos === '2') {
    return getTeam(group, standing.second) ?? null;
  }
  if (pos === '3') {
    if (!qualifyingThirdGroups.has(group)) return null;
    if (!thirdMapping) return null;

    const slotForGroup = Object.entries(thirdMapping).find(([, src]) => src === `3${group}`);
    if (!slotForGroup) return null;

    return getTeam(group, standing.third) ?? null;
  }

  return null;
}

function getThirdPlaceMapping(qualifyingThirdGroups: Set<GroupId>): Record<RoundOf32Slot, string> | null {
  const key = [...qualifyingThirdGroups].sort().join('');
  return annexCMap[key] ?? null;
}

function resolveThirdFromSlot(
  slot: RoundOf32Slot,
  standings: Record<GroupId, GroupStanding | null>,
  qualifyingThirdGroups: Set<GroupId>,
  thirdMapping: Record<RoundOf32Slot, string>
): Team | null {
  const source = thirdMapping[slot];
  const group = source.replace('3', '') as GroupId;
  if (!qualifyingThirdGroups.has(group)) return null;
  const standing = standings[group];
  if (!standing?.third) return null;
  return getTeam(group, standing.third) ?? null;
}

export function buildKnockoutMatches(
  standings: Record<GroupId, GroupStanding | null>,
  qualifyingThirdGroups: Set<GroupId>,
  winners: Record<string, string>
): Record<string, KnockoutMatch> {
  const thirdMapping = getThirdPlaceMapping(qualifyingThirdGroups);
  const matches: Record<string, KnockoutMatch> = {};

  for (const def of KNOCKOUT_CHAIN) {
    const home = resolveSlot(def.home, standings, qualifyingThirdGroups, thirdMapping, winners);
    let away: Team | null = null;

    if (def.away === '3RD' && def.thirdSlot && thirdMapping) {
      away = resolveThirdFromSlot(def.thirdSlot, standings, qualifyingThirdGroups, thirdMapping);
    } else {
      away = resolveSlot(def.away, standings, qualifyingThirdGroups, thirdMapping, winners);
    }

    matches[def.id] = {
      id: def.id,
      label: def.label,
      home,
      away,
      winnerId: winners[def.id] ?? null,
      round: def.round,
    };
  }

  return matches;
}

export function getChampion(knockout: Record<string, KnockoutMatch>): Team | null {
  const final = knockout['M104'];
  if (!final?.winnerId) return null;
  return final.home?.id === final.winnerId ? final.home : final.away?.id === final.winnerId ? final.away : null;
}

export function toggleQualifyingThird(current: Set<GroupId>, group: GroupId): Set<GroupId> {
  const next = new Set(current);
  if (next.has(group)) {
    next.delete(group);
  } else if (next.size < 8) {
    next.add(group);
  }
  return next;
}

export function assignGroupPosition(
  standings: Record<GroupId, GroupStanding | null>,
  group: GroupId,
  teamId: string,
  position: Position
): Record<GroupId, GroupStanding | null> {
  const current = standings[group] ?? { group, first: '', second: '', third: '', fourth: '' };
  const slots: Array<keyof Pick<GroupStanding, 'first' | 'second' | 'third' | 'fourth'>> = ['first', 'second', 'third', 'fourth'];
  const slot = slots[position - 1];

  const next: GroupStanding = { ...current };
  for (const s of slots) {
    if (next[s] === teamId) next[s] = '';
  }
  next[slot] = teamId;

  return { ...standings, [group]: next };
}

export function clearGroup(standings: Record<GroupId, GroupStanding | null>, group: GroupId): Record<GroupId, GroupStanding | null> {
  return { ...standings, [group]: null };
}

export function getRoundMatches(knockout: Record<string, KnockoutMatch>, round: KnockoutRound): KnockoutMatch[] {
  return Object.values(knockout).filter((m) => m.round === round);
}

export function isRoundComplete(knockout: Record<string, KnockoutMatch>, round: KnockoutRound): boolean {
  const matches = getRoundMatches(knockout, round);
  return matches.length > 0 && matches.every((m) => !!m.winnerId);
}

export function getActiveKnockoutRound(knockout: Record<string, KnockoutMatch>): KnockoutRound | 'complete' | null {
  const order: KnockoutRound[] = ['r32', 'r16', 'qf', 'sf', 'final'];
  for (const round of order) {
    const matches = getRoundMatches(knockout, round);
    if (matches.length === 0) continue;
    if (!matches.every((m) => m.winnerId)) return round;
  }
  if (knockout['M104']?.winnerId) return 'complete';
  return null;
}

export function groupsProgress(standings: Record<GroupId, GroupStanding | null>): number {
  return GROUPS.filter((g) => isGroupComplete(standings[g])).length;
}
