import React from 'react';
import { NurikabeGrid } from '../types';

interface Props {
  grid: NurikabeGrid;
  onCellClick: (r: number, c: number) => void;
}

const NurikabeBoard: React.FC<Props> = ({ grid, onCellClick }) => {
  if (!grid || !grid[0]) return null;

  const n = grid.length;
  const cellSize = n >= 8 ? 'min(9vw, 36px)' : 'min(12vw, 48px)';
  const fontSize = n >= 8 ? '16px' : '20px';

  // Helper to check if an island is "satisfied" (has exact number of connected dots)
  // This is purely visual for the user
  const getIslandStatus = (startR: number, startC: number, target: number) => {
      // Basic BFS to count connected non-wall cells
      const q = [{r: startR, c: startC}];
      const visited = new Set<string>();
      visited.add(`${startR}-${startC}`);
      let count = 0;
      
      while(q.length > 0) {
          const curr = q.shift()!;
          count++;
          if (count > target) return 'overflow'; // Optimization

          const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
          for(const d of dirs) {
              const nr = curr.r + d[0], nc = curr.c + d[1];
              if(nr>=0 && nr<n && nc>=0 && nc<n && 
                 grid[nr][nc].state !== 'WALL' && 
                 !visited.has(`${nr}-${nc}`)) {
                  visited.add(`${nr}-${nc}`);
                  q.push({r:nr, c:nc});
              }
          }
      }
      return count === target ? 'satisfied' : (count > target ? 'overflow' : 'under');
  };

  return (
    <div className="flex justify-center items-center w-full select-none touch-manipulation py-4">
      <div 
        className="grid gap-[1px] bg-slate-600 border-2 border-slate-600 rounded overflow-hidden shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${n}, ${cellSize})`,
          gridTemplateRows: `repeat(${n}, ${cellSize})`,
        }}
      >
        {grid.map((row, r) => 
          row.map((cell, c) => {
            const isSea = cell.state === 'WALL'; // Black/Blue Sea
            const isDot = cell.state === 'DOT';  // User marked dot
            const hasNumber = cell.value > 0;
            
            let numberStatus = 'under';
            if (hasNumber) {
                numberStatus = getIslandStatus(r, c, cell.value);
            }

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                className={`
                  flex items-center justify-center cursor-pointer transition-all duration-300
                  ${isSea ? 'bg-sky-600/40 backdrop-blur-[2px]' : 'bg-slate-200 hover:bg-white'}
                  ${cell.isError ? '!bg-red-900/60' : ''}
                `}
                style={{ fontSize }}
              >
                 {hasNumber ? (
                     <span 
                        className={`font-bold transition-opacity duration-300 
                            ${numberStatus === 'satisfied' ? 'text-slate-900 opacity-30' : (numberStatus === 'overflow' ? 'text-red-500' : 'text-slate-800')}
                        `}
                     >
                        {cell.value}
                     </span>
                 ) : (
                     <>
                        {isDot && (
                            <div className="w-2 h-2 rounded-full bg-slate-500 animate-[popIn_0.2s_ease-out]" />
                        )}
                     </>
                 )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NurikabeBoard;