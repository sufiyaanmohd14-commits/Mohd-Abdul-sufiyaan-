import { LeaderboardEntry } from '../types/game';
import { createSeededRandom, hashString, getTodayDateKey } from './dailyPuzzle';

const LEADERBOARD_PREFIX = 'blockblast_daily_leaderboard_';
const PLAYER_NAME_KEY = 'blockblast_player_name';
const DAILY_STREAK_KEY = 'blockblast_daily_streak';
const LAST_COMPLETED_KEY = 'blockblast_last_completed_date';
const DAILY_HISTORY_KEY = 'blockblast_daily_history';

// Pool of competitor identities for daily global rankings
const COMPETITOR_NAMES = [
  { name: 'VortexGrid', avatar: '⚡', badge: 'Grandmaster' },
  { name: 'NeonDrop', avatar: '🌙', badge: 'Puzzle Pro' },
  { name: 'PolyKing_99', avatar: '👑', badge: 'Speed Demon' },
  { name: 'ZenithEcho', avatar: '🌌', badge: 'Strategist' },
  { name: 'LavaCrusher', avatar: '🔥', badge: 'Combo Ace' },
  { name: 'FrostByte', avatar: '💎', badge: 'Architect' },
  { name: 'JadeNinja', avatar: '🌿', badge: 'Zen Master' },
  { name: 'RetroPixel', avatar: '🕹️', badge: 'Arcade Legend' },
  { name: 'SugarRush', avatar: '🍬', badge: 'High Roller' },
  { name: 'ShadowBlock', avatar: '⚔️', badge: 'Tactician' },
  { name: 'TitanClear', avatar: '🛡️', badge: 'Veteran' },
  { name: 'NovaBlast', avatar: '💥', badge: 'Top 1%' },
];

/**
 * Generates deterministic competitor entries for the day's puzzle.
 */
function generateSeededDailyCompetitors(dateKey: string): LeaderboardEntry[] {
  const seed = hashString(`competitors_${dateKey}`);
  const rand = createSeededRandom(seed);

  // Shuffle competitor names
  const competitors = [...COMPETITOR_NAMES].sort(() => rand() - 0.5);

  const baseScore = 2200 + Math.floor(rand() * 600); // 2200 - 2800
  const entries: LeaderboardEntry[] = [];

  competitors.slice(0, 9).forEach((comp, idx) => {
    const scoreOffset = Math.floor(rand() * 120) * (idx + 1);
    const score = Math.max(950, baseScore - scoreOffset);
    const movesUsed = 5 + Math.floor(rand() * 4) + Math.floor(idx / 3);
    const stars = idx < 3 ? 3 : idx < 7 ? 2 : 1;
    const timeSeconds = 45 + Math.floor(rand() * 75) + idx * 10;

    entries.push({
      id: `bot_${dateKey}_${idx}`,
      playerName: comp.name,
      score,
      movesUsed,
      stars,
      timeSeconds,
      isCurrentUser: false,
      dateKey,
      avatar: comp.avatar,
      badge: comp.badge,
      timestamp: Date.now() - (idx + 1) * 3600000,
    });
  });

  return entries;
}

/**
 * Get Leaderboard for a given date
 */
export function getDailyLeaderboard(dateKey: string = getTodayDateKey()): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];

  const storageKey = `${LEADERBOARD_PREFIX}${dateKey}`;
  const stored = localStorage.getItem(storageKey);

  let entries: LeaderboardEntry[] = [];

  if (stored) {
    try {
      entries = JSON.parse(stored);
    } catch {
      entries = [];
    }
  }

  // If no entries or competitors missing, initialize with seeded competitors
  if (entries.length === 0) {
    entries = generateSeededDailyCompetitors(dateKey);
    localStorage.setItem(storageKey, JSON.stringify(entries));
  }

  // Sort by score desc, then moves asc, then time asc
  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.movesUsed !== b.movesUsed) return a.movesUsed - b.movesUsed;
    return a.timeSeconds - b.timeSeconds;
  });

  // Assign ranks
  entries.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  return entries;
}

/**
 * Submit User's Daily Score to Leaderboard
 */
export function submitDailyScore(params: {
  dateKey: string;
  playerName: string;
  score: number;
  movesUsed: number;
  stars: number;
  timeSeconds: number;
}): { entries: LeaderboardEntry[]; userRank: number } {
  const { dateKey, playerName, score, movesUsed, stars, timeSeconds } = params;

  // Persist player name
  savePlayerName(playerName);

  const entries = getDailyLeaderboard(dateKey);

  // Check if user already has an entry for this date
  const existingIdx = entries.findIndex((e) => e.isCurrentUser);

  const userEntry: LeaderboardEntry = {
    id: `user_${dateKey}`,
    playerName: playerName || 'Player',
    score,
    movesUsed,
    stars,
    timeSeconds,
    isCurrentUser: true,
    dateKey,
    avatar: '😎',
    badge: stars === 3 ? 'Puzzle Master' : 'Challenger',
    timestamp: Date.now(),
  };

  if (existingIdx !== -1) {
    // Only update if score is better
    if (score > entries[existingIdx].score) {
      entries[existingIdx] = userEntry;
    }
  } else {
    entries.push(userEntry);
  }

  // Re-sort
  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.movesUsed !== b.movesUsed) return a.movesUsed - b.movesUsed;
    return a.timeSeconds - b.timeSeconds;
  });

  entries.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  // Save back to localStorage
  const storageKey = `${LEADERBOARD_PREFIX}${dateKey}`;
  localStorage.setItem(storageKey, JSON.stringify(entries));

  // Update daily streak & history
  updateDailyStreak(dateKey, stars, score);

  const userRank = entries.findIndex((e) => e.isCurrentUser) + 1;
  return { entries, userRank };
}

/**
 * Player Name Getter / Setter
 */
export function getSavedPlayerName(): string {
  if (typeof window === 'undefined') return 'Player';
  return localStorage.getItem(PLAYER_NAME_KEY) || 'BlockMaster';
}

export function savePlayerName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PLAYER_NAME_KEY, name.trim() || 'Player');
}

/**
 * Daily Streak & History Management
 */
export function getDailyStreak(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(DAILY_STREAK_KEY) || '0', 10);
}

export function updateDailyStreak(dateKey: string, stars: number, score: number) {
  if (typeof window === 'undefined') return;

  const lastDate = localStorage.getItem(LAST_COMPLETED_KEY);
  let streak = parseInt(localStorage.getItem(DAILY_STREAK_KEY) || '0', 10);

  // If already completed today, keep streak
  if (lastDate !== dateKey) {
    // Check if yesterday was completed
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (lastDate === yKey) {
      streak += 1;
    } else {
      streak = 1; // streak reset/start fresh
    }

    localStorage.setItem(DAILY_STREAK_KEY, String(streak));
    localStorage.setItem(LAST_COMPLETED_KEY, dateKey);
  }

  // Update history record
  try {
    const history = JSON.parse(localStorage.getItem(DAILY_HISTORY_KEY) || '{}');
    history[dateKey] = {
      stars: Math.max(stars, history[dateKey]?.stars || 0),
      score: Math.max(score, history[dateKey]?.score || 0),
      completedAt: Date.now(),
    };
    localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export function isDailyCompleted(dateKey: string = getTodayDateKey()): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const history = JSON.parse(localStorage.getItem(DAILY_HISTORY_KEY) || '{}');
    return Boolean(history[dateKey]);
  } catch {
    return false;
  }
}

export function getDailyHistoryRecord(dateKey: string) {
  if (typeof window === 'undefined') return null;
  try {
    const history = JSON.parse(localStorage.getItem(DAILY_HISTORY_KEY) || '{}');
    return history[dateKey] || null;
  } catch {
    return null;
  }
}
