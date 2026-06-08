import './style.css';
import { GROUPS, GROUP_TEAMS, type GroupId, type Team } from './data/teams';
import { flagImg } from './lib/flags';
import {
  allGroupsComplete,
  assignGroupPosition,
  buildKnockoutMatches,
  canProceedToKnockout,
  clearGroup,
  createEmptyStandings,
  getActiveKnockoutRound,
  getChampion,
  getRoundMatches,
  getThirdPlaceTeams,
  groupsProgress,
  isGroupComplete,
  toggleQualifyingThird,
  type GroupStanding,
  type KnockoutMatch,
  type KnockoutRound,
} from './lib/tournament';

type View = 'groups' | 'knockout' | 'winner';

interface AppState {
  view: View;
  standings: Record<GroupId, GroupStanding | null>;
  qualifyingThirdGroups: Set<GroupId>;
  winners: Record<string, string>;
  activeGroup: GroupId;
}

const STORAGE_KEY = 'wc2026-predictor';

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        view: parsed.view ?? 'groups',
        standings: parsed.standings ?? createEmptyStandings(),
        qualifyingThirdGroups: new Set(parsed.qualifyingThirdGroups ?? []),
        winners: parsed.winners ?? {},
        activeGroup: parsed.activeGroup ?? 'A',
      };
    }
  } catch {
    /* ignore */
  }
  return {
    view: 'groups',
    standings: createEmptyStandings(),
    qualifyingThirdGroups: new Set(),
    winners: {},
    activeGroup: 'A',
  };
}

function saveState(state: AppState) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...state,
      qualifyingThirdGroups: [...state.qualifyingThirdGroups],
    })
  );
}

let state = loadState();

const ROUND_LABELS: Record<KnockoutRound, string> = {
  r32: 'Round of 32',
  r16: 'Round of 16',
  qf: 'Quarter-finals',
  sf: 'Semi-finals',
  final: 'Final',
};

const ROUND_ORDER: KnockoutRound[] = ['r32', 'r16', 'qf', 'sf', 'final'];

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const knockout = canProceedToKnockout(state.standings, state.qualifyingThirdGroups)
    ? buildKnockoutMatches(state.standings, state.qualifyingThirdGroups, state.winners)
    : {};
  const champion = getChampion(knockout);
  const progress = groupsProgress(state.standings);
  const thirds = getThirdPlaceTeams(state.standings);
  const readyForKnockout = canProceedToKnockout(state.standings, state.qualifyingThirdGroups);
  const activeRound = getActiveKnockoutRound(knockout);

  app.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <div class="brand">
          <span class="brand-icon">🏆</span>
          <div>
            <p class="brand-kicker">FIFA World Cup 2026</p>
            <h1 class="brand-title">Predictor Simulator</h1>
          </div>
        </div>
        <p class="header-tagline">Select group winners, runners-up and the eight best third-place teams — then predict every knockout match to the final.</p>
      </div>
    </header>

    <nav class="step-nav">
      <button class="step-btn ${state.view === 'groups' ? 'active' : ''}" data-view="groups">
        <span class="step-num">1</span> Group Stage
        <span class="step-meta">${progress}/12 groups</span>
      </button>
      <button class="step-btn ${state.view === 'knockout' ? 'active' : ''}" data-view="knockout" ${!readyForKnockout ? 'disabled' : ''}>
        <span class="step-num">2</span> Knockout
        <span class="step-meta">${readyForKnockout ? 'Ready' : 'Complete groups first'}</span>
      </button>
      <button class="step-btn ${state.view === 'winner' ? 'active' : ''}" data-view="winner" ${!champion ? 'disabled' : ''}>
        <span class="step-num">3</span> Your Winner
      </button>
    </nav>

    <main class="main-content">
      ${state.view === 'groups' ? renderGroupsView(thirds) : ''}
      ${state.view === 'knockout' ? renderKnockoutView(knockout, activeRound) : ''}
      ${state.view === 'winner' && champion ? renderWinnerView(champion) : ''}
    </main>

    <footer class="site-footer">
      <button class="btn btn-ghost" id="reset-btn">Reset prediction</button>
      <p>48 teams · 12 groups · 8 best third-place teams advance · Official FIFA Annex C bracket mapping</p>
    </footer>
  `;

  bindEvents(knockout, readyForKnockout);
  saveState(state);
}

function renderGroupsView(thirds: Team[]): string {
  const standing = state.standings[state.activeGroup];
  const teams = GROUP_TEAMS[state.activeGroup];

  return `
    <section class="groups-layout">
      <aside class="group-tabs">
        <h2>Groups</h2>
        <div class="group-tab-list">
          ${GROUPS.map((g) => {
            const done = isGroupComplete(state.standings[g]);
            return `
              <button class="group-tab ${g === state.activeGroup ? 'active' : ''} ${done ? 'done' : ''}" data-group="${g}">
                Group ${g}
                ${done ? '<span class="check">✓</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>
      </aside>

      <section class="group-panel">
        <div class="panel-header">
          <h2>Group ${state.activeGroup}</h2>
          <button class="btn btn-ghost btn-sm" data-clear-group="${state.activeGroup}">Clear group</button>
        </div>

        <p class="panel-hint">Tap a team, then tap a position to set the finishing order. The team in 3rd place can be selected as one of the eight best third-placed teams below.</p>

        <div class="selected-team-banner" id="selected-team-banner">
          ${selectedTeamId ? `Selected: <strong>${teams.find((t) => t.id === selectedTeamId)?.name}</strong> — choose a position` : 'Select a team below'}
        </div>

        <div class="positions-grid">
          ${renderPositionSlot(state.activeGroup, standing, 1, '1st — Group Winner')}
          ${renderPositionSlot(state.activeGroup, standing, 2, '2nd — Runner-up')}
          ${renderPositionSlot(state.activeGroup, standing, 3, '3rd place')}
          ${renderPositionSlot(state.activeGroup, standing, 4, '4th place')}
        </div>

        <div class="team-picker">
          ${teams.map((team) => {
            const assigned = standing && [standing.first, standing.second, standing.third, standing.fourth].includes(team.id);
            return `
              <button class="team-chip ${assigned ? 'assigned' : ''} ${selectedTeamId === team.id ? 'selected' : ''}" data-pick-team="${team.id}">
                ${flagImg(team.flagCode, 'md', team.name)}
                <span class="name">${team.name}</span>
                <span class="code">${team.code}</span>
              </button>
            `;
          }).join('')}
        </div>
      </section>

      <aside class="thirds-panel">
        <h2>Best 3rd-place teams</h2>
        <p class="panel-hint">Select exactly <strong>8</strong> of the 12 third-placed teams to advance to the Round of 32.</p>
        <div class="thirds-counter ${state.qualifyingThirdGroups.size === 8 ? 'complete' : ''}">
          ${state.qualifyingThirdGroups.size} / 8 selected
        </div>
        <div class="thirds-list">
          ${thirds.length === 0 ? '<p class="empty-note">Complete group standings to see third-placed teams.</p>' : thirds.map((team) => {
            const selected = state.qualifyingThirdGroups.has(team.group);
            const disabled = !selected && state.qualifyingThirdGroups.size >= 8;
            return `
              <button class="third-chip ${selected ? 'selected' : ''}" data-third-group="${team.group}" ${disabled ? 'disabled' : ''}>
                ${flagImg(team.flagCode, 'sm', team.name)}
                <div>
                  <span class="name">${team.name}</span>
                  <span class="meta">Group ${team.group} · 3rd</span>
                </div>
                ${selected ? '<span class="badge">Advances</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        ${canProceedToKnockout(state.standings, state.qualifyingThirdGroups) ? `
          <button class="btn btn-primary btn-block" id="go-knockout">Continue to knockout stage →</button>
        ` : `
          <div class="progress-note">
            ${!allGroupsComplete(state.standings) ? `<p>Complete all 12 groups (${groupsProgress(state.standings)}/12 done)</p>` : ''}
            ${state.qualifyingThirdGroups.size !== 8 ? `<p>Select ${8 - state.qualifyingThirdGroups.size} more third-place team(s)</p>` : ''}
          </div>
        `}
      </aside>
    </section>
  `;
}

let selectedTeamId: string | null = null;

function renderPositionSlot(group: GroupId, standing: GroupStanding | null, pos: 1 | 2 | 3 | 4, label: string): string {
  const slots = ['first', 'second', 'third', 'fourth'] as const;
  const teamId = standing?.[slots[pos - 1]] ?? '';
  const team = teamId ? GROUP_TEAMS[group].find((t) => t.id === teamId) : null;

  return `
    <button class="position-slot pos-${pos} ${team ? 'filled' : ''}" data-position="${pos}">
      <span class="pos-label">${label}</span>
      ${team ? `
        ${flagImg(team.flagCode, 'md', team.name)}
        <span class="team-name">${team.name}</span>
      ` : '<span class="placeholder">Tap to assign</span>'}
    </button>
  `;
}

function renderKnockoutView(knockout: Record<string, KnockoutMatch>, activeRound: KnockoutRound | 'complete' | null): string {
  return `
    <section class="knockout-layout">
      <div class="knockout-header">
        <h2>Knockout Stage</h2>
        <p>Click the team you think will win each match. The bracket updates automatically using FIFA's official Round of 32 mapping.</p>
        ${activeRound && activeRound !== 'complete' ? `<div class="active-round-pill">Now predicting: ${ROUND_LABELS[activeRound]}</div>` : ''}
      </div>

      <div class="rounds-container">
        ${ROUND_ORDER.map((round) => {
          const matches = getRoundMatches(knockout, round);
          if (matches.length === 0) return '';
          return `
            <section class="round-section">
              <h3>${ROUND_LABELS[round]}</h3>
              <div class="matches-grid ${round}">
                ${matches.map((m) => renderMatchCard(m, activeRound)).join('')}
              </div>
            </section>
          `;
        }).join('')}
      </div>

      ${activeRound === 'complete' ? `
        <div class="knockout-complete">
          <button class="btn btn-primary" data-view="winner">See your World Cup winner →</button>
        </div>
      ` : ''}
    </section>
  `;
}

function renderMatchCard(match: KnockoutMatch, activeRound: KnockoutRound | 'complete' | null): string {
  const canPlay = match.home && match.away;
  const isActiveRound = activeRound === match.round;
  const locked = !isActiveRound && !match.winnerId && activeRound !== 'complete' && activeRound !== null;

  return `
    <div class="match-card ${match.winnerId ? 'resolved' : ''} ${locked ? 'locked' : ''}" data-match="${match.id}">
      <div class="match-id">${match.id}</div>
      ${renderMatchTeam(match, 'home', canPlay, isActiveRound)}
      <div class="match-vs">vs</div>
      ${renderMatchTeam(match, 'away', canPlay, isActiveRound)}
    </div>
  `;
}

function renderMatchTeam(match: KnockoutMatch, side: 'home' | 'away', canPlay: Team | null, isActiveRound: boolean): string {
  const team = side === 'home' ? match.home : match.away;
  if (!team) {
    return `<div class="match-team empty"><span class="tbd">TBD</span></div>`;
  }

  const isWinner = match.winnerId === team.id;
  const clickable = canPlay && isActiveRound;

  return `
    <button class="match-team ${isWinner ? 'winner' : ''} ${clickable ? 'clickable' : ''}"
      data-match-winner="${match.id}"
      data-team-id="${team.id}"
      ${!clickable ? 'disabled' : ''}>
      ${flagImg(team.flagCode, 'sm', team.name)}
      <span class="name">${team.name}</span>
      ${isWinner ? '<span class="winner-badge">✓</span>' : ''}
    </button>
  `;
}

function renderWinnerView(champion: Team): string {
  return `
    <section class="winner-layout">
      <div class="winner-card">
        <p class="winner-kicker">Your predicted champion</p>
        <div class="winner-flag">${flagImg(champion.flagCode, 'xl', champion.name)}</div>
        <h2>${champion.name}</h2>
        <p class="winner-code">${champion.code}</p>
        <p class="winner-copy">You've plotted the path through all 12 groups and every knockout round. Share your prediction or start again with a different scenario.</p>
        <div class="winner-actions">
          <button class="btn btn-primary" data-view="knockout">Review bracket</button>
          <button class="btn btn-ghost" id="reset-btn">Start over</button>
        </div>
      </div>
    </section>
  `;
}

function bindEvents(knockout: Record<string, KnockoutMatch>, readyForKnockout: boolean) {
  document.querySelectorAll('[data-view]').forEach((el) => {
    el.addEventListener('click', () => {
      const view = (el as HTMLElement).dataset.view as View;
      if (view === 'knockout' && !readyForKnockout) return;
      if (view === 'winner' && !getChampion(knockout)) return;
      state.view = view;
      render();
    });
  });

  document.querySelectorAll('[data-group]').forEach((el) => {
    el.addEventListener('click', () => {
      state.activeGroup = (el as HTMLElement).dataset.group as GroupId;
      selectedTeamId = null;
      render();
    });
  });

  document.querySelectorAll('[data-pick-team]').forEach((el) => {
    el.addEventListener('click', () => {
      selectedTeamId = (el as HTMLElement).dataset.pickTeam ?? null;
      render();
    });
  });

  document.querySelectorAll('[data-position]').forEach((el) => {
    el.addEventListener('click', () => {
      if (!selectedTeamId) return;
      const pos = parseInt((el as HTMLElement).dataset.position ?? '1', 10) as 1 | 2 | 3 | 4;
      state.standings = assignGroupPosition(state.standings, state.activeGroup, selectedTeamId, pos);
      selectedTeamId = null;
      render();
    });
  });

  document.querySelectorAll('[data-clear-group]').forEach((el) => {
    el.addEventListener('click', () => {
      const group = (el as HTMLElement).dataset.clearGroup as GroupId;
      state.standings = clearGroup(state.standings, group);
      state.qualifyingThirdGroups.delete(group);
      render();
    });
  });

  document.querySelectorAll('[data-third-group]').forEach((el) => {
    el.addEventListener('click', () => {
      const group = (el as HTMLElement).dataset.thirdGroup as GroupId;
      state.qualifyingThirdGroups = toggleQualifyingThird(state.qualifyingThirdGroups, group);
      render();
    });
  });

  document.getElementById('go-knockout')?.addEventListener('click', () => {
    state.view = 'knockout';
    state.winners = {};
    render();
  });

  document.querySelectorAll('[data-match-winner]').forEach((el) => {
    el.addEventListener('click', () => {
      const matchId = (el as HTMLElement).dataset.matchWinner ?? '';
      const teamId = (el as HTMLElement).dataset.teamId ?? '';
      setMatchWinner(matchId, teamId);
      render();
    });
  });

  document.querySelectorAll('#reset-btn').forEach((el) => {
    el.addEventListener('click', () => {
      if (confirm('Reset your entire prediction?')) {
        state = {
          view: 'groups',
          standings: createEmptyStandings(),
          qualifyingThirdGroups: new Set(),
          winners: {},
          activeGroup: 'A',
        };
        selectedTeamId = null;
        localStorage.removeItem(STORAGE_KEY);
        render();
      }
    });
  });
}

const MATCH_ORDER = [
  'M73', 'M74', 'M75', 'M76', 'M77', 'M78', 'M79', 'M80', 'M81', 'M82', 'M83', 'M84', 'M85', 'M86', 'M87', 'M88',
  'M89', 'M90', 'M91', 'M92', 'M93', 'M94', 'M95', 'M96',
  'M97', 'M98', 'M99', 'M100',
  'M101', 'M102',
  'M104',
];

function setMatchWinner(matchId: string, teamId: string) {
  state.winners[matchId] = teamId;
  const idx = MATCH_ORDER.indexOf(matchId);
  if (idx >= 0) {
    for (let i = idx + 1; i < MATCH_ORDER.length; i++) {
      delete state.winners[MATCH_ORDER[i]];
    }
  }
}

render();
