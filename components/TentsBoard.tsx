import React from 'react';
import { TentsGrid, TentsClues } from '../types';
import { Icons } from '../constants';

interface Props {
  grid: TentsGrid;
  clues?: TentsClues; // Optional
  onCellClick: (r: number, c: number) => void;
}

const TentsBoard: React.FC<Props> = ({ grid, clues, onCellClick }) => {
  if (!grid || !grid[0]) return null;

  const totalRows = grid.length;
  const totalCols = grid[0].length;
  const n = totalRows - 1; 

  const isSmall = n <= 5;
  const isLarge = n >= 10;

  // Default (Medium)
  let cellSize = 'min(10vw, 38px)';
  let clueSize = '14px';

  if (isSmall) {
      cellSize = 'min(14vw, 50px)';
      clueSize = '16px';
  } else if (isLarge) {
      // Shrink for Hard mode (11x11) to prevent overflow
      cellSize = 'min(7.8vw, 30px)';
      clueSize = '12px';
  }

  return (
    <div className="flex justify-center items-center w-full select-none touch-manipulation py-2">
      <div 
        className="grid gap-1 bg-slate-800 p-2 rounded-xl"
        style={{
          gridTemplateColumns: `repeat(${totalCols}, ${cellSize})`,
          gridTemplateRows: `repeat(${totalRows}, ${cellSize})`,
        }}
      >
        {Array.from({ length: totalRows }).map((_, r) => 
          Array.from({ length: totalCols }).map((__, c) => {
            
            if (r === 0 && c === 0) return <div key="corner" />;

            if (r === 0) {
                const val = clues ? clues.cols[c-1] : grid[r][c].value;
                return (
                    <div key={`col-clue-${c}`} className="flex items-center justify-center font-bold text-slate-400" style={{fontSize: clueSize}}>
                        {val}
                    </div>
                );
            }

            if (c === 0) {
                const val = clues ? clues.rows[r-1] : grid[r][c].value;
                return (
                    <div key={`row-clue-${r}`} className="flex items-center justify-center font-bold text-slate-400" style={{fontSize: clueSize}}>
                        {val}
                    </div>
                );
            }

            const cell = grid[r][c];
            const isTree = cell.type === 'TREE';
            const isTent = cell.state === 'TENT';
            const isGrass = cell.state === 'GRASS';

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                className={`
                  flex items-center justify-center cursor-pointer transition-colors duration-100
                  rounded-md border
                  ${isTree ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-700 border-slate-600'}
                  ${isTent ? 'bg-orange-900/40 border-orange-800' : ''}
                  ${cell.isError ? '!bg-red-900/50 !border-red-700' : ''}
                `}
                style={{ fontSize: clueSize }}
              >
                {isTree && <div className="text-emerald-500 w-[70%] h-[70%]"><Icons.Tree /></div>}
                {isTent && <div className="text-orange-500 w-[70%] h-[70%]"><Icons.TentIcon /></div>}
                {isGrass && <div className="text-slate-500 w-[50%] h-[50%]"><Icons.XMark /></div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TentsBoard;