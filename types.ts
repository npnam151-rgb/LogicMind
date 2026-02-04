
export type GameMode = 'SUDOKU' | 'KAKURO' | 'NONOGRAM' | 'SKYSCRAPERS' | 'TAKUZU' | 'AKARI' | 'FUTOSHIKI' | 'TENTS' | 'SHIKAKU' | 'BRIDGES' | 'HITORI' | 'NURIKABE' | 'HOME';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface UnifiedCell {
  r: number;
  c: number;
  value: any; 
  state?: string; 
  type?: string; 
  isFixed?: boolean;
  fixed?: boolean; 
  isError?: boolean;
  notes?: number[];
  
  // Kakuro
  downSum?: number;
  rightSum?: number;
  clues?: { right?: number; down?: number }; 
  
  // Akari
  isLit?: boolean;
}

export type UnifiedGrid = UnifiedCell[][];

// Specific Grid Types for legacy support
export interface SudokuCell { value: number; isFixed: boolean; notes: number[]; isError?: boolean; }
export type SudokuGrid = SudokuCell[][];
export interface KakuroCell { type: 'EMPTY' | 'WALL' | 'CLUE'; value: number; downSum?: number; rightSum?: number; isError?: boolean; }
export type KakuroGrid = KakuroCell[][];
export type NonogramCellState = 'EMPTY' | 'FILLED' | 'MARKED';
export interface NonogramCell { state: NonogramCellState; isError?: boolean; }
export type NonogramGrid = NonogramCell[][];
export interface SkyscrapersCell { value: number; isFixed: boolean; isError?: boolean; }
export type SkyscrapersGrid = SkyscrapersCell[][];
export interface SkyscrapersClues { top: number[]; bottom: number[]; left: number[]; right: number[]; }
export interface TakuzuCell { value: number; isFixed: boolean; isError?: boolean; }
export type TakuzuGrid = TakuzuCell[][];
export type AkariCellType = 'EMPTY' | 'WALL';
export type AkariCellState = 'NONE' | 'BULB' | 'MARKED';
export interface AkariCell { type: AkariCellType; value: number | null; state: AkariCellState; isLit: boolean; isError: boolean; }
export type AkariGrid = AkariCell[][];
export interface FutoshikiCell { value: number; isFixed: boolean; isError?: boolean; }
export type FutoshikiGrid = FutoshikiCell[][];
export interface FutoshikiConstraint { r: number; c: number; type: 'row' | 'col'; sign: '<' | '>'; }
export type TentsCellType = 'EMPTY' | 'TREE';
export type TentsCellState = 'NONE' | 'TENT' | 'GRASS';
export interface TentsCell { type: TentsCellType; state: TentsCellState; isError: boolean; value?: number; }
export type TentsGrid = TentsCell[][];
export interface TentsClues { rows: number[]; cols: number[]; }
export interface ShikakuClue { r: number; c: number; value: number; }
export interface ShikakuRect { id: string; r: number; c: number; w: number; h: number; colorIndex: number; isError?: boolean; }
export interface BridgesIsland { id: string; r: number; c: number; value: number; currentCount?: number; isError?: boolean; }
export interface BridgesLine { id: string; fromId: string; toId: string; value: 1 | 2; isVertical: boolean; }
export type HitoriCellState = 'NONE' | 'SHADED' | 'MARKED';
export interface HitoriCell { value: number; state: HitoriCellState; isError?: boolean; }
export type HitoriGrid = HitoriCell[][];
export type NurikabeCellState = 'EMPTY' | 'WALL' | 'DOT'; // WALL = Sea, DOT = Island part
export interface NurikabeCell { value: number; state: NurikabeCellState; isError?: boolean; }
export type NurikabeGrid = NurikabeCell[][];

export interface NonogramClues { rows: number[][]; cols: number[][]; title?: string; }

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  isActive: boolean;
  timer: number;
  hintsUsed: number;
  isDailyChallenge?: boolean; 
  isNoteMode?: boolean; // New flag for pencil marks
  
  grid: UnifiedGrid;
  solution?: any;

  nonogramClues?: NonogramClues;
  bridgesIslands?: BridgesIsland[];
  bridgesLines?: BridgesLine[];
  bridgesSize?: number;
  shikakuClues?: ShikakuClue[];
  shikakuRects?: ShikakuRect[];
  shikakuSize?: number;
  futoshikiConstraints?: FutoshikiConstraint[];
  tentsClues?: TentsClues;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number; 
  check: (stats: UserStats, currentGameMode?: GameMode, timer?: number, hints?: number, difficulty?: Difficulty) => number;
}

export interface LevelStats {
    played: number;
    won: number;
    bestTime: number; // In seconds, Infinity if not set
    totalTime: number; // In seconds, for average calculation
}

export interface GameSpecificStats {
    EASY: LevelStats;
    MEDIUM: LevelStats;
    HARD: LevelStats;
}

export interface UserStats {
  // General Stats
  totalWins: number;
  totalPlayTimeSeconds: number;
  currentStreak: number;
  lastPlayedDate: string; // ISO YYYY-MM-DD
  
  // Advanced Tracking
  hintsUsedTotal: number;
  consecutiveHardWins: number;
  currentWinStreak: number;
  gamesPlayedToday: string[];
  lastPlayedTimeOfDay?: number;

  // Daily Challenge Tracking
  dailyChallengeHistory: string[]; // List of YYYY-MM-DD strings

  // Detailed Stats Structure
  gameStats: Record<string, GameSpecificStats>; // Key is GameMode
  
  unlockedAchievements: string[]; 
  
  // Legacy fields
  wins?: any;
}
