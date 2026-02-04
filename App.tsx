
import React, { useState, useEffect, useRef } from 'react';
import { GameMode, Difficulty, GameState, UnifiedGrid, UnifiedCell, UserStats, Achievement, BridgesLine, ShikakuRect } from './types';
import { Icons, GameLogic, GAME_RULES, ACHIEVEMENTS, INITIAL_STATS, updateAkariLighting, SOUND_MAP } from './constants';
import { soundManager } from './SoundManager';
import Controls from './components/Controls';
import UnifiedGridBoard from './components/UnifiedGridBoard';
import BridgesBoard from './components/BridgesBoard';
import ShikakuBoard from './components/ShikakuBoard';

// Toast Component
const ToastNotification: React.FC<{ 
    show: boolean; 
    title: string; 
    description: string; 
    onClose: () => void 
}> = ({ show, title, description, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-bounce-soft w-[90%] max-w-sm pointer-events-none">
            <div className="glass-panel p-4 rounded-2xl border border-yellow-500/50 flex items-center gap-4 shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-slate-900/90 backdrop-blur-xl">
                <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-400">
                    <Icons.Trophy />
                </div>
                <div>
                    <h4 className="font-bold text-yellow-100 text-sm uppercase tracking-wide">Achievement Unlocked!</h4>
                    <p className="font-bold text-white text-base">{title}</p>
                    <p className="text-xs text-slate-300">{description}</p>
                </div>
            </div>
        </div>
    );
};

// Reset Data Modal
const ResetDataModal: React.FC<{
    onConfirm: () => void;
    onClose: () => void;
}> = ({ onConfirm, onClose }) => {
    return (
        <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in px-4" onClick={onClose}>
            <div className="glass-panel p-6 rounded-3xl max-w-sm w-full relative border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner border border-red-500/10 animate-pulse-soft">
                        <Icons.Eraser />
                    </div>
                    <h2 className="text-xl font-bold font-poppins text-white mb-2">Reset All Data?</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        This will permanently delete all your progress, statistics, and unlocked achievements. <br/><br/>
                        <span className="text-red-400 font-bold">This action cannot be undone.</span>
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onClose}
                        className="py-3 rounded-xl font-bold text-sm bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-900/20 transition-all active:scale-95"
                    >
                        Yes, Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

// Resume Game Modal
const ResumeGameModal: React.FC<{
    gameMode: GameMode;
    savedInfo: { difficulty: Difficulty; timer: number; timestamp: number };
    onResume: () => void;
    onNewGame: () => void;
    onClose: () => void;
}> = ({ gameMode, savedInfo, onResume, onNewGame, onClose }) => {
    return (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in px-4" onClick={onClose}>
            <div className="glass-panel p-6 rounded-3xl max-w-sm w-full relative border border-white/10 shadow-2xl transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white"><Icons.Close/></button>
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner border border-white/5">
                        {Icons[gameMode] ? Icons[gameMode]() : <Icons.BRAIN/>}
                    </div>
                    <h2 className="text-xl font-bold font-poppins text-white mb-1">Game in Progress</h2>
                    <p className="text-xs text-slate-400">You have an unfinished {gameMode} game.</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-white/5 flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-[10px] uppercase tracking-wider">Difficulty</span>
                        <span className="text-indigo-300 font-bold">{savedInfo.difficulty}</span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/10"></div>
                    <div className="flex flex-col text-right">
                        <span className="text-slate-500 text-[10px] uppercase tracking-wider">Time</span>
                        <span className="text-indigo-300 font-bold font-mono">
                            {Math.floor(savedInfo.timer / 60)}:{(savedInfo.timer % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={onNewGame}
                        className="py-3 rounded-xl font-bold text-sm bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5 transition-all"
                    >
                        New Game
                    </button>
                    <button 
                        onClick={onResume}
                        className="py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                    >
                        Resume
                    </button>
                </div>
            </div>
        </div>
    );
};


// Statistics Modal Component
const StatisticsModal: React.FC<{ stats: UserStats, onClose: () => void }> = ({ stats, onClose }) => {
    const [expandedGame, setExpandedGame] = useState<string | null>(null);

    const formatTime = (seconds: number) => {
        if (seconds === Infinity || seconds === 0) return "--:--";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatTimeHours = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex flex-col animate-fade-in">
             <div className="flex justify-between items-center p-4 glass-panel border-b border-white/10 shrink-0">
                 <h2 className="text-2xl font-bold font-poppins text-indigo-300 flex items-center gap-2"><Icons.ChartBar /> Statistics</h2>
                 <button onClick={onClose} className="p-2 text-white/50 hover:text-white"><Icons.Close/></button>
              </div>

             <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
                {/* Global Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center bg-indigo-900/20">
                        <div className="text-indigo-400 mb-2"><Icons.Trophy /></div>
                        <div className="text-3xl font-black text-white">{stats.totalWins}</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400">Wins</div>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center bg-orange-900/20">
                        <div className="text-orange-400 mb-2"><Icons.FIRE /></div>
                        <div className="text-3xl font-black text-white">{stats.currentStreak}</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400">Streak</div>
                    </div>
                    <div className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center bg-emerald-900/20">
                        <div className="text-emerald-400 mb-2"><Icons.CLOCK /></div>
                        <div className="text-lg font-black text-white">{formatTimeHours(stats.totalPlayTimeSeconds)}</div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400">Total Time</div>
                    </div>
                </div>

                {/* Game Specific Stats List */}
                <div className="space-y-3 pb-8">
                    {Object.keys(stats.gameStats).map(mode => {
                        const gameStat = stats.gameStats[mode];
                        const totalPlayed = gameStat.EASY.played + gameStat.MEDIUM.played + gameStat.HARD.played;
                        const totalWon = gameStat.EASY.won + gameStat.MEDIUM.won + gameStat.HARD.won;
                        const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;
                        const isExpanded = expandedGame === mode;

                        return (
                            <div key={mode} className="glass-panel rounded-xl overflow-hidden transition-all duration-300 border border-white/5">
                                <div 
                                    className={`p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 ${isExpanded ? 'bg-white/5 border-b border-white/5' : ''}`}
                                    onClick={() => setExpandedGame(isExpanded ? null : mode)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-slate-400">
                                            {Icons[mode] ? Icons[mode]() : <Icons.BRAIN />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-sm">{mode}</h3>
                                            <p className="text-xs text-slate-400">{totalWon} Won / {totalPlayed} Played</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-xs font-mono text-emerald-400">{winRate}%</div>
                                            <div className="h-1 w-12 bg-slate-700 rounded-full mt-1">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{width: `${winRate}%`}} />
                                            </div>
                                        </div>
                                        <div className={`text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><Icons.ChevronDown /></div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="p-4 bg-black/20 animate-fade-in">
                                        <div className="grid grid-cols-4 gap-2 text-xs font-mono text-slate-400 mb-2 border-b border-white/10 pb-2">
                                            <div className="col-span-1">LEVEL</div>
                                            <div className="text-center">WIN%</div>
                                            <div className="text-right">BEST</div>
                                            <div className="text-right">AVG</div>
                                        </div>
                                        {['EASY', 'MEDIUM', 'HARD'].map(diff => {
                                            const dStat = gameStat[diff as keyof typeof gameStat];
                                            const dRate = dStat.played > 0 ? Math.round((dStat.won / dStat.played) * 100) : 0;
                                            const dAvg = dStat.won > 0 ? dStat.totalTime / dStat.won : 0;
                                            
                                            return (
                                                <div key={diff} className="grid grid-cols-4 gap-2 text-sm py-2 items-center text-slate-300">
                                                    <div className="font-bold text-[10px] tracking-wider text-slate-500">{diff}</div>
                                                    <div className="text-center text-emerald-400/80">{dRate}% <span className="text-[9px] text-slate-600">({dStat.won}/{dStat.played})</span></div>
                                                    <div className="text-right font-mono">{formatTime(dStat.bestTime)}</div>
                                                    <div className="text-right font-mono text-slate-500">{formatTime(dAvg)}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
             </div>
        </div>
    );
};

// Daily Challenge Modal Component
const DailyChallengeModal: React.FC<{ 
    stats: UserStats, 
    onClose: () => void, 
    onPlay: () => void 
}> = ({ stats, onClose, onPlay }) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompleted = stats.dailyChallengeHistory.includes(today);
    const [timeLeft, setTimeLeft] = useState('');
    const [isLowTime, setIsLowTime] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const diff = tomorrow.getTime() - now.getTime();
            
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            
            setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            setIsLowTime(h < 1);
        };
        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, []);

    const getCalendarDays = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        
        // Count completions for current month
        let monthlyCompletions = 0;

        for (let i = 1; i <= daysInMonth; i++) {
            const dayStr = `${year}-${(month+1).toString().padStart(2,'0')}-${i.toString().padStart(2,'0')}`;
            const isCompletedDay = stats.dailyChallengeHistory.includes(dayStr);
            const isToday = dayStr === today;
            const isPast = new Date(dayStr) < new Date(today);
            
            if (isCompletedDay) monthlyCompletions++;

            // Streak Connectivity Logic
            const prevDayStr = `${year}-${(month+1).toString().padStart(2,'0')}-${(i-1).toString().padStart(2,'0')}`;
            const nextDayStr = `${year}-${(month+1).toString().padStart(2,'0')}-${(i+1).toString().padStart(2,'0')}`;
            const connectLeft = isCompletedDay && stats.dailyChallengeHistory.includes(prevDayStr);
            const connectRight = isCompletedDay && stats.dailyChallengeHistory.includes(nextDayStr);

            days.push({
                day: i,
                dateStr: dayStr,
                isCompleted: isCompletedDay,
                isToday,
                isPast,
                connectLeft,
                connectRight
            });
        }
        return { days, monthlyCompletions };
    };

    const { days, monthlyCompletions } = getCalendarDays();

    return (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-4" onClick={onClose}>
           <div className="glass-panel p-6 rounded-3xl max-w-sm w-full relative border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]" onClick={(e) => e.stopPropagation()}>
              <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"><Icons.Close/></button>
              
              {/* Header */}
              <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-full bg-indigo-500/20 text-indigo-300 mb-3 border border-indigo-500/30 shadow-inner">
                      <Icons.STAR />
                  </div>
                  <h2 className="text-2xl font-bold font-poppins text-white flex items-center justify-center gap-2">
                      Daily Challenge <span className="text-yellow-400 text-lg">✦</span>
                  </h2>
                  <div className="mt-2 flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-400">
                      <span>Resets in:</span> 
                      <span className={`font-mono text-sm ${isLowTime ? 'text-orange-400 animate-pulse' : 'text-emerald-400'}`}>
                          {timeLeft}
                      </span>
                  </div>
              </div>

              {/* Quick Stats */}
              <div className="flex justify-between items-center mb-6 px-2">
                  <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Win Streak</span>
                      <div className="flex items-center gap-1 text-orange-400">
                          <Icons.FIRE />
                          <span className="text-xl font-black">{stats.currentStreak}</span>
                      </div>
                  </div>
                  <div className="h-8 w-[1px] bg-white/10"></div>
                  <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Monthly Completion</span>
                      <div className="flex items-center gap-1 text-emerald-400">
                          <Icons.CheckCircle />
                          <span className="text-xl font-black">{monthlyCompletions}/{days.length}</span>
                      </div>
                  </div>
              </div>

              {/* Main Action Area */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6 border border-white/5 text-center relative overflow-hidden">
                  <div className="text-sm text-slate-300 mb-4 relative z-10">Today's Status</div>
                  {isCompleted ? (
                      <div className="flex flex-col items-center gap-2 text-emerald-400 relative z-10">
                          <div className="text-4xl filter drop-shadow-md animate-bounce-soft"><Icons.Badge /></div>
                          <span className="font-bold text-lg">Completed</span>
                      </div>
                  ) : (
                      <button 
                        onClick={onPlay} 
                        className="w-full py-4 relative group overflow-hidden rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform"
                      >
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]"></div>
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity"></div>
                          <span className="relative z-10 flex items-center justify-center gap-2">
                              PLAY NOW <Icons.FLASH />
                          </span>
                      </button>
                  )}
              </div>

              {/* Streak Calendar */}
              <div className="text-left">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Icons.Calendar /> Monthly History
                  </h3>
                  <div className="grid grid-cols-7 gap-y-2 select-none">
                      {days.map((d) => {
                          // Styling Logic
                          let bgClass = 'bg-white/5 text-slate-500 border-transparent'; // Default Future
                          let content = d.day;
                          let glowEffect = '';
                          let borderRadius = 'rounded-lg';

                          if (d.isCompleted) {
                              bgClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                              // Streak Connections
                              if (d.connectLeft && d.connectRight) borderRadius = 'rounded-none';
                              else if (d.connectLeft) borderRadius = 'rounded-r-lg rounded-l-none';
                              else if (d.connectRight) borderRadius = 'rounded-l-lg rounded-r-none';
                          } else if (d.isToday) {
                              bgClass = 'bg-indigo-600 text-white border-indigo-400';
                              glowEffect = 'shadow-[0_0_15px_rgba(99,102,241,0.5)] ring-1 ring-indigo-300 animate-pulse-soft z-10 scale-110';
                          } else if (d.isPast) {
                              bgClass = 'bg-slate-800/50 text-slate-600 border-transparent opacity-60';
                          }

                          return (
                              <div key={d.day} className="flex justify-center relative">
                                  {/* Streak Line Connector Visual (Optional overlay if needed, but handled by border-radius for cleaner look) */}
                                  <div 
                                    className={`
                                        w-8 h-8 flex items-center justify-center text-xs font-bold border transition-all
                                        ${borderRadius} ${bgClass} ${glowEffect}
                                    `}
                                  >
                                      {d.isCompleted ? <div className="scale-75"><Icons.Check /></div> : content}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
           </div>
        </div>
    );
};

const App: React.FC = () => {
  const [splash, setSplash] = useState(true);
  const [toast, setToast] = useState<{show: boolean, title: string, description: string} | null>(null);
  const [resumeData, setResumeData] = useState<{mode: GameMode, data: any} | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    mode: 'HOME',
    difficulty: 'MEDIUM',
    grid: [],
    timer: 0,
    hintsUsed: 0,
    isActive: false,
    bridgesLines: [],
    shikakuRects: [],
    isDailyChallenge: false,
    isNoteMode: false,
  });
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [selection, setSelection] = useState<{r:number, c:number}|null>(null);
  const [modals, setModals] = useState({ 
      victory: false, rules: false, stats: false, difficulty: false, 
      statistics: false, dailyChallenge: false, resetData: false
  });
  const [isMuted, setIsMuted] = useState(soundManager.getMutedState());
  const timerRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Attempt to lock orientation (works mostly on Android/Chrome or Fullscreen PWA)
    if (screen.orientation && 'lock' in screen.orientation) {
        (screen.orientation as any).lock('portrait').catch(() => {});
    }

    const savedStats = localStorage.getItem('logicmind_stats');
    if (savedStats) {
        try { 
            const loaded = JSON.parse(savedStats);
            let mergedStats = { ...INITIAL_STATS, ...loaded };
            if (!mergedStats.gameStats) mergedStats.gameStats = INITIAL_STATS.gameStats;
            if (!mergedStats.dailyChallengeHistory) mergedStats.dailyChallengeHistory = [];
            setStats(mergedStats); 
        } catch(e) {}
    }
    
    try {
        soundManager.loadSounds(SOUND_MAP);
    } catch(e) {
        console.warn("Sound init failed", e);
    }
    
    const splashTimer = setTimeout(() => setSplash(false), 3500);
    return () => clearTimeout(splashTimer);
  }, []);

  // Sync mute state update
  const handleToggleMute = () => {
      const newState = soundManager.toggleMute();
      setIsMuted(newState);
  };
  
  // Handler for dashboard interaction to start BGM
  const handleDashboardInteraction = () => {
      soundManager.startBGM();
  };

  // 1. Auto-Save Logic (Per Game)
  useEffect(() => {
    if (gameState.isActive && gameState.mode !== 'HOME') {
        const saveKey = `logicmind_save_${gameState.mode}`;
        
        // Construct save object with all potential extra props
        const saveData = {
            grid: gameState.grid,
            solution: gameState.solution,
            difficulty: gameState.difficulty,
            timer: gameState.timer,
            hintsUsed: gameState.hintsUsed,
            isDailyChallenge: gameState.isDailyChallenge,
            isNoteMode: gameState.isNoteMode,
            
            // Game Specifics
            bridgesLines: gameState.bridgesLines,
            bridgesIslands: gameState.bridgesIslands,
            bridgesSize: gameState.bridgesSize,
            shikakuRects: gameState.shikakuRects,
            shikakuClues: gameState.shikakuClues,
            shikakuSize: gameState.shikakuSize,
            nonogramClues: gameState.nonogramClues,
            futoshikiConstraints: gameState.futoshikiConstraints,
            tentsClues: gameState.tentsClues,
            
            timestamp: Date.now()
        };
        
        localStorage.setItem(saveKey, JSON.stringify(saveData));
        
        timerRef.current = setInterval(() => setGameState(p => ({...p, timer: p.timer + 1})), 1000);
    } else {
        clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameState.isActive, gameState.mode, gameState.grid, gameState.bridgesLines, gameState.shikakuRects, gameState.timer]);

  useEffect(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [gameState.mode]);

  // 2. Check Saved Game Logic
  const handleGameSelect = (mode: GameMode) => {
      soundManager.play('CLICK');
      const saveKey = `logicmind_save_${mode}`;
      const savedRaw = localStorage.getItem(saveKey);
      
      if (savedRaw) {
          try {
              const data = JSON.parse(savedRaw);
              setResumeData({ mode, data });
          } catch(e) {
              // Corrupt save, start new
              startGame(mode, 'MEDIUM');
          }
      } else {
          // No save, start new
          startGame(mode, 'MEDIUM');
      }
  };

  const confirmResume = () => {
      soundManager.play('CLICK');
      if (!resumeData) return;
      setGameState({
          ...gameState, // Keep current defaults
          ...resumeData.data, // Overwrite with saved
          mode: resumeData.mode,
          isActive: true
      });
      setResumeData(null);
  };

  const startNewGameFromModal = () => {
      soundManager.play('CLICK');
      if (!resumeData) return;
      const { mode } = resumeData;
      // Clear save
      localStorage.removeItem(`logicmind_save_${mode}`);
      // Start new
      startGame(mode, 'MEDIUM'); 
      setResumeData(null);
  };


  const getDailyGameMode = (dateString: string): {mode: GameMode, diff: Difficulty} => {
      const hash = dateString.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const modes: GameMode[] = ['SUDOKU', 'KAKURO', 'NONOGRAM', 'SKYSCRAPERS', 'TAKUZU', 'AKARI', 'FUTOSHIKI', 'TENTS', 'SHIKAKU', 'BRIDGES', 'HITORI', 'NURIKABE'];
      const mode = modes[hash % modes.length];
      const diff = 'MEDIUM';
      return { mode, diff };
  };

  const handleDailyChallengeStart = () => {
      soundManager.play('CLICK');
      const today = new Date().toISOString().split('T')[0];
      const { mode, diff } = getDailyGameMode(today);
      startGame(mode, diff, true);
  };

  const startGame = (mode: GameMode, difficulty: Difficulty, isDaily: boolean = false) => {
    if(mode === 'HOME') return;
    let newGameData: any = {};
    if (GameLogic[mode as keyof typeof GameLogic]) newGameData = GameLogic[mode as keyof typeof GameLogic].generate(difficulty);
    if (newGameData.constraints && !newGameData.futoshikiConstraints) newGameData.futoshikiConstraints = newGameData.constraints;
    setGameState({
      mode, difficulty, grid: newGameData.grid || [], solution: newGameData.solution,
      timer: 0, hintsUsed: 0, isActive: true, isDailyChallenge: isDaily, isNoteMode: false, ...newGameData 
    });
    setModals({ victory: false, rules: false, stats: false, difficulty: false, statistics: false, dailyChallenge: false, resetData: false });
    setSelection(null);
  };

  const handleChangeDifficulty = (diff: Difficulty) => {
      soundManager.play('CLICK');
      if (gameState.difficulty === diff) { setModals({...modals, difficulty: false}); return; }
      startGame(gameState.mode, diff, false); 
  };

  const handleReset = () => {
      soundManager.play('CLICK');
      handleGameEnd(false); 
      startGame(gameState.mode, gameState.difficulty, gameState.isDailyChallenge);
  };

  const handleResetStatsClick = () => {
      soundManager.play('CLICK');
      setModals({...modals, resetData: true});
  };

  const confirmResetData = () => {
      localStorage.removeItem('logicmind_stats');
      setStats(INITIAL_STATS);
      setModals({...modals, resetData: false});
      setToast({ show: true, title: "Reset Complete", description: "All data has been wiped." });
      soundManager.play('SWITCH');
  };

  const handleToggleNoteMode = () => {
      soundManager.play('CLICK');
      setGameState(p => ({...p, isNoteMode: !p.isNoteMode}));
  };

  const handleGameEnd = (isWin: boolean) => {
      const { mode, difficulty, timer, hintsUsed, isDailyChallenge } = gameState;
      if (mode === 'HOME') return;

      // 4. Cleanup Save on Win
      if (isWin) {
          localStorage.removeItem(`logicmind_save_${mode}`);
      }

      const newStats = JSON.parse(JSON.stringify(stats));
      newStats.totalPlayTimeSeconds += timer;
      newStats.hintsUsedTotal += hintsUsed;
      newStats.lastPlayedTimeOfDay = new Date().getHours();
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (newStats.lastPlayedDate !== today) {
         if (newStats.lastPlayedDate === yesterday) newStats.currentStreak += 1;
         else newStats.currentStreak = 1; 
         newStats.gamesPlayedToday = [];
      }
      newStats.lastPlayedDate = today;
      if (!newStats.gamesPlayedToday.includes(mode)) newStats.gamesPlayedToday.push(mode);
      if (!newStats.gameStats[mode]) newStats.gameStats[mode] = INITIAL_STATS.gameStats[mode]; 
      const levelStat = newStats.gameStats[mode][difficulty];
      levelStat.played += 1;
      if (isWin) {
          levelStat.won += 1;
          levelStat.totalTime += timer;
          if (timer < levelStat.bestTime || levelStat.bestTime === null) levelStat.bestTime = timer;
          newStats.totalWins += 1;
          newStats.currentWinStreak += 1;
          if (difficulty === 'HARD') newStats.consecutiveHardWins += 1;
          else newStats.consecutiveHardWins = 0;
          if (isDailyChallenge && !newStats.dailyChallengeHistory.includes(today)) newStats.dailyChallengeHistory.push(today);
          ACHIEVEMENTS.forEach(ach => {
              if (!newStats.unlockedAchievements.includes(ach.id)) {
                  const progress = ach.check(newStats, mode, timer, hintsUsed, difficulty);
                  if (progress >= ach.target) {
                      newStats.unlockedAchievements.push(ach.id);
                      setToast({ show: true, title: ach.title, description: ach.description });
                      soundManager.play('UNLOCK');
                  }
              }
          });
      } else {
          newStats.currentWinStreak = 0;
          newStats.consecutiveHardWins = 0;
      }
      setStats(newStats);
      localStorage.setItem('logicmind_stats', JSON.stringify(newStats));
  };

  const handleCellClick = (r: number, c: number) => {
    if (!gameState.isActive) return;
    if (['SUDOKU', 'KAKURO', 'SKYSCRAPERS', 'FUTOSHIKI'].includes(gameState.mode)) {
        if (gameState.grid[r][c].type !== 'CLUE') setSelection({r, c});
        soundManager.play('CLICK');
        return;
    }
    let newGrid = gameState.grid.map(row => row.map(cell => ({...cell})));
    const cell = newGrid[r][c];
    if (cell.fixed || cell.type === 'CLUE' || cell.isFixed) return;
    if (gameState.mode === 'NURIKABE' && cell.value > 0) return; // Prevent clicking on number clues in Nurikabe

    soundManager.play('SWITCH'); // Sound for toggle games

    if (gameState.mode === 'HITORI') {
        const states = ['NONE', 'SHADED', 'MARKED'];
        // Fix: Treat default 'EMPTY' as 'NONE' so index is 0, next is 1 (SHADED)
        const currentState = (cell.state === 'EMPTY' || !cell.state) ? 'NONE' : cell.state;
        const idx = states.indexOf(currentState);
        cell.state = states[(idx+1)%3];
    } else if (gameState.mode === 'NONOGRAM') {
        cell.state = cell.state === 'FILLED' ? 'MARKED' : (cell.state === 'MARKED' ? 'EMPTY' : 'FILLED');
    } else if (gameState.mode === 'AKARI') {
        if(cell.type!=='WALL') {
            cell.state = cell.state==='BULB'?'MARKED':(cell.state==='MARKED'?'NONE':'BULB');
            newGrid = updateAkariLighting(newGrid);
        }
    } else if (gameState.mode === 'TENTS') {
        if(cell.type!=='TREE') {
            cell.state = cell.state==='TENT'?'GRASS':(cell.state==='GRASS'?'NONE':'TENT');
            
            // Auto-fill Grass (X) logic
            if (cell.state === 'TENT') {
                const n = newGrid.length - 1;
                // Check Row
                const rowTarget = newGrid[r][0].value;
                let rowCount = 0;
                for(let k=1; k<=n; k++) if(newGrid[r][k].state === 'TENT') rowCount++;
                if (rowCount === rowTarget) {
                    for(let k=1; k<=n; k++) if(newGrid[r][k].state === 'NONE' && newGrid[r][k].type !== 'TREE') newGrid[r][k].state = 'GRASS';
                }

                // Check Col
                const colTarget = newGrid[0][c].value;
                let colCount = 0;
                for(let k=1; k<=n; k++) if(newGrid[k][c].state === 'TENT') colCount++;
                if (colCount === colTarget) {
                    for(let k=1; k<=n; k++) if(newGrid[k][c].state === 'NONE' && newGrid[k][c].type !== 'TREE') newGrid[k][c].state = 'GRASS';
                }
            }

            // --- TENTS STRICT VALIDATION START ---
            const rows = newGrid.length;
            const cols = newGrid[0].length;
            
            // 1. Reset Errors
            for(let i=0; i<rows; i++) for(let j=0; j<cols; j++) if(newGrid[i][j]) newGrid[i][j].isError = false;

            // 2. Check Row/Col Counts (Over-population)
            for(let i=1; i<rows; i++) {
                let cnt = 0;
                for(let j=1; j<cols; j++) if(newGrid[i][j].state === 'TENT') cnt++;
                if (cnt > newGrid[i][0].value) {
                    for(let j=1; j<cols; j++) if(newGrid[i][j].state === 'TENT') newGrid[i][j].isError = true;
                }
            }
            for(let j=1; j<cols; j++) {
                let cnt = 0;
                for(let i=1; i<rows; i++) if(newGrid[i][j].state === 'TENT') cnt++;
                if (cnt > newGrid[0][j].value) {
                    for(let i=1; i<rows; i++) if(newGrid[i][j].state === 'TENT') newGrid[i][j].isError = true;
                }
            }

            // 3. Proximity & Matching Setup
            const tents = [];
            const trees = [];
            for(let i=1; i<rows; i++) for(let j=1; j<cols; j++) {
                if(newGrid[i][j].state === 'TENT') tents.push({r:i, c:j, idx: tents.length});
                if(newGrid[i][j].type === 'TREE') trees.push({r:i, c:j, idx: trees.length});
            }

            // Proximity Check (Touch & Orphan)
            for(const t of tents) {
                // Check 8 neighbors for Tents
                for(let x=t.r-1; x<=t.r+1; x++) {
                    for(let y=t.c-1; y<=t.c+1; y++) {
                        if(x===t.r && y===t.c) continue;
                        if(x>=1 && x<rows && y>=1 && y<cols && newGrid[x][y].state === 'TENT') {
                            newGrid[t.r][t.c].isError = true;
                        }
                    }
                }
                // Check Ortho neighbors for Trees (Orphan check)
                let hasTree = false;
                const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
                for(const [dr,dc] of dirs) {
                    const nr=t.r+dr, nc=t.c+dc;
                    if(nr>=1 && nr<rows && nc>=1 && nc<cols && newGrid[nr][nc].type === 'TREE') hasTree = true;
                }
                if(!hasTree) newGrid[t.r][t.c].isError = true;
            }

            // Bipartite Matching (1-1 Constraint)
            // Adj List: tent_idx -> [tree_indices]
            const adj = tents.map(t => {
                const neighbors = [];
                const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
                for(const [dr,dc] of dirs) {
                    const nr=t.r+dr, nc=t.c+dc;
                    const treeIdx = trees.findIndex(tr => tr.r === nr && tr.c === nc);
                    if(treeIdx !== -1) neighbors.push(treeIdx);
                }
                return neighbors;
            });

            const match = new Array(trees.length).fill(-1); // tree_idx -> tent_idx
            
            // Standard DFS for Max Bipartite Matching
            const dfs = (u: number, visited: boolean[]) => {
                for(const v of adj[u]) {
                    if(!visited[v]) {
                        visited[v] = true;
                        if(match[v] < 0 || dfs(match[v], visited)) {
                            match[v] = u;
                            return true;
                        }
                    }
                }
                return false;
            };

            for(let i=0; i<tents.length; i++) {
                dfs(i, new Array(trees.length).fill(false));
            }

            // Check which tents are matched
            const matchedTents = new Set(match.filter(m => m !== -1));
            for(let i=0; i<tents.length; i++) {
                if(!matchedTents.has(i)) {
                    // Tent is extra / unmatchable / sharing implicitly
                    newGrid[tents[i].r][tents[i].c].isError = true;
                }
            }
            // --- TENTS STRICT VALIDATION END ---
        }
    } else if (gameState.mode === 'TAKUZU') {
        cell.value = cell.value === -1 ? 0 : (cell.value === 0 ? 1 : -1);
    } else if (gameState.mode === 'NURIKABE') {
        if (cell.state === 'EMPTY') cell.state = 'WALL';
        else if (cell.state === 'WALL') cell.state = 'DOT';
        else cell.state = 'EMPTY';
    }
    setGameState(prev => ({ ...prev, grid: newGrid }));
    checkVictory(newGrid);
  };

  const checkVictory = (currentGrid: UnifiedGrid, extraData?: any) => {
      if (gameState.mode === 'BRIDGES') {
          // Allow using passed islands/lines or fallback to state
          const lines = extraData?.bridgesLines || gameState.bridgesLines || [];
          const islands = extraData?.bridgesIslands || gameState.bridgesIslands || [];

          if (islands.length === 0) return true; // Should not happen usually

          // Check counts
          for (const isl of islands) if (isl.currentCount !== isl.value) return false;

          // Connectivity Check (BFS)
          const visited = new Set<string>();
          const queue = [islands[0].id];
          visited.add(islands[0].id);
          while(queue.length > 0) {
              const currId = queue.shift()!;
              const connectedLines = lines.filter((l: BridgesLine) => l.fromId === currId || l.toId === currId);
              for(const line of connectedLines) {
                  const neighborId = line.fromId === currId ? line.toId : line.fromId;
                  if (!visited.has(neighborId)) { visited.add(neighborId); queue.push(neighborId); }
              }
          }
          if (visited.size !== islands.length) return false;
          
          triggerVictory();
          return true;
      }
      
      if (gameState.mode === 'SHIKAKU') {
          const rects = extraData?.shikakuRects || gameState.shikakuRects || [];
          const clues = gameState.shikakuClues || [];
          const size = gameState.shikakuSize || 10;
          
          if (GameLogic.SHIKAKU.check(null as any, null, { rects, clues, size })) {
              triggerVictory();
          }
          return;
      }

      const logic = GameLogic[gameState.mode as keyof typeof GameLogic];
      if (logic && logic.check(currentGrid, gameState.solution)) triggerVictory();
  };

  const triggerVictory = () => {
      setGameState(p => ({ ...p, isActive: false }));
      setModals(p => ({ ...p, victory: true }));
      handleGameEnd(true);
      soundManager.play('VICTORY');
  };

  const handleRevealHint = () => {
    if (!gameState.isActive) return;
    const { mode, grid, solution } = gameState;
    soundManager.play('CLICK');

    if (mode === 'NURIKABE' && solution) {
        const needsToBeSea: {r: number, c: number}[] = [];
        const wrongSea: {r: number, c: number}[] = [];

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                if (grid[r][c].value > 0) continue; // Skip number clues

                const currentState = grid[r][c].state || 'EMPTY';
                const correctState = solution[r][c]; // 'DOT' or 'WALL'

                if (correctState === 'WALL') {
                    if (currentState !== 'WALL') {
                        needsToBeSea.push({r, c});
                    }
                } else {
                    // correctState is DOT (Land)
                    if (currentState === 'WALL') {
                        wrongSea.push({r, c});
                    }
                }
            }
        }

        let applied = false;
        let newGrid = grid.map(row => row.map(cell => ({...cell})));
        
        // Priority: 
        // 1. Fill a missing Sea (Help player progress) or fix a Dot that should be Sea
        // 2. Remove a wrong Sea (Turn to Empty, do NOT turn to Dot)
        
        if (needsToBeSea.length > 0) {
            const pick = needsToBeSea[Math.floor(Math.random() * needsToBeSea.length)];
            newGrid[pick.r][pick.c].state = 'WALL';
            newGrid[pick.r][pick.c].isError = false; 
            applied = true;
        } else if (wrongSea.length > 0) {
            const pick = wrongSea[Math.floor(Math.random() * wrongSea.length)];
            newGrid[pick.r][pick.c].state = 'EMPTY'; // Reset to Empty
            newGrid[pick.r][pick.c].isError = false; 
            applied = true;
        }

        if (applied) {
            setGameState(prev => ({...prev, grid: newGrid, hintsUsed: prev.hintsUsed + 1}));
            soundManager.play('SWITCH');
            checkVictory(newGrid);
        }
        return;
    }

    if (mode === 'AKARI' && solution) {
        const mistakes: {r: number, c: number}[] = [];
        const missing: {r: number, c: number}[] = [];

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                if (grid[r][c].type === 'WALL') continue;
                const hasBulb = grid[r][c].state === 'BULB';
                const shouldHaveBulb = solution[r][c] === 1;
                if (hasBulb && !shouldHaveBulb) { mistakes.push({r, c}); } 
                else if (!hasBulb && shouldHaveBulb) { missing.push({r, c}); }
            }
        }
        let newGrid = grid.map(row => row.map(cell => ({...cell})));
        let applied = false;
        if (mistakes.length > 0) {
            const pick = mistakes[Math.floor(Math.random() * mistakes.length)];
            newGrid[pick.r][pick.c].state = 'MARKED'; newGrid[pick.r][pick.c].isError = true; applied = true;
        } else if (missing.length > 0) {
            const pick = missing[Math.floor(Math.random() * missing.length)];
            newGrid[pick.r][pick.c].state = 'BULB'; applied = true;
        }
        if (applied) {
            newGrid = updateAkariLighting(newGrid);
            setGameState(prev => ({...prev, grid: newGrid, hintsUsed: prev.hintsUsed + 1}));
            soundManager.play('SWITCH');
            checkVictory(newGrid);
        }
        return;
    }

    if (mode === 'TENTS' && solution) {
        const mistakes: {r: number, c: number}[] = [];
        const missing: {r: number, c: number}[] = [];
        for (let r = 1; r < grid.length; r++) {
            for (let c = 1; c < grid[0].length; c++) {
                const cell = grid[r][c];
                if (cell.type === 'TREE') continue;
                const isTent = cell.state === 'TENT';
                const shouldBeTent = solution[r][c] === 1;
                if (isTent && !shouldBeTent) { mistakes.push({r, c}); } 
                else if (!isTent && shouldBeTent) { missing.push({r, c}); }
            }
        }
        let newGrid = grid.map(row => row.map(cell => ({...cell})));
        let applied = false;
        if (mistakes.length > 0) {
            const pick = mistakes[Math.floor(Math.random() * mistakes.length)];
            newGrid[pick.r][pick.c].state = 'GRASS'; applied = true;
        } else if (missing.length > 0) {
            const pick = missing[Math.floor(Math.random() * missing.length)];
            newGrid[pick.r][pick.c].state = 'TENT'; applied = true;
        }
        if (applied) {
            setGameState(prev => ({...prev, grid: newGrid, hintsUsed: prev.hintsUsed + 1}));
            soundManager.play('SWITCH');
            checkVictory(newGrid);
        }
        return;
    }

    if (mode === 'BRIDGES') {
        const solutionLines = solution as BridgesLine[];
        const currentLines = gameState.bridgesLines || [];
        let targetLine = null;
        for (const sol of solutionLines) {
            const existing = currentLines.find(l => l.id === sol.id);
            if (!existing || existing.value !== sol.value) { targetLine = sol; break; }
        }
        if (targetLine) {
            let newLines = [...currentLines].filter(l => l.id !== targetLine!.id);
            newLines.push(targetLine);
            const newIslands = (gameState.bridgesIslands || []).map(isl => {
                let count = 0;
                newLines.forEach(l => { if (l.fromId === isl.id || l.toId === isl.id) count += l.value; });
                return { ...isl, currentCount: count };
            });
            setGameState(prev => ({...prev, bridgesLines: newLines, bridgesIslands: newIslands, hintsUsed: prev.hintsUsed + 1}));
            checkVictory([], { bridgesLines: newLines, bridgesIslands: newIslands });
        }
        return;
    }

    if (mode === 'SHIKAKU' && solution) {
        const solutionRects = solution as ShikakuRect[];
        const currentRects = gameState.shikakuRects || [];
        
        // Find a correct rectangle that is missing in user's current progress
        const missing = solutionRects.find(solRect => 
            !currentRects.some(curr => 
                curr.r === solRect.r && curr.c === solRect.c && 
                curr.w === solRect.w && curr.h === solRect.h
            )
        );

        if (missing) {
            // Remove any overlapping user rectangles to place the correct one
            const newRects = currentRects.filter(curr => {
                const overlap = !(curr.r >= missing.r + missing.h || 
                                curr.r + curr.h <= missing.r || 
                                curr.c >= missing.c + missing.w || 
                                curr.c + curr.w <= missing.c);
                return !overlap;
            });

            newRects.push({
                id: 'hint-' + Math.random().toString(36).substr(2, 9),
                r: missing.r,
                c: missing.c,
                w: missing.w,
                h: missing.h,
                colorIndex: Math.floor(Math.random() * 6),
            });

            setGameState(prev => ({...prev, shikakuRects: newRects, hintsUsed: prev.hintsUsed + 1}));
            soundManager.play('SWITCH');
            checkVictory([], { shikakuRects: newRects });
        }
        return;
    }

    const candidates: any[] = [];
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        const cell = grid[r][c];
        if (cell.type === 'CLUE' || cell.fixed || cell.isFixed || cell.type === 'WALL' || cell.type === 'TREE') continue;

        if (mode === 'NONOGRAM' && solution) {
          const shouldBeFilled = solution[r][c] === 1;
          const isFilled = cell.state === 'FILLED';
          if (shouldBeFilled !== isFilled) {
            candidates.push({ r, c, type: 'state', value: shouldBeFilled ? 'FILLED' : 'MARKED' });
          }
        } else if (mode === 'HITORI' && solution?.state) {
           const shouldBeShaded = solution.state[r][c] === 'SHADED';
           const isShaded = cell.state === 'SHADED';
           if (shouldBeShaded !== isShaded) {
             candidates.push({ r, c, type: 'state', value: shouldBeShaded ? 'SHADED' : 'NONE' });
           }
        } else if (mode === 'SKYSCRAPERS' && solution) {
           const solValue = solution[r-1] ? solution[r-1][c-1] : undefined;
           if (solValue !== undefined && cell.value !== solValue) {
             candidates.push({ r, c, type: 'value', value: solValue });
           }
        } else if (mode === 'FUTOSHIKI' && solution) {
           if (cell.value !== 0 && cell.value !== solution[r][c]) {
               candidates.push({ r, c, type: 'value', value: solution[r][c] }); 
           } else if (cell.value === 0) {
               candidates.push({ r, c, type: 'value', value: solution[r][c] }); 
           }
        } else if (solution && solution[r] && solution[r][c] !== undefined) {
           const solValue = solution[r][c];
           if (solValue !== undefined && cell.value !== solValue) {
             candidates.push({ r, c, type: 'value', value: solValue });
           }
        }
      }
    }

    if (candidates.length > 0) {
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const newGrid = grid.map((row, ri) => row.map((cell, ci) => {
        if (ri === pick.r && ci === pick.c) {
          const newCell = { ...cell, isError: false };
          if (pick.type === 'state') newCell.state = pick.value;
          else newCell.value = pick.value;
          return newCell;
        }
        return cell;
      }));
      setGameState(prev => ({ ...prev, grid: newGrid, hintsUsed: prev.hintsUsed + 1 }));
      setSelection({ r: pick.r, c: pick.c });
      checkVictory(newGrid);
    }
  };

  const handleBridgesInteract = (fromId: string, toId: string) => {
      if (!gameState.isActive) return;
      const i1 = gameState.bridgesIslands?.find(i => i.id === fromId);
      const i2 = gameState.bridgesIslands?.find(i => i.id === toId);
      if (!i1 || !i2 || (i1.r !== i2.r && i1.c !== i2.c)) return;
      
      soundManager.play('SWITCH');

      const bId = [fromId, toId].sort().join('-');
      const existing = gameState.bridgesLines?.find(l => l.id === bId);
      let newLines = [...(gameState.bridgesLines || [])];
      if (!existing) newLines.push({ id: bId, fromId: fromId, toId: toId, value: 1, isVertical: i1.c === i2.c });
      else if (existing.value === 1) newLines = newLines.map(l => l.id === bId ? {...l, value: 2} : l);
      else newLines = newLines.filter(l => l.id !== bId);
      const newIslands = (gameState.bridgesIslands || []).map(isl => {
          let count = 0;
          newLines.forEach(l => { if (l.fromId === isl.id || l.toId === isl.id) count += l.value; });
          return { ...isl, currentCount: count };
      });
      setGameState(prev => ({...prev, bridgesLines: newLines, bridgesIslands: newIslands}));
      checkVictory([], { bridgesLines: newLines, bridgesIslands: newIslands });
  };

  const handleShikakuAdd = (rect: ShikakuRect) => {
      const newRects = [...(gameState.shikakuRects || []), rect];
      setGameState(prev => ({...prev, shikakuRects: newRects}));
      
      // Check if valid placement logic for sound
      const clues = gameState.shikakuClues || [];
      const containedClues = clues.filter((cl) => 
          cl.r >= rect.r && cl.r < rect.r + rect.h && cl.c >= rect.c && cl.c < rect.c + rect.w
      );
      if (containedClues.length === 1 && containedClues[0].value === rect.w * rect.h) {
          soundManager.play('SUCCESS'); // This might map to switch or victory in sound map
      } else {
          soundManager.play('SWITCH');
      }

      checkVictory([], { shikakuRects: newRects });
  };
  
  const handleShikakuRemove = (id: string) => {
      soundManager.play('CLICK');
      const newRects = (gameState.shikakuRects || []).filter(r => r.id !== id);
      setGameState(prev => ({...prev, shikakuRects: newRects}));
      checkVictory([], { shikakuRects: newRects });
  };

  const handleNumberInput = (num: number) => {
      if (!gameState.isActive || !selection) return;
      const { r, c } = selection;
      const cell = gameState.grid[r][c];
      
      if (cell.fixed || cell.isFixed || cell.type === 'CLUE' || cell.type === 'WALL' || cell.type === 'TREE') return;

      const newGrid = gameState.grid.map(row => row.map(c => ({...c})));
      const target = newGrid[r][c];

      if (num === -1) {
          target.value = 0;
          target.notes = [];
          target.isError = false;
          soundManager.play('CLICK');
      } else {
          if (gameState.isNoteMode) {
              const notes = target.notes || [];
              if (notes.includes(num)) target.notes = notes.filter(n => n !== num);
              else target.notes = [...notes, num].sort((a,b)=>a-b);
              soundManager.play('CLICK');
          } else {
              target.value = target.value === num ? 0 : num;
              target.notes = [];
              target.isError = false;
              soundManager.play('SWITCH');
          }
      }
      setGameState(prev => ({ ...prev, grid: newGrid }));
      checkVictory(newGrid);
  };

  const handleBackdropClick = (e: React.MouseEvent, modalKey: keyof typeof modals) => { if (e.target === e.currentTarget) setModals({...modals, [modalKey]: false}); };
  const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
  const countEmptyCells = () => {
      if (!gameState.grid) return 0;
      let count = 0;
      gameState.grid.forEach(row => row.forEach(c => { 
        if (gameState.mode === 'TAKUZU' ? c.value === -1 : c.value === 0) count++; 
      }));
      return count;
  };

  if (splash) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a] math-pattern">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-slate-900/90 pointer-events-none" />
            
            {/* Main Glass Card */}
            <div className="relative p-10 md:p-14 rounded-[2.5rem] bg-slate-900/30 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col items-center overflow-hidden animate-fade-in">
                
                {/* Decorative Glow central focus */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px] animate-pulse-soft" />

                {/* Text */}
                <h1 className="relative z-10 text-4xl md:text-5xl font-black font-poppins tracking-[0.2em] text-white text-center mb-2 drop-shadow-lg mt-4">
                    LOGIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">MIND</span>
                </h1>
                
                <p className="relative z-10 text-slate-400 text-xs font-mono tracking-widest uppercase mb-10 opacity-80">
                    Japanese logic puzzles
                </p>

                {/* Loading Bar */}
                <div className="relative z-10 w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 animate-[loadingProgress_3s_ease-in-out] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                </div>
            </div>
        </div>
    );

  const today = new Date().toISOString().split('T')[0];
  const isDailyCompleted = stats.dailyChallengeHistory.includes(today);

  return (
    <div className="h-full w-full max-w-lg mx-auto relative flex flex-col math-pattern shadow-2xl overflow-hidden text-slate-100">
      <ToastNotification show={!!toast && toast.show} title={toast?.title || ''} description={toast?.description || ''} onClose={() => setToast(null)} />
      {resumeData && (
          <ResumeGameModal 
            gameMode={resumeData.mode} 
            savedInfo={{ difficulty: resumeData.data.difficulty, timer: resumeData.data.timer, timestamp: resumeData.data.timestamp }}
            onResume={confirmResume}
            onNewGame={startNewGameFromModal}
            onClose={() => setResumeData(null)}
          />
      )}
      {modals.resetData && (
          <ResetDataModal 
            onConfirm={confirmResetData}
            onClose={() => setModals({...modals, resetData: false})}
          />
      )}
      {modals.victory && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={(e) => handleBackdropClick(e, 'victory')}>
              <div className="glass-panel p-8 rounded-3xl text-center m-6 max-w-sm w-full border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
                  <div className="text-7xl mb-6 neon-text animate-bounce-soft">🏆</div>
                  <h2 className="text-3xl font-bold text-white mb-2 font-poppins">Level Cleared!</h2>
                  <p className="text-indigo-200 mb-8 font-mono text-xl">{Math.floor(gameState.timer/60)}:{(gameState.timer%60).toString().padStart(2,'0')}</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                      <button onClick={()=>{setModals({...modals,victory:false}); setGameState(p=>({...p, mode:'HOME'}))}} 
                        className="py-3 rounded-xl font-bold text-sm bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5 transition-all active:scale-95">
                        Main Menu
                      </button>
                      <button onClick={()=>{
                          soundManager.play('CLICK');
                          startGame(gameState.mode, gameState.difficulty, gameState.isDailyChallenge);
                      }} 
                        className="py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-sm shadow-lg transform transition-transform active:scale-95">
                        Play Again
                      </button>
                  </div>
              </div>
              {Array.from({length: 30}).map((_,i) => (<div key={i} className="confetti" style={{left: `${Math.random()*100}%`, animation: `fall ${2+Math.random()*3}s linear infinite`, backgroundColor: ['#f472b6', '#34d399', '#60a5fa', '#ffb703'][Math.floor(Math.random()*4)]}} />))}
          </div>
      )}
      {modals.statistics && <StatisticsModal stats={stats} onClose={() => setModals({...modals, statistics: false})} />}
      {modals.dailyChallenge && <DailyChallengeModal stats={stats} onClose={() => setModals({...modals, dailyChallenge: false})} onPlay={handleDailyChallengeStart} />}
      {modals.rules && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-4" onClick={(e) => handleBackdropClick(e, 'rules')}>
           <div className="glass-panel p-6 rounded-3xl max-w-sm w-full relative flex flex-col max-h-[80vh]">
              <div className="flex justify-between items-center mb-4 shrink-0"><h2 className="text-2xl font-bold font-poppins text-indigo-300">Rules</h2><button onClick={() => setModals({...modals, rules: false})} className="p-2 text-white/50 hover:text-white"><Icons.Close/></button></div>
              <div className="overflow-y-auto no-scrollbar pr-2"><p className="text-slate-200 leading-relaxed text-sm whitespace-pre-line text-left">{GAME_RULES[gameState.mode] || "No rules available for this game."}</p></div>
           </div>
        </div>
      )}
      {modals.difficulty && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-4" onClick={(e) => handleBackdropClick(e, 'difficulty')}>
           <div className="glass-panel p-6 rounded-3xl max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setModals({...modals, difficulty: false})} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white"><Icons.Close/></button>
              <h2 className="text-2xl font-bold mb-6 font-poppins text-indigo-300 text-center">Select Difficulty</h2>
              <div className="grid grid-cols-1 gap-3">{(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (<button key={d} onClick={() => handleChangeDifficulty(d)} className={`py-4 rounded-xl text-sm font-bold tracking-widest transition-all active:scale-95 ${gameState.difficulty === d ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-300' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>{d}</button>))}</div>
           </div>
        </div>
      )}
      {modals.stats && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in px-4" onClick={(e) => handleBackdropClick(e, 'stats')}>
           <div className="glass-panel p-6 rounded-3xl max-w-sm w-full relative flex flex-col max-h-[85vh] h-full">
              <div className="flex justify-between items-center mb-6 shrink-0"><h2 className="text-2xl font-bold font-poppins text-indigo-300 flex items-center gap-2"><Icons.Trophy /> Achievements</h2><button onClick={() => setModals({...modals, stats: false})} className="p-2 text-white/50 hover:text-white"><Icons.Close/></button></div>
              <div className="overflow-y-auto no-scrollbar space-y-4 flex-1 pr-1">
                 {ACHIEVEMENTS.map(ach => {
                    const progress = ach.check(stats, undefined, undefined, undefined, undefined);
                    const unlocked = stats.unlockedAchievements.includes(ach.id);
                    const percent = Math.min(100, Math.round((progress / ach.target) * 100));
                    return (<div key={ach.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${unlocked ? 'bg-gradient-to-r from-slate-800 to-indigo-900/30 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-slate-800/50 border-white/5 grayscale opacity-70'}`}>
                            <div className={`w-12 h-12 shrink-0 rounded-lg flex items-center justify-center text-2xl ${unlocked ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-500'}`}>{Icons[ach.icon] ? Icons[ach.icon]() : '★'}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start"><h3 className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-slate-400'}`}>{ach.title}</h3>{unlocked && <span className="text-xs text-emerald-400 font-bold">✓</span>}</div>
                                <p className="text-xs text-slate-400 mb-2 leading-relaxed">{ach.description}</p>
                                <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${unlocked ? 'bg-indigo-500 shadow-[0_0_10px_#6366f1]' : 'bg-slate-500'}`} style={{width: `${percent}%`}}/></div>
                                <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono"><span>{Math.min(progress, ach.target)}/{ach.target}</span><span>{percent}%</span></div>
                            </div>
                        </div>);
                 })}
              </div>
           </div>
        </div>
      )}
      
      {/* 
         LAYOUT REFACTOR: 
         Split into two distinct branches for Home and Game to ensure proper scrolling and fixed positioning.
      */}
      {gameState.mode === 'HOME' ? (
        <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
            <div className="p-6 pb-12 min-h-full flex flex-col relative" onClick={handleDashboardInteraction}>
               <header className="mb-6 mt-8 sticky top-0 z-10 py-3 glass-panel rounded-2xl mx-2 shadow-2xl backdrop-blur-xl flex justify-between items-center px-4">
                  <button onClick={(e) => { e.stopPropagation(); handleToggleMute(); }} className="p-2 text-slate-400 hover:text-white transition-colors glass-button rounded-full w-10 h-10 flex items-center justify-center">
                      {isMuted ? <Icons.VolumeOff /> : <Icons.VolumeOn />}
                  </button>
                  <div className="text-center"><h1 className="text-2xl font-black tracking-widest font-poppins text-white neon-text">LOGIC MIND</h1></div>
                  <button onClick={(e) => { e.stopPropagation(); triggerHaptic(); setModals({...modals, statistics: true}); }} className="p-2 text-indigo-400 hover:text-white transition-colors glass-button rounded-full w-10 h-10 flex items-center justify-center"><Icons.ChartBar /></button>
               </header>
               <div onClick={(e) => { e.stopPropagation(); triggerHaptic(); setModals({...modals, dailyChallenge: true}); }} className="mx-2 mb-6 glass-panel p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-all group border border-indigo-500/30 relative overflow-hidden">
                   <div className={`absolute inset-0 opacity-10 ${isDailyCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                   <div className="flex items-center justify-between relative z-10">
                       <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-lg ${isDailyCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}><Icons.Calendar /></div>
                           <div><h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Challenge</h3><div className={`text-sm font-bold ${isDailyCompleted ? 'text-emerald-400' : 'text-white group-hover:text-indigo-200 transition-colors'}`}>{isDailyCompleted ? 'Completed!' : 'Play Today'}</div></div>
                       </div>
                       <div className={`${isDailyCompleted ? 'text-emerald-400' : 'text-indigo-400 group-hover:translate-x-1 transition-transform'} text-xl`}>{isDailyCompleted ? <Icons.CheckCircle /> : '►'}</div>
                   </div>
               </div>
               <div className="grid grid-cols-2 gap-3 px-2 mb-8 animate-fade-in">
                  {['SUDOKU', 'KAKURO', 'NONOGRAM', 'SKYSCRAPERS', 'TAKUZU', 'AKARI', 'FUTOSHIKI', 'TENTS', 'SHIKAKU', 'BRIDGES', 'HITORI', 'NURIKABE'].map(m => (
                      <button key={m} onClick={(e) => { e.stopPropagation(); handleGameSelect(m as GameMode); }} className="glass-button relative w-full h-auto p-3 flex items-center gap-3 rounded-xl overflow-hidden group active:scale-95 transition-all hover:bg-white/10 border border-white/5 justify-start">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /><div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-indigo-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-inner ring-1 ring-white/5">{Icons[m] ? Icons[m]() : <Icons.BRAIN/>}</div><span className="text-xs font-bold tracking-wider uppercase text-slate-300 group-hover:text-white transition-colors truncate">{m}</span>
                      </button>
                  ))}
               </div>
               <div className="px-2 mb-8">
                   <button onClick={(e) => { e.stopPropagation(); triggerHaptic(); setModals({...modals, stats: true}); }} className="w-full py-4 glass-panel rounded-xl flex items-center justify-center gap-3 text-indigo-300 font-bold hover:bg-white/5 active:scale-95 transition-all group"><div className="p-1 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors"><Icons.Trophy /></div><span className="tracking-wide">View All Achievements</span></button>
                   <button onClick={(e) => { e.stopPropagation(); handleResetStatsClick(); }} className="w-full mt-4 flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity group">
                      <span className="text-slate-500 group-hover:text-red-400 transition-colors"><Icons.Eraser /></span>
                      <p className="text-[10px] text-slate-500 font-mono group-hover:text-red-400 transition-colors">Logic Mind v1.0 • Reset Data</p>
                   </button>
               </div>
            </div>
        </div>
      ) : (
        <div className="flex flex-col h-full w-full overflow-hidden">
             {/* FIXED HEADER */}
             <header className="shrink-0 z-20 glass-panel border-b-0 border-b-white/5 px-4 py-4 flex items-center justify-between shadow-lg">
                 <button onClick={()=>setGameState(p=>({...p, mode:'HOME'}))} className="p-2 text-slate-300 hover:text-white glass-button rounded-xl"><Icons.Back/></button>
                 <div className="flex flex-col items-center">
                     <div className="flex items-center gap-2">{gameState.isDailyChallenge && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-bold uppercase tracking-wider">Daily</span>}<span className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">{gameState.mode}</span></div>
                     <div className="flex flex-col items-center"><span className="text-xl font-mono font-bold text-white neon-text">{Math.floor(gameState.timer/60)}:{(gameState.timer%60).toString().padStart(2,'0')}</span>{['SUDOKU', 'KAKURO'].includes(gameState.mode) && (<span className="text-[10px] text-slate-400 font-mono">Remaining: {countEmptyCells()}</span>)}</div>
                 </div>
                 <div className="flex gap-2">
                     {!gameState.isDailyChallenge && <button onClick={() => setModals(p => ({...p, difficulty: true}))} className="p-2 text-indigo-400 glass-button rounded-xl hover:text-white"><Icons.Levels/></button>}
                     <button onClick={() => setModals(p => ({...p, rules: true}))} className="p-2 text-indigo-400 glass-button rounded-xl hover:text-white"><Icons.Help/></button>
                     {!gameState.isDailyChallenge && <button onClick={handleReset} className="p-2 text-slate-300 glass-button rounded-xl hover:bg-red-500/20 hover:text-red-300 active:scale-95 transition-all"><Icons.Reset/></button>}
                     <button onClick={handleRevealHint} className="p-2 glass-button rounded-xl hover:bg-amber-500/20 hover:text-amber-300 text-amber-400"><Icons.Lightbulb/></button>
                 </div>
             </header>

             {/* SCROLLABLE MAIN CONTENT */}
             <main ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar w-full relative flex flex-col items-center justify-start pt-6 px-4 pb-6">
                 <div className="relative">
                     <div className="glass-panel p-1 rounded-2xl shadow-2xl border border-white/5">
                        {gameState.mode === 'BRIDGES' ? <BridgesBoard size={gameState.bridgesSize || 9} islands={gameState.bridgesIslands||[]} lines={gameState.bridgesLines||[]} onInteract={handleBridgesInteract} /> 
                         : gameState.mode === 'SHIKAKU' ? <ShikakuBoard size={gameState.shikakuSize || 10} clues={gameState.shikakuClues||[]} rects={gameState.shikakuRects||[]} onAddRect={handleShikakuAdd} onRemoveRect={handleShikakuRemove} />
                         : <UnifiedGridBoard mode={gameState.mode} grid={gameState.grid} selectedCell={selection} onCellClick={handleCellClick} nonogramClues={gameState.nonogramClues} futoshikiConstraints={gameState.futoshikiConstraints} />}
                     </div>
                     {gameState.mode === 'SUDOKU' && (
                         <button onClick={handleToggleNoteMode} className={`absolute -right-12 top-0 w-10 h-10 rounded-full glass-button flex items-center justify-center transition-all z-30 ${gameState.isNoteMode ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border-indigo-400' : 'text-slate-400 border-white/10'}`}>
                            <div className="relative"><Icons.Pencil /><span className={`absolute -top-2 -right-2 text-[8px] font-bold rounded-full px-1.5 py-0.5 border border-white/10 transition-colors ${gameState.isNoteMode ? 'bg-white text-indigo-600' : 'bg-slate-800 text-slate-400'}`}>{gameState.isNoteMode ? 'ON' : 'OFF'}</span></div>
                         </button>
                     )}
                 </div>
             </main>

             {/* FIXED FOOTER CONTROLS */}
             {['SUDOKU', 'KAKURO', 'SKYSCRAPERS', 'FUTOSHIKI'].includes(gameState.mode) && (
                  <div className="shrink-0 w-full glass-panel border-t border-white/5 p-4 pb-8 safe-area-bottom z-30 flex justify-center backdrop-blur-xl">
                      <Controls onNumberClick={handleNumberInput} onDelete={()=>handleNumberInput(-1)} gameMode={gameState.mode} maxNumber={gameState.mode === 'FUTOSHIKI' ? gameState.grid.length : 9} />
                  </div>
             )}
        </div>
      )}
    </div>
  );
};

export default App;
