import React from 'react';
import { Difficulty, GameMode, UnifiedGrid, Achievement, BridgesLine, BridgesIsland, UserStats, GameSpecificStats, LevelStats, KakuroGrid, SudokuGrid, NonogramGrid, NonogramClues, SkyscrapersGrid, TakuzuGrid, AkariGrid, FutoshikiGrid, TentsGrid, TentsClues, ShikakuClue, ShikakuRect, HitoriGrid, NurikabeGrid } from './types';

// Sound Keys (Logic handled in SoundManager.ts via Web Audio API)
export const SOUND_MAP = {
    CLICK: 'CLICK',
    SWITCH: 'SWITCH',
    UNLOCK: 'UNLOCK',
    VICTORY: 'VICTORY',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS'
};

export const ACHIEVEMENT_SOUND = 'UNLOCK'; 

// Icons
export const Icons: any = {
  SUDOKU: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
  KAKURO: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 3l18 18"/></svg>,
  NONOGRAM: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="9" y="9" width="6" height="6" fill="currentColor" opacity="0.5"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,
  SKYSCRAPERS: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 10h4v11H9z"/></svg>,
  TAKUZU: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="6" cy="6" r="1.5" fill="currentColor"/><rect x="11" y="11" width="2" height="2" fill="currentColor"/></svg>,
  AKARI: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7zM9 18h6M10 22h4"/></svg>,
  FUTOSHIKI: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8l4 4-4 4M17 16l-4-4 4-4"/></svg>,
  TENTS: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4l-9 15h18zM12 4v15M8 19l4-9 4 9"/></svg>,
  SHIKAKU: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="3" y="3" width="6" height="12" fill="currentColor" fillOpacity="0.2"/><rect x="9" y="15" width="12" height="6" fill="currentColor" fillOpacity="0.2"/></svg>,
  BRIDGES: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h6M18 15v-6M6 9v9M9 18h6"/></svg>,
  HITORI: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="4" y="4" width="4" height="4" fill="currentColor"/><rect x="16" y="10" width="4" height="4" fill="currentColor"/><rect x="10" y="16" width="4" height="4" fill="currentColor"/></svg>,
  NURIKABE: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="8" y="8" width="8" height="8" fill="currentColor"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>,

  BRAIN: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.5 2A5.5 5.5 0 0 0 4 7.5a5.5 5.5 0 0 0 2 3.5 5.5 5.5 0 0 0 3.5 2V22"/><path d="M14.5 2A5.5 5.5 0 0 1 20 7.5a5.5 5.5 0 0 1-2 3.5 5.5 5.5 5.5 0 0 1-3.5 2V22"/><path d="M12 13V22"/><path d="M8 22h8"/></svg>,
  
  Back: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  Reset: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"/></svg>,
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  CheckCircle: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Lightbulb: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5a6 6 0 0 0-11.4 0c0 1.5.5 2.5 1.5 3.5.8.8 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/></svg>,
  Eraser: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21M22 21H7M5 11l9 9"/></svg>,
  Tree: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L4 14h16z" fill="currentColor" fillOpacity="0.2"/><path d="M12 14v8"/></svg>,
  TentIcon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M12 3L2 19h20L12 3z"/><path d="M12 12v7" stroke="white"/></svg>,
  BulbIcon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7zM9 18h6M10 22h4"/></svg>,
  XMark: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trophy: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M12 15v7" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
  Help: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  Levels: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>,
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Akari: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="6"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2"/></svg>,
  STAR: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  FIRE: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
  MEDAL: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  FLASH: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  CLOCK: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  MOON: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  EYE: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  ChartBar: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>,
  ChevronDown: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  Calendar: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  Badge: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6Z"/><path d="M12 15v7"/><path d="m9 22 3-3 3 3"/></svg>,
  Cog: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5.343c-.2.143-.386.307-.557.492l-1.684-.442a1.875 1.875 0 00-2.224 1.22l-.717 2.373a1.875 1.875 0 00.993 2.29l1.533.639c-.01.247-.01.495 0 .742l-1.533.64a1.875 1.875 0 00-.994 2.29l.717 2.373c.31.954 1.285 1.522 2.224 1.22l1.684-.442c.17.185.357.35.557.492l.178 1.527c.15.903.933 1.566 1.85 1.566h2.344c.916 0 1.699-.663 1.85-1.566l.178-1.527c.2-.143.386-.307.557-.492l1.684.442a1.875 1.875 0 002.224-1.22l.717-2.373a1.875 1.875 0 00-.994-2.29l-1.533-.64c.01-.247.01-.495 0-.742l1.533-.639a1.875 1.875 0 00.994-2.29l-.717-2.373a1.875 1.875 0 00-2.224-1.22l-1.684.442a5.79 5.79 0 00-.557-.492l-.178-1.527A1.875 1.875 0 0013.422 2.25h-2.344zM12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" /></svg>,
  Pencil: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>,
  VolumeOn: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>,
  VolumeOff: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>,
};

const defaultLevelStats = (): LevelStats => ({ played: 0, won: 0, bestTime: Infinity, totalTime: 0 });
const defaultGameStats = (): GameSpecificStats => ({
    EASY: defaultLevelStats(),
    MEDIUM: defaultLevelStats(),
    HARD: defaultLevelStats()
});

export const GAME_MODES: GameMode[] = ['SUDOKU', 'KAKURO', 'NONOGRAM', 'SKYSCRAPERS', 'TAKUZU', 'AKARI', 'FUTOSHIKI', 'TENTS', 'SHIKAKU', 'BRIDGES', 'HITORI', 'NURIKABE'];

const createInitialStats = (): UserStats => {
    const gameStats: any = {};
    GAME_MODES.forEach(mode => {
        gameStats[mode] = defaultGameStats();
    });
    return {
        totalWins: 0,
        totalPlayTimeSeconds: 0,
        currentStreak: 0,
        lastPlayedDate: '',
        hintsUsedTotal: 0,
        consecutiveHardWins: 0,
        currentWinStreak: 0,
        gamesPlayedToday: [],
        lastPlayedTimeOfDay: 0,
        dailyChallengeHistory: [], 
        gameStats,
        unlockedAchievements: []
    };
};

export const INITIAL_STATS = createInitialStats();

const getSafeLevelStats = (s: UserStats, m: string, d: string): LevelStats => {
    // @ts-ignore
    if (s.gameStats && s.gameStats[m] && s.gameStats[m][d]) return s.gameStats[m][d];
    return defaultLevelStats();
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'GEN_FIRST', title: 'First Steps', description: 'Win your first game in any mode.', icon: 'STAR', target: 1, check: (s) => s.totalWins },
  { id: 'GEN_EASY_10', title: 'Warming Up', description: 'Complete 10 games on Easy difficulty.', icon: 'MEDAL', target: 10, check: (s) => GAME_MODES.reduce((acc, m) => acc + getSafeLevelStats(s, m, 'EASY').won, 0) },
  { id: 'GEN_MED_5', title: 'Getting Good', description: 'Complete 5 games on Medium difficulty.', icon: 'MEDAL', target: 5, check: (s) => GAME_MODES.reduce((acc, m) => acc + getSafeLevelStats(s, m, 'MEDIUM').won, 0) },
  { id: 'GEN_HARD_1', title: 'Big Brain', description: 'Win your first game on Hard difficulty.', icon: 'Trophy', target: 1, check: (s) => GAME_MODES.reduce((acc, m) => acc + getSafeLevelStats(s, m, 'HARD').won, 0) },
  { id: 'GEN_TIME_1H', title: 'Time Killer', description: 'Play for a total of 1 hour.', icon: 'CLOCK', target: 3600, check: (s) => s.totalPlayTimeSeconds },
  { id: 'GEN_STREAK_3', title: 'Logic Fan', description: 'Play for 3 consecutive days.', icon: 'FIRE', target: 3, check: (s) => s.currentStreak },
  { id: 'GEN_STREAK_7', title: 'Dedicated', description: 'Play for 7 consecutive days.', icon: 'FIRE', target: 7, check: (s) => s.currentStreak },
  { id: 'GEN_SPEED_30', title: 'Speedster', description: 'Win any game (except 4x4) in under 30 seconds.', icon: 'FLASH', target: 1, check: (s, m, t, h, d) => (t !== undefined && t < 30 && m !== 'SKYSCRAPERS' && m !== 'FUTOSHIKI') ? 1 : 0 },
  { id: 'GEN_FLAWLESS', title: 'Perfectionist', description: 'Win a Medium or Hard game without using hints.', icon: 'EYE', target: 1, check: (s, m, t, h, d) => (h === 0 && (d === 'MEDIUM' || d === 'HARD')) ? 1 : 0 },
  { id: 'GEN_EXPLORER', title: 'Explorer', description: 'Unlock (win at least once) all 12 game modes.', icon: 'BRAIN', target: 12, check: (s) => Object.keys(s.gameStats).filter(m => (s.gameStats[m].EASY.won + s.gameStats[m].MEDIUM.won + s.gameStats[m].HARD.won) > 0).length }, 
  ...GAME_MODES.map(mode => [
      { id: `${mode.substring(0,3)}_1`, title: `${mode} Novice`, description: `Win 5 games of ${mode}.`, icon: mode, target: 5, check: (s: UserStats) => (getSafeLevelStats(s, mode, 'EASY').won + getSafeLevelStats(s, mode, 'MEDIUM').won + getSafeLevelStats(s, mode, 'HARD').won) },
      { id: `${mode.substring(0,3)}_2`, title: `${mode} Expert`, description: `Win 20 games of ${mode}.`, icon: mode, target: 20, check: (s) => (getSafeLevelStats(s, mode, 'EASY').won + getSafeLevelStats(s, mode, 'MEDIUM').won + getSafeLevelStats(s, mode, 'HARD').won) },
      { id: `${mode.substring(0,3)}_3`, title: `${mode} Master`, description: `Win 50 games of ${mode}.`, icon: mode, target: 50, check: (s: UserStats) => (getSafeLevelStats(s, mode, 'EASY').won + getSafeLevelStats(s, mode, 'MEDIUM').won + getSafeLevelStats(s, mode, 'HARD').won) },
  ]).flat(),
  { id: 'SPC_NIGHT', title: 'Night Owl', description: 'Win a game between 12 AM and 3 AM.', icon: 'MOON', target: 1, check: (s) => (s.lastPlayedTimeOfDay !== undefined && s.lastPlayedTimeOfDay >= 0 && s.lastPlayedTimeOfDay <= 3) ? 1 : 0 },
  { id: 'SPC_HARD_STREAK', title: 'Genius', description: 'Win 5 Hard games in a row.', icon: 'Trophy', target: 5, check: (s) => s.consecutiveHardWins },
  { id: 'SPC_HINT', title: 'Clueless', description: 'Use hints more than 50 times.', icon: 'Lightbulb', target: 50, check: (s) => s.hintsUsedTotal },
  { id: 'SPC_ALL_DAY', title: 'Polymath', description: 'Win at least one game in all 12 modes in a single day.', icon: 'BRAIN', target: 12, check: (s) => s.gamesPlayedToday.length },
  { id: 'SPC_SPEED_HARD', title: 'Light Speed', description: 'Win a Hard game in under 3 minutes.', icon: 'FLASH', target: 1, check: (s, m, t, h, d) => (d === 'HARD' && t !== undefined && t < 180) ? 1 : 0 },
  { id: 'SPC_1000', title: 'Legend', description: 'Complete 1000 total wins.', icon: 'Trophy', target: 1000, check: (s) => s.totalWins },
  { id: 'SPC_STREAK_10', title: 'Unstoppable', description: 'Win 10 games in a row (Streak).', icon: 'FIRE', target: 10, check: (s) => s.currentWinStreak },
  { id: 'DAILY_STREAK_7', title: 'Daily Grinder', description: 'Complete 7 daily challenges in a row.', icon: 'Calendar', target: 7, 
    check: (s) => {
        let streak = 0;
        let maxStreak = 0;
        const sorted = [...s.dailyChallengeHistory].sort();
        for(let i=0; i<sorted.length; i++) {
            if(i===0) streak=1;
            else {
                const prev = new Date(sorted[i-1]);
                const curr = new Date(sorted[i]);
                const diffTime = Math.abs(curr.getTime() - prev.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                if(diffDays === 1) streak++;
                else if (diffDays > 1) streak = 1;
            }
            if(streak > maxStreak) maxStreak = streak;
        }
        return maxStreak;
    } 
  },
  { id: 'DAILY_MONTH', title: 'Perfect Month', description: 'Complete all daily challenges in a calendar month.', icon: 'Calendar', target: 28, 
    check: (s) => {
        const buckets: Record<string, number> = {};
        s.dailyChallengeHistory.forEach(d => {
            const k = d.substring(0,7);
            buckets[k] = (buckets[k] || 0) + 1;
        });
        return Math.max(0, ...Object.values(buckets));
    }
  },
  { id: 'DAILY_COLLECTOR', title: 'Collector', description: 'Collect 30 daily badges.', icon: 'Badge', target: 30, check: (s) => s.dailyChallengeHistory.length },
];

export const GAME_RULES: Record<string, string> = {
    SUDOKU: "Goal: Fill the 9x9 grid so that every row, column, and 3x3 box contains all digits from 1 to 9.\n\nHow to Play:\n• Look for rows or boxes that are almost full.\n• Each number can only appear once in its row, column, and small box.\n\nPro Tip: If a number is already in a row, you can't put it anywhere else in that same line.",
    KAKURO: "Goal: Fill empty squares with numbers 1–9 so they add up to the clues provided.\n\nHow to Play:\n• The number in the triangle is the \"target sum\" for the line of empty cells next to it.\n• You cannot use the same number twice within a single sum.\n\nPro Tip: A sum of \"3\" across two cells must be \"1\" and \"2\".",
    NONOGRAM: "Goal: Color the grid to reveal a hidden pixel-art image.\n\nHow to Play:\n• Numbers tell you how many consecutive colored squares are in that row or column.\n• If you see \"3 1\", there is a block of 3, then at least one empty space, then a single square.\n\nPro Tip: Use \"X\" to mark cells that you are certain must stay empty.",
    SKYSCRAPERS: "Goal: Place buildings of different heights (1 to N) so each appears once per row/column.\n\nHow to Play:\n• Higher buildings block your view of shorter ones behind them.\n• Clues outside the grid show how many buildings you can \"see\" from that side.\n\nPro Tip: A \"1\" clue means the tallest building must be right next to the number.",
    TAKUZU: "Goal: Fill the grid with 0 and 1 following three simple rules.\n\nHow to Play:\n• No more than two of the same number can be side-by-side.\n• Each row and column must have an equal number of 0s and 1s.\n• Every row and every column must be unique.\n\nPro Tip: If you see \"0 0\", the next cell must be \"1\".",
    AKARI: "Goal: Place light bulbs to illuminate every white square.\n\nHow to Play:\n• Bulbs shine horizontally and vertically until they hit a black wall.\n• Bulbs cannot shine on each other (no two bulbs in the same line).\n• Numbers on black walls show exactly how many bulbs touch that wall.\n\nPro Tip: Start with \"4\" walls—they must have bulbs on all four sides.",
    FUTOSHIKI: "Goal: Fill the grid with numbers (1 to N) so each appears once per row/column.\n\nHow to Play:\n• Respect the \"<\" (less than) and \">\" (greater than) symbols between cells.\n• If you see \"A < B\", then the number in A must be smaller than B.\n\nPro Tip: Use the symbols to \"chain\" possibilities (e.g., 1 < 2 < 3).",
    TENTS: "Goal: Place one tent for every tree in the forest.\n\nHow to Play:\n• Every tree must have exactly one tent horizontally or vertically next to it.\n• Tents never touch each other, not even diagonally.\n• Ranged numbers show how many tents are in that specific row or column.\n\nPro Tip: If a row says \"0\", mark every cell in that row as grass (X).",
    SHIKAKU: "Goal: Divide the whole grid into rectangles and squares.\n\nHow to Play:\n• Each rectangle must contain exactly one number.\n• That number equals the number of cells inside that rectangle.\n\nPro Tip: A \"2\" can only be a 1x2 or 2x1 shape.",
    BRIDGES: "Goal: Connect all islands with bridges so they all form one single group.\n\nHow to Play:\n• The number on the island tells you how many bridges connect to it.\n• You can use single or double bridges, but they can't cross each other.\n\nPro Tip: An island with \"1\" in a corner only has two possible directions; check them first.",
    HITORI: "Goal: Shade out duplicate numbers so no number repeats in any row or column.\n\nHow to Play:\n• Shaded (black) cells cannot touch each other horizontally or vertically.\n• All remaining white cells must be connected in one continuous piece.\n\nPro Tip: If you shade a cell, all cells around it must stay white.",
    NURIKABE: "Goal: Separate numbers (islands) with a continuous body of water (sea).\n\nHow to Play:\n• Each number is an island; its value is the number of white cells it contains.\n• All sea (blue) cells must connect together.\n• Water cannot form a 2x2 square block.\n\nPro Tip: Since islands cannot touch, always put water between two numbers."
};

const createGrid = (rows: number, cols: number, def: any = {}): UnifiedGrid => 
  Array.from({ length: rows }, (_, r) => 
    Array.from({ length: cols }, (_, c) => ({ r, c, value: 0, state: 'EMPTY', type: 'NORMAL', notes: [], isLit: false, ...def }))
  );

const generateLatinSquare = (n: number) => {
    const res = Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>(r+c)%n + 1));
    for(let i=0; i<n; i++) {
        const r1=Math.floor(Math.random()*n), r2=Math.floor(Math.random()*n);
        [res[r1], res[r2]] = [res[r2], res[r1]];
    }
    for(let i=0; i<n; i++) {
        const c1=Math.floor(Math.random()*n), c2=Math.floor(Math.random()*n);
        for(let r=0; r<n; r++) {
            [res[r][c1], res[r][c2]] = [res[r][c2], res[r][c1]];
        }
    }
    return res;
};

const hasAdjacent = (grid: any[][], r: number, c: number, val: any) => {
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    for(const d of dirs) {
        const nr=r+d[0], nc=c+d[1];
        if(nr>=0&&nr<grid.length&&nc>=0&&nc<grid[0].length&&grid[nr][nc]===val) return true;
    }
    return false;
};

const checkHitoriConnectivity = (n: number, isBlack: boolean[][]): boolean => {
    const visited = Array.from({length:n},()=>Array(n).fill(false));
    let startNode = null;
    let whiteCount = 0;
    for(let r=0; r<n; r++) for(let c=0; c<n; c++) {
        if (!isBlack[r][c]) {
            whiteCount++;
            if (!startNode) startNode = {r,c};
        }
    }
    if (whiteCount === 0) return false;
    if (!startNode) return false;
    const q = [startNode];
    visited[startNode.r][startNode.c] = true;
    let counted = 0;
    while(q.length > 0) {
        const curr = q.shift()!;
        counted++;
        const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        for(const d of dirs) {
            const nr=curr.r+d[0], nc=curr.c+d[1];
            if(nr>=0 && nr<n && nc>=0 && nc<n && !isBlack[nr][nc] && !visited[nr][nc]) {
                visited[nr][nc] = true;
                q.push({r:nr, c:nc});
            }
        }
    }
    return counted === whiteCount;
};

const generateTents = (diff: Difficulty) => {
    let n = 5; 
    let targetTents = 5;
    if (diff === 'MEDIUM') { n = 8; targetTents = 12; } else if (diff === 'HARD') { n = 10; targetTents = 20; }
    const totalRows = n + 1; const totalCols = n + 1;
    let bestBoard = Array.from({length: n}, () => Array(n).fill(0));
    let success = false;
    const ortho = [[0,1], [0,-1], [1,0], [-1,0]];

    for (let attempt = 0; attempt < 100; attempt++) {
        let board = Array.from({length: n}, () => Array(n).fill(0));
        let placedCount = 0;
        const positions = [];
        for(let r=0; r<n; r++) for(let c=0; c<n; c++) positions.push({r,c});
        positions.sort(() => Math.random() - 0.5);
        for (const {r, c} of positions) {
            if (board[r][c] !== 0) continue; 
            if (placedCount >= targetTents) break;
            
            // 1. Check Tent Proximity (No touching other tents, even diagonally)
            let conflict = false;
            for (let i = r - 1; i <= r + 1; i++) {
                for (let j = c - 1; j <= c + 1; j++) {
                    if (i >= 0 && i < n && j >= 0 && j < n && board[i][j] === 1) {
                        conflict = true; break;
                    }
                }
                if(conflict) break;
            }
            if (conflict) continue;

            // 2. NEW STRICT CHECK: Tent at r,c must not touch any EXISTING Tree (val 2)
            // This prevents "Tent satisfies 2 trees" ambiguity in the generated solution.
            let touchesOldTree = false;
            for (const [dr, dc] of ortho) {
                const tr = r + dr, tc = c + dc;
                if (tr >= 0 && tr < n && tc >= 0 && tc < n && board[tr][tc] === 2) {
                    touchesOldTree = true; break;
                }
            }
            if (touchesOldTree) continue;

            const dirs = ortho.sort(() => Math.random() - 0.5);
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && board[nr][nc] === 0) {
                    // 3. NEW STRICT CHECK: New Tree at nr,nc must not touch any EXISTING Tent (val 1)
                    // This ensures the new tree is exclusively paired with the new tent in the solution.
                    let treeTouchesOldTent = false;
                    for (const [tr, tc] of ortho) { 
                        const ttr = nr + tr, ttc = nc + tc;
                        if (ttr >= 0 && ttr < n && ttc >= 0 && ttc < n && board[ttr][ttc] === 1) {
                            treeTouchesOldTent = true; break;
                        }
                    }
                    if (treeTouchesOldTent) continue;

                    board[r][c] = 1; // Tent
                    board[nr][nc] = 2; // Tree
                    placedCount++;
                    break;
                }
            }
        }
        if (placedCount >= targetTents * 0.8) { 
             bestBoard = board;
             if (placedCount >= targetTents) { success = true; break; }
        }
    }
    const board = bestBoard;
    const grid = createGrid(totalRows, totalCols);
    const solution = Array.from({length: totalRows}, () => Array(totalCols).fill(0));
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            const gr = r + 1; const gc = c + 1;
            if (board[r][c] === 2) { grid[gr][gc].type = 'TREE'; } else if (board[r][c] === 1) { solution[gr][gc] = 1; }
        }
    }
    for (let i = 0; i < n; i++) {
        let rowCount = 0; for (let j = 0; j < n; j++) if (board[i][j] === 1) rowCount++;
        grid[i+1][0] = { r: i+1, c: 0, value: rowCount, type: 'CLUE', state: 'CLUE' };
        let colCount = 0; for (let j = 0; j < n; j++) if (board[j][i] === 1) colCount++;
        grid[0][i+1] = { r: 0, c: i+1, value: colCount, type: 'CLUE', state: 'CLUE' };
    }
    grid[0][0] = { r: 0, c: 0, value: 0, type: 'CLUE', state: 'CLUE' }; 
    return { grid, solution };
};

const solveSudokuBacktrack = (board: number[][], count: {val: number} = {val: 0}): number => {
  let emptySpot: {r: number, c: number} | null = null;
  for(let r=0; r<9; r++) { for(let c=0; c<9; c++) { if(board[r][c] === 0) { emptySpot = {r,c}; break; } } if(emptySpot) break; }
  if(!emptySpot) return 1;
  const {r, c} = emptySpot;
  let solutions = 0;
  for(let num=1; num<=9; num++) {
      let valid = true;
      for(let i=0; i<9; i++) if(board[r][i] === num || board[i][c] === num) valid = false;
      const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
      for(let i=0; i<3; i++) for(let j=0; j<3; j++) if(board[br+i][bc+j] === num) valid = false;
      if(valid) {
          board[r][c] = num;
          solutions += solveSudokuBacktrack(board, count);
          board[r][c] = 0;
          if (solutions > 1) return 2; 
      }
  }
  return solutions;
};

export const updateAkariLighting = (grid: UnifiedGrid): UnifiedGrid => {
    const n = grid.length;
    for(let r=0; r<n; r++) for(let c=0; c<n; c++) { if(grid[r][c].type !== 'WALL') grid[r][c].isLit = false; }
    for(let r=0; r<n; r++) for(let c=0; c<n; c++) {
        if(grid[r][c].state === 'BULB') {
            grid[r][c].isLit = true;
            const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
            for(const [dr, dc] of dirs) {
                let nr=r+dr, nc=c+dc;
                while(nr>=0 && nr<n && nc>=0 && nc<n && grid[nr][nc].type !== 'WALL') {
                    grid[nr][nc].isLit = true; nr+=dr; nc+=dc;
                }
            }
        }
    }
    return grid;
};

const canPlaceBulb = (grid: UnifiedGrid, r: number, c: number, size: number): boolean => {
    if (grid[r][c].type === 'WALL' || grid[r][c].state === 'BULB') return false;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    for(const [dr, dc] of dirs) {
        let nr=r+dr, nc=c+dc;
        while(nr>=0 && nr<size && nc>=0 && nc<size && grid[nr][nc].type !== 'WALL') {
             if (grid[nr][nc].state === 'BULB') return false;
             nr+=dr; nc+=dc;
        }
    }
    return true;
};

const getNeighbors = (r: number, c: number, size: number) => { const res = []; if (r > 0) res.push({r: r-1, c}); if (r < size-1) res.push({r: r+1, c}); if (c > 0) res.push({r, c: c-1}); if (c < size-1) res.push({r, c: c+1}); return res; };
const wouldForm2x2 = (grid: string[][], r: number, c: number, size: number) => { if (r > 0 && c > 0 && grid[r-1][c-1] === 'WALL' && grid[r-1][c] === 'WALL' && grid[r][c-1] === 'WALL') return true; if (r > 0 && c < size-1 && grid[r-1][c+1] === 'WALL' && grid[r-1][c] === 'WALL' && grid[r][c+1] === 'WALL') return true; if (r < size-1 && c > 0 && grid[r+1][c-1] === 'WALL' && grid[r+1][c] === 'WALL' && grid[r][c-1] === 'WALL') return true; if (r < size-1 && c < size-1 && grid[r+1][c+1] === 'WALL' && grid[r+1][c] === 'WALL' && grid[r][c+1] === 'WALL') return true; return false; };

const generateNurikabeMap = (size: number) => {
    let attempts = 0;
    while (attempts < 100) {
        attempts++;
        const grid = Array.from({length: size}, () => Array(size).fill('DOT'));
        const startR = Math.floor(Math.random() * size); const startC = Math.floor(Math.random() * size);
        grid[startR][startC] = 'WALL';
        let seaCount = 1; const targetSea = Math.floor(size * size * 0.6);
        let candidates = getNeighbors(startR, startC, size).filter(n => grid[n.r][n.c] === 'DOT');
        let stalled = 0;
        while (seaCount < targetSea && candidates.length > 0 && stalled < 50) {
            const idx = Math.floor(Math.random() * candidates.length); const {r, c} = candidates[idx];
            if (wouldForm2x2(grid, r, c, size)) { candidates.splice(idx, 1); stalled++; continue; }
            grid[r][c] = 'WALL'; seaCount++; candidates.splice(idx, 1);
            const newNeighbors = getNeighbors(r, c, size).filter(n => grid[n.r][n.c] === 'DOT');
            for(const n of newNeighbors) { if (!candidates.some(cand => cand.r === n.r && cand.c === n.c)) candidates.push(n); }
            stalled = 0;
        }
        const visited = Array.from({length: size}, () => Array(size).fill(false)); const islands = [];
        for(let r=0; r<size; r++) { for(let c=0; c<size; c++) { if(grid[r][c] === 'DOT' && !visited[r][c]) { const islandCells = []; const q = [{r,c}]; visited[r][c] = true; while(q.length > 0) { const curr = q.shift()!; islandCells.push(curr); const nbs = getNeighbors(curr.r, curr.c, size); for(const n of nbs) { if(grid[n.r][n.c] === 'DOT' && !visited[n.r][n.c]) { visited[n.r][n.c] = true; q.push(n); } } } islands.push(islandCells); } } }
        const minIslands = size === 5 ? 3 : (size === 8 ? 5 : 7); if (islands.length < minIslands) continue; 
        const maxAllowed = size === 5 ? 5 : 8; if (islands.some(isl => isl.length > maxAllowed)) continue; 
        const finalGrid = createGrid(size, size);
        for(const isl of islands) { const seed = isl[Math.floor(Math.random() * isl.length)]; finalGrid[seed.r][seed.c].value = isl.length; finalGrid[seed.r][seed.c].type = 'NUMBER'; }
        return { grid: finalGrid, solution: grid };
    }
    const fSize = size; const fGrid = createGrid(fSize, fSize);
    fGrid[0][0].value = 1; fGrid[0][0].type = 'NUMBER'; fGrid[0][2].value = 1; fGrid[0][2].type = 'NUMBER'; fGrid[2][0].value = 1; fGrid[2][0].type = 'NUMBER';
    const fSol = Array.from({length: fSize}, () => Array(fSize).fill('WALL')); fSol[0][0] = 'DOT'; fSol[0][2] = 'DOT'; fSol[2][0] = 'DOT';
    return { grid: fGrid, solution: fSol };
};

const generateBridges = (diff: Difficulty) => {
    const size = diff === 'EASY' ? 7 : (diff === 'MEDIUM' ? 9 : 11);
    const islandCount = diff === 'EASY' ? 8 : (diff === 'MEDIUM' ? 12 : 16);
    let attempts = 0;
    while(attempts < 100) {
        attempts++;
        const islands: BridgesIsland[] = [];
        const lines: BridgesLine[] = [];
        const grid = Array.from({length: size}, () => Array(size).fill(0)); // 0: empty, 1: island, 2: h-line, 3: v-line
        // Start
        const startR = Math.floor(Math.random() * (size - 2)) + 1;
        const startC = Math.floor(Math.random() * (size - 2)) + 1;
        islands.push({id: 'i0', r: startR, c: startC, value: 0});
        grid[startR][startC] = 1;

        let stuck = 0;
        while(islands.length < islandCount && stuck < 50) {
            const source = islands[Math.floor(Math.random() * islands.length)];
            const dir = [[0,1], [0,-1], [1,0], [-1,0]][Math.floor(Math.random() * 4)];
            const dist = Math.floor(Math.random() * 3) + 2; 
            const nr = source.r + dir[0] * dist;
            const nc = source.c + dir[1] * dist;

            if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 0) {
                // Check path for crossing
                let clear = true;
                for(let k=1; k<=dist; k++) {
                    const tr = source.r + dir[0] * k;
                    const tc = source.c + dir[1] * k;
                    if (grid[tr][tc] !== 0 && k !== dist) clear = false; // Path blocked
                    if (k===dist && grid[tr][tc] === 1) clear = false; // Landed on island (handled elsewhere, but simple gen here)
                }
                if (clear) {
                    const id = `i${islands.length}`;
                    islands.push({id, r: nr, c: nc, value: 0});
                    grid[nr][nc] = 1;
                    const val = Math.random() > 0.7 ? 2 : 1;
                    lines.push({id: `${source.id}-${id}`, fromId: source.id, toId: id, value: val, isVertical: dir[0] !== 0});
                    // Mark grid
                    for(let k=1; k<dist; k++) grid[source.r + dir[0] * k][source.c + dir[1] * k] = dir[0] !== 0 ? 3 : 2;
                } else stuck++;
            } else stuck++;
        }
        if (islands.length >= islandCount * 0.8) {
            // Calculate values
            islands.forEach(isl => {
                let count = 0;
                lines.forEach(l => { if(l.fromId === isl.id || l.toId === isl.id) count += l.value; });
                isl.value = count;
            });
            // Validate connectivity
            const visited = new Set<string>();
            const q = [islands[0].id]; visited.add(islands[0].id);
            let seen = 0;
            while(q.length > 0) {
                const curr = q.pop()!; seen++;
                const connected = lines.filter(l => l.fromId === curr || l.toId === curr);
                for(const l of connected) {
                    const next = l.fromId === curr ? l.toId : l.fromId;
                    if(!visited.has(next)) { visited.add(next); q.push(next); }
                }
            }
            if (seen === islands.length) return { islands, size, solution: lines };
        }
    }
    return { islands: [{id:'1', r:2, c:2, value:1}, {id:'2', r:2, c:4, value:1}], size, solution: [] };
};

const generateShikaku = (diff: Difficulty) => {
    let size = 5; let minArea = 2; let maxArea = 4;
    if (diff === 'MEDIUM') { size = 8; minArea = 4; maxArea = 12; } else if (diff === 'HARD') { size = 10; minArea = 5; maxArea = 20; }
    const rects: {r:number, c:number, w:number, h:number}[] = [{r:0, c:0, w:size, h:size}];
    let finished = false; let attempts = 0;
    while (!finished && attempts < 1000) {
        attempts++; finished = true;
        rects.sort((a,b) => (b.w*b.h) - (a.w*a.h));
        const candidateIndex = rects.findIndex(r => r.w * r.h > maxArea || (Math.random() > 0.4 && r.w * r.h > minArea));
        if (candidateIndex !== -1) {
            finished = false;
            const curr = rects[candidateIndex];
            rects.splice(candidateIndex, 1);
            const isVert = curr.w > curr.h ? true : (curr.h > curr.w ? false : Math.random() > 0.5);
            if (isVert && curr.w >= 2) {
                const split = Math.floor(Math.random() * (curr.w - 1)) + 1;
                rects.push({r: curr.r, c: curr.c, w: split, h: curr.h});
                rects.push({r: curr.r, c: curr.c + split, w: curr.w - split, h: curr.h});
            } else if (!isVert && curr.h >= 2) {
                const split = Math.floor(Math.random() * (curr.h - 1)) + 1;
                rects.push({r: curr.r, c: curr.c, w: curr.w, h: split});
                rects.push({r: curr.r + split, c: curr.c, w: curr.w, h: curr.h - split});
            } else { rects.push(curr); }
        }
    }
    const clues = rects.map(r => {
        const cr = r.r + Math.floor(Math.random() * r.h);
        const cc = r.c + Math.floor(Math.random() * r.w);
        return { r: cr, c: cc, value: r.w * r.h };
    });
    return { grid: [], shikakuClues: clues, shikakuSize: size, solution: rects };
};

const KAKURO_TEMPLATES = {
    EASY: { size: 6, vals: [[-1,-1,-1,-1,-1,-1],[-1, 3, 4, -1, 1, 2],[-1, 1, 2, 5, 3, -1],[-1, -1, 5, 4, 2, 1],[-1, 2, 3, 1, -1, -1],[-1,-1,-1,-1,-1,-1]] },
    MEDIUM: { size: 8, vals: [[-1,-1,-1,-1,-1,-1,-1,-1],[-1, 1, 2, -1, 3, 4, 1, -1],[-1, 3, 4, 1, 2, -1, 5, 2],[-1, -1, 5, 3, 1, 2, -1, 4],[-1, 4, -1, 2, 5, 1, 3, -1],[-1, 1, 3, 4, -1, 2, 4, 5],[-1, 2, 1, -1, 4, 3, -1, 1],[-1,-1,-1,-1,-1,-1,-1,-1]] }
};

const KakuroGen = {
    generateStable: (diff: Difficulty) => {
        const size = diff === 'EASY' ? 6 : (diff === 'MEDIUM' ? 8 : 10);
        const wallDensity = diff === 'EASY' ? 0.35 : 0.25;
        let attempts = 0; const maxAttempts = 50;
        while (attempts < maxAttempts) {
            attempts++;
            const grid = Array.from({length: size}, () => Array(size).fill(0));
            const base = generateLatinSquare(size);
            for(let r=0; r<size; r++) for(let c=0; c<size; c++) grid[r][c] = base[r][c];
            for(let i=0; i<size; i++) { grid[0][i] = -1; grid[i][0] = -1; }
            for(let r=1; r<size; r++) { for(let c=1; c<size; c++) { if (Math.random() < wallDensity) grid[r][c] = -1; } }
            let valid = true;
            for(let r=1; r<size; r++) { for(let c=1; c<size; c++) { if (grid[r][c] !== -1) { const hasH = (c>0 && grid[r][c-1]!==-1) || (c<size-1 && grid[r][c+1]!==-1); const hasV = (r>0 && grid[r-1][c]!==-1) || (r<size-1 && grid[r+1][c]!==-1); if (!hasH && !hasV) { valid = false; break; } } } if (!valid) break; }
            if (valid) return { gridVals: grid, size };
        }
        const template = diff === 'HARD' ? KAKURO_TEMPLATES.MEDIUM : (KAKURO_TEMPLATES[diff as keyof typeof KAKURO_TEMPLATES] || KAKURO_TEMPLATES.EASY);
        return { gridVals: template.vals, size: template.size };
    }
};

export const GameLogic = {
  SUDOKU: {
    generate: (diff: Difficulty) => {
      const gridData = createGrid(9, 9);
      const fill = (g: UnifiedGrid, r=0, c=0): boolean => {
        if(r===9) return true;
        const nr=c===8?r+1:r, nc=c===8?0:c+1;
        if(g[r][c].value!==0) return fill(g,nr,nc);
        const nums = [1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-0.5);
        for(const n of nums) {
          let safe = true;
          for(let i=0;i<9;i++) if(g[r][i].value===n || g[i][c].value===n) safe=false;
          const br=Math.floor(r/3)*3, bc=Math.floor(c/3)*3;
          for(let i=0;i<3;i++) for(let j=0;j<3;j++) if(g[br+i][bc+j].value===n) safe=false;
          if(safe) { g[r][c].value=n; if(fill(g,nr,nc)) return true; g[r][c].value=0; }
        }
        return false;
      };
      fill(gridData);
      const fullSolution = gridData.map(row => row.map(c => c.value));
      let minClues = diff === 'EASY' ? 38 : (diff === 'MEDIUM' ? 30 : 24);
      const targetClues = minClues;
      const positions = Array.from({length: 81}, (_, i) => i).sort(() => Math.random() - 0.5);
      const puzzleGrid = fullSolution.map(row => [...row]);
      let currentClues = 81;
      for (const pos of positions) {
          if (currentClues <= targetClues) break;
          const r = Math.floor(pos / 9), c = pos % 9;
          const backup = puzzleGrid[r][c];
          puzzleGrid[r][c] = 0;
          if (solveSudokuBacktrack(puzzleGrid.map(row => [...row])) !== 1) puzzleGrid[r][c] = backup;
          else currentClues--;
      }
      for(let r=0; r<9; r++) for(let c=0; c<9; c++) {
          gridData[r][c].value = puzzleGrid[r][c];
          if (puzzleGrid[r][c] !== 0) { gridData[r][c].fixed = true; gridData[r][c].type = 'FIXED'; }
      }
      return { grid: gridData, solution: fullSolution };
    },
    check: (grid: UnifiedGrid, solution: any) => {
      for(let r=0;r<9;r++) for(let c=0;c<9;c++) if(grid[r][c].value !== solution[r][c]) return false;
      return true;
    }
  },
  
  KAKURO: {
    generate: (diff: Difficulty) => {
      const { gridVals, size } = KakuroGen.generateStable(diff);
      const finalGrid = createGrid(size, size);
      const solution = Array.from({length:size}, () => Array(size).fill(0));
      for(let r=0; r<size; r++) { for(let c=0; c<size; c++) { if (gridVals[r][c] === -1) { let rightSum = 0; if (c + 1 < size && gridVals[r][c+1] !== -1) { for (let k = c + 1; k < size && gridVals[r][k] !== -1; k++) rightSum += gridVals[r][k]; } let downSum = 0; if (r + 1 < size && gridVals[r+1][c] !== -1) { for (let k = r + 1; k < size && gridVals[k][c] !== -1; k++) downSum += gridVals[k][c]; } finalGrid[r][c] = { r, c, value: 0, type: (rightSum > 0 || downSum > 0) ? 'CLUE' : 'WALL', state: (rightSum > 0 || downSum > 0) ? 'CLUE' : 'WALL', rightSum: rightSum || undefined, downSum: downSum || undefined }; } else { finalGrid[r][c] = { r, c, value: 0, type: 'NORMAL', state: 'EMPTY' }; solution[r][c] = gridVals[r][c]; } } }
      return { grid: finalGrid, solution };
    },
    check: (grid: UnifiedGrid, solution: any) => { for(let r=0;r<grid.length;r++) for(let c=0;c<grid[0].length;c++) if(grid[r][c].type==='NORMAL' && grid[r][c].value !== solution[r][c]) return false; return true; }
  },

  HITORI: {
    generate: (diff: Difficulty) => {
      const n = diff === 'EASY' ? 5 : (diff === 'MEDIUM' ? 8 : 10);
      const blackDensity = diff === 'EASY' ? 0.3 : (diff === 'MEDIUM' ? 0.28 : 0.25);
      let attempts = 0; let finalGrid = null; let finalSolutionState = null;
      while (attempts < 20) {
          attempts++;
          const gridVals = generateLatinSquare(n);
          const solutionState = Array.from({length:n},()=>Array(n).fill('NONE'));
          const isBlack = Array.from({length:n},()=>Array(n).fill(false));
          const targetBlack = Math.floor(n * n * blackDensity);
          let blackCount = 0; let safeAttempts = 0;
          while(blackCount < targetBlack && safeAttempts < 500) {
              safeAttempts++; const r = Math.floor(Math.random() * n); const c = Math.floor(Math.random() * n);
              if (!isBlack[r][c]) {
                  const hasAdjBlack = (r>0&&isBlack[r-1][c]) || (r<n-1&&isBlack[r+1][c]) || (c>0&&isBlack[r][c-1]) || (c<n-1&&isBlack[r][c+1]);
                  if (!hasAdjBlack) { isBlack[r][c] = true; if (checkHitoriConnectivity(n, isBlack)) { blackCount++; } else { isBlack[r][c] = false; } }
              }
          }
          const newGridVals = gridVals.map(r => [...r]);
          let validPuzzle = true;
          for(let r=0; r<n; r++) { for(let c=0; c<n; c++) { if (isBlack[r][c]) { solutionState[r][c] = 'SHADED'; const candidates = []; for(let k=0; k<n; k++) if (!isBlack[r][k] && k !== c) candidates.push({r, c:k}); for(let k=0; k<n; k++) if (!isBlack[k][c] && k !== r) candidates.push({r:k, c}); if (candidates.length > 0) { const target = candidates[Math.floor(Math.random() * candidates.length)]; newGridVals[r][c] = newGridVals[target.r][target.c]; } else { validPuzzle = false; } } } }
          if (validPuzzle) { finalGrid = newGridVals; finalSolutionState = solutionState; break; }
      }
      if (!finalGrid) { finalGrid = generateLatinSquare(n); finalSolutionState = Array.from({length:n},()=>Array(n).fill('NONE')); }
      const grid = createGrid(n, n);
      for(let r=0;r<n;r++) for(let c=0;c<n;c++) { grid[r][c].value = finalGrid[r][c]; }
      return { grid, solution: { vals: finalGrid, state: finalSolutionState } };
    },
    check: (grid: UnifiedGrid) => {
       const n = grid.length;
       for(let r=0;r<n;r++) { const rowV = grid[r].filter(c => c.state!=='SHADED').map(c=>c.value); if(new Set(rowV).size !== rowV.length) return false; }
       for(let c=0;c<n;c++) { const colV = grid.map(r=>r[c]).filter(c => c.state!=='SHADED').map(c=>c.value); if(new Set(colV).size !== colV.length) return false; }
       for(let r=0;r<n;r++) for(let c=0;c<n;c++) if(grid[r][c].state==='SHADED' && hasAdjacent(grid.map(x=>x.map(y=>y.state)), r, c, 'SHADED')) return false;
       const isBlack = grid.map(row => row.map(c => c.state === 'SHADED')); if (!checkHitoriConnectivity(n, isBlack)) return false;
       return true;
    }
  },

  NONOGRAM: {
    generate: (diff: Difficulty) => {
        const size = diff === 'EASY' ? 5 : (diff === 'MEDIUM' ? 10 : 15);
        const solution = Array.from({length:size}, ()=>Array.from({length:size}, ()=>Math.random()>0.5?1:0));
        const grid = createGrid(size, size);
        const rows = solution.map(row => { const res = []; let c=0; for(let x of row) { if(x) c++; else if(c) { res.push(c); c=0; } } if(c) res.push(c); return res.length ? res : [0]; });
        const cols = Array.from({length:size}, (_, i) => { const res = []; let c=0; for(let r=0; r<size; r++) { if(solution[r][i]) c++; else if(c) { res.push(c); c=0; } } if(c) res.push(c); return res.length ? res : [0]; });
        return { grid, solution, nonogramClues: { rows, cols } };
    },
    check: (grid: UnifiedGrid, solution: any) => { for(let r=0;r<grid.length;r++) for(let c=0;c<grid[0].length;c++) { const isFilled = grid[r][c].state === 'FILLED'; const shouldFilled = solution[r][c] === 1; if(isFilled !== shouldFilled) return false; } return true; }
  },

  SKYSCRAPERS: {
    generate: (diff: Difficulty) => {
        const n = diff === 'EASY' ? 4 : (diff === 'MEDIUM' ? 5 : 6);
        const solution = generateLatinSquare(n);
        const grid = createGrid(n+2, n+2);
        const countVis = (arr: number[]) => { let m=0, c=0; for(let x of arr){ if(x>m){m=x;c++} } return c; };
        const clueDensity = diff === 'EASY' ? 1.0 : (diff === 'MEDIUM' ? 0.75 : 0.55);
        for(let i=0; i<n; i++) {
            const col = solution.map(r => r[i]); const row = solution[i];
            const clues = [{r: 0, c: i+1, val: countVis(col)}, {r: n+1, c: i+1, val: countVis([...col].reverse())}, {r: i+1, c: 0, val: countVis(row)}, {r: i+1, c: n+1, val: countVis([...row].reverse())}];
            clues.forEach(clue => { if (Math.random() <= clueDensity) { grid[clue.r][clue.c] = { r: clue.r, c: clue.c, value: clue.val, type: 'CLUE', state: 'CLUE' }; } else { grid[clue.r][clue.c] = { r: clue.r, c: clue.c, value: 0, type: 'CLUE', state: 'CLUE' }; } });
        }
        for(let r=1; r<=n; r++) for(let c=1; c<=n; c++) grid[r][c] = { r, c, value: 0, state: 'EMPTY', type: 'NORMAL' };
        return { grid, solution };
    },
    check: (grid: UnifiedGrid, solution: any) => { const n = grid.length - 2; for(let r=1; r<=n; r++) for(let c=1; c<=n; c++) if(grid[r][c].value !== solution[r-1][c-1]) return false; return true; }
  },

  TAKUZU: {
      generate: (diff: Difficulty) => {
          const n = diff === 'EASY' ? 6 : (diff === 'MEDIUM' ? 8 : 10);
          const clueDensity = diff === 'EASY' ? 0.5 : (diff === 'MEDIUM' ? 0.35 : 0.25);
          const solution = generateLatinSquare(n).map(r => r.map(x => x % 2)); 
          const grid = createGrid(n, n, { value: -1 });
          for(let r=0; r<n; r++) { for(let c=0; c<n; c++) { if(Math.random() < clueDensity) { grid[r][c].value = solution[r][c]; grid[r][c].fixed = true; grid[r][c].type = 'FIXED'; } } }
          return { grid, solution };
      },
      check: (grid: UnifiedGrid, solution: any) => { for(let r=0; r<grid.length; r++) { for(let c=0; c<grid[0].length; c++) { if(grid[r][c].value !== solution[r][c]) return false; } } return true; }
  },

  AKARI: {
      generate: (diff: Difficulty) => {
          let size = 6; let wallDensity = 0.20; let numberProbability = 0.8;
          if (diff === 'MEDIUM') { size = 8; wallDensity = 0.22; numberProbability = 0.5; } if (diff === 'HARD') { size = 10; wallDensity = 0.28; numberProbability = 0.2; }
          for(let attempt = 0; attempt < 50; attempt++) {
              const grid = createGrid(size, size);
              const solution = Array.from({length: size}, () => Array(size).fill(0));
              const litMap = Array.from({length: size}, () => Array(size).fill(false));
              const targetWalls = Math.floor(size * size * wallDensity); let wallsPlaced = 0;
              while(wallsPlaced < targetWalls) { const r = Math.floor(Math.random() * size); const c = Math.floor(Math.random() * size); if (grid[r][c].type !== 'WALL') { grid[r][c].type = 'WALL'; wallsPlaced++; const symR = size - 1 - r; const symC = size - 1 - c; if (grid[symR][symC].type !== 'WALL') { grid[symR][symC].type = 'WALL'; wallsPlaced++; } } }
              let possible = true; const whiteCells = []; for(let r=0; r<size; r++) for(let c=0; c<size; c++) if(grid[r][c].type !== 'WALL') whiteCells.push({r,c}); whiteCells.sort(() => Math.random() - 0.5);
              for (const {r, c} of whiteCells) { if (litMap[r][c]) continue; const candidates = []; if (canPlaceBulb(grid, r, c, size)) candidates.push({r,c}); const dirs = [[0,1],[0,-1],[1,0],[-1,0]]; for(const [dr, dc] of dirs) { let nr=r+dr, nc=c+dc; while(nr>=0 && nr<size && nc>=0 && nc<size && grid[nr][nc].type !== 'WALL') { if (canPlaceBulb(grid, nr, nc, size)) candidates.push({r:nr, c:nc}); nr+=dr; nc+=dc; } } if (candidates.length === 0) { possible = false; break; } const pick = candidates[Math.floor(Math.random() * candidates.length)]; grid[pick.r][pick.c].state = 'BULB'; solution[pick.r][pick.c] = 1; litMap[pick.r][pick.c] = true; for(const [dr, dc] of dirs) { let nr=pick.r+dr, nc=pick.c+dc; while(nr>=0 && nr<size && nc>=0 && nc<size && grid[nr][nc].type !== 'WALL') { litMap[nr][nc] = true; nr+=dr; nc+=dc; } } }
              if (possible) { for(let r=0; r<size; r++) { for(let c=0; c<size; c++) { if(grid[r][c].type === 'WALL') { let count = 0; const dirs = [[0,1],[0,-1],[1,0],[-1,0]]; for(const [dr, dc] of dirs) { const nr=r+dr, nc=c+dc; if(nr>=0 && nr<size && nc>=0 && nc<size && solution[nr][nc] === 1) count++; } if(Math.random() < numberProbability) grid[r][c].value = count; else grid[r][c].value = null; } } } const playableGrid = grid.map(row => row.map(cell => ({...cell, state: 'NONE', isLit: false}))); return { grid: playableGrid, solution }; }
          }
          const fallback = createGrid(size, size); return { grid: fallback, solution: {} };
      },
      check: (grid: UnifiedGrid) => { const n = grid.length; for(let r=0; r<n; r++) for(let c=0; c<n; c++) { if(grid[r][c].type !== 'WALL' && !grid[r][c].isLit) return false; } for(let r=0; r<n; r++) for(let c=0; c<n; c++) { if(grid[r][c].state === 'BULB') { const dirs = [[0,1],[0,-1],[1,0],[-1,0]]; for(const [dr, dc] of dirs) { let nr=r+dr, nc=c+dc; while(nr>=0&&nr<n&&nc>=0&&nc<n && grid[nr][nc].type !== 'WALL') { if(grid[nr][nc].state === 'BULB') return false; nr+=dr; nc+=dc; } } } } for(let r=0; r<n; r++) for(let c=0; c<n; c++) { if(grid[r][c].type === 'WALL' && grid[r][c].value !== null) { let count = 0; const dirs = [[0,1],[0,-1],[1,0],[-1,0]]; for(const [dr, dc] of dirs) { const nr=r+dr, nc=c+dc; if(nr>=0 && nr<n && nc>=0 && nc<n && grid[nr][nc].state === 'BULB') count++; } if(count !== grid[r][c].value) return false; } } return true; }
  },

  FUTOSHIKI: {
      generate: (diff: Difficulty) => {
          let n = 4; let fixedCount = 4; let inequalityProb = 0.7;
          if (diff === 'MEDIUM') { n = 5; fixedCount = 2; inequalityProb = 0.5; } else if (diff === 'HARD') { n = Math.random() > 0.5 ? 6 : 7; fixedCount = 0; inequalityProb = 0.35; }
          const solution = generateLatinSquare(n);
          const grid = createGrid(n, n);
          const constraints = [];
          for(let r=0; r<n; r++) { for(let c=0; c<n-1; c++) { if(Math.random() < inequalityProb) { const sign = solution[r][c] < solution[r][c+1] ? '<' : '>'; constraints.push({r, c, type:'row', sign}); } } }
          for(let r=0; r<n-1; r++) { for(let c=0; c<n; c++) { if(Math.random() < inequalityProb) { const sign = solution[r][c] < solution[r+1][c] ? '<' : '>'; constraints.push({r, c, type:'col', sign}); } } }
          let placed = 0; const pos = []; for(let r=0;r<n;r++) for(let c=0;c<n;c++) pos.push({r,c}); pos.sort(()=>Math.random()-0.5);
          for(const p of pos) { if (placed >= fixedCount) break; grid[p.r][p.c].value = solution[p.r][p.c]; grid[p.r][p.c].fixed = true; grid[p.r][p.c].isFixed = true; placed++; }
          return { grid, constraints, solution };
      },
      check: (grid: UnifiedGrid, solution: any) => { for(let r=0;r<grid.length;r++) for(let c=0;c<grid[0].length;c++) if(grid[r][c].value !== solution[r][c]) return false; return true; }
  },

  TENTS: {
      generate: (diff: Difficulty) => {
          return generateTents(diff);
      },
      check: (grid: UnifiedGrid, solution: any) => {
          const rows = grid.length;
          const cols = grid[0].length;
          
          // 1. Check Clues
          for(let r=1; r<rows; r++) {
              let count = 0;
              for(let c=1; c<cols; c++) if(grid[r][c].state === 'TENT') count++;
              if (count !== grid[r][0].value) return false;
          }
          for(let c=1; c<cols; c++) {
              let count = 0;
              for(let r=1; r<rows; r++) if(grid[r][c].state === 'TENT') count++;
              if (count !== grid[0][c].value) return false;
          }

          const tents: {r: number, c: number}[] = [];
          const trees: {r: number, c: number}[] = [];

          for(let r=1; r<rows; r++) {
              for(let c=1; c<cols; c++) {
                  if(grid[r][c].state === 'TENT') {
                      tents.push({r,c});
                      // 2. Proximity Check
                      for(let i=r-1; i<=r+1; i++) for(let j=c-1; j<=c+1; j++) {
                          if(i===r && j===c) continue;
                          if(i>=1 && i<rows && j>=1 && j<cols && grid[i][j].state === 'TENT') return false;
                      }
                  }
                  if(grid[r][c].type === 'TREE') trees.push({r,c});
              }
          }

          // 3. Count Check
          if (tents.length !== trees.length) return false;

          // 4. One-to-One Matching
          const isAdjacent = (t1: {r:number, c:number}, t2: {r:number, c:number}) => {
              return (Math.abs(t1.r - t2.r) + Math.abs(t1.c - t2.c)) === 1;
          };

          const solveMatching = (tentIdx: number, usedTrees: Set<number>): boolean => {
              if (tentIdx === tents.length) return true; 
              const currentTent = tents[tentIdx];
              for(let i=0; i<trees.length; i++) {
                  if (!usedTrees.has(i) && isAdjacent(currentTent, trees[i])) {
                      usedTrees.add(i);
                      if (solveMatching(tentIdx + 1, usedTrees)) return true;
                      usedTrees.delete(i); 
                  }
              }
              return false;
          };

          return solveMatching(0, new Set());
      }
  },
  
  SHIKAKU: {
      generate: (diff: Difficulty) => {
          return generateShikaku(diff);
      },
      check: (grid: any, solution: any, extraData: any = {}) => {
          const { rects, clues, size } = extraData;
          if (!rects || !clues) return false;
          const coverage = Array.from({length: size}, () => Array(size).fill(false));
          let areaSum = 0;
          for(const rect of rects) {
              areaSum += rect.w * rect.h;
              if (rect.r < 0 || rect.c < 0 || rect.r + rect.h > size || rect.c + rect.w > size) return false;
              for(let r=rect.r; r<rect.r+rect.h; r++) { for(let c=rect.c; c<rect.c+rect.w; c++) { if (coverage[r][c]) return false; coverage[r][c] = true; } }
              const containedClues = clues.filter((cl: any) => cl.r >= rect.r && cl.r < rect.r + rect.h && cl.c >= rect.c && cl.c < rect.c + rect.w);
              if (containedClues.length !== 1) { rect.isError = true; return false; }
              if (containedClues[0].value !== rect.w * rect.h) { rect.isError = true; return false; }
              rect.isError = false;
          }
          if (areaSum !== size * size) return false;
          return true;
      }
  },

  BRIDGES: {
      generate: (diff: Difficulty) => {
          const { islands, size, solution } = generateBridges(diff);
          return { bridgesIslands: islands, bridgesSize: size, solution: solution, bridgesLines: [], grid: createGrid(size, size) };
      },
      check: (grid: any, solution: any) => { return true; }
  },
  
  NURIKABE: {
      generate: (diff: Difficulty) => {
          if (diff === 'EASY') return generateNurikabeMap(5);
          if (diff === 'MEDIUM') return generateNurikabeMap(8);
          return generateNurikabeMap(10); 
      },
      check: (grid: UnifiedGrid) => {
          const n = grid.length;
          const visited = Array.from({length: n}, () => Array(n).fill(false));
          const getRegion = (r: number, c: number, type: string) => {
              const region = []; const q = [{r,c}]; visited[r][c] = true; let head = 0;
              while(head < q.length) {
                  const curr = q[head++]; region.push(curr); const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
                  for(const d of dirs) { const nr=curr.r+d[0], nc=curr.c+d[1]; if(nr>=0 && nr<n && nc>=0 && nc<n && !visited[nr][nc]) { if (type === 'ISLAND' && grid[nr][nc].state !== 'WALL') { visited[nr][nc] = true; q.push({r:nr, c:nc}); } else if (type === 'SEA' && grid[nr][nc].state === 'WALL') { visited[nr][nc] = true; q.push({r:nr, c:nc}); } } }
              }
              return region;
          };
          for(let r=0; r<n; r++) { for(let c=0; c<n; c++) { if (grid[r][c].state !== 'WALL' && !visited[r][c]) { const region = getRegion(r, c, 'ISLAND'); const numbers = region.filter(p => grid[p.r][p.c].value > 0); if (numbers.length !== 1) return false; if (region.length !== grid[numbers[0].r][numbers[0].c].value) return false; } } }
          for(let r=0; r<n; r++) visited[r].fill(false);
          let seaRegions = 0;
          for(let r=0; r<n; r++) { for(let c=0; c<n; c++) { if (grid[r][c].state === 'WALL' && !visited[r][c]) { if (seaRegions > 0) return false; getRegion(r, c, 'SEA'); seaRegions++; } if (r<n-1 && c<n-1) { if (grid[r][c].state === 'WALL' && grid[r+1][c].state === 'WALL' && grid[r][c+1].state === 'WALL' && grid[r+1][c+1].state === 'WALL') return false; } } }
          return seaRegions === 1;
      }
  }
};