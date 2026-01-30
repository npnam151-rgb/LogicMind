import React from 'react';
import { HitoriGrid } from '../types';

interface Props {
  grid: HitoriGrid;
  onCellClick: (r: number, c: number) => void;
}

const HitoriBoard: React.FC<Props> = ({ grid, onCellClick }) => {
  if (!grid || !grid[0]) return null;

  const n = grid.length;
  // Dynamic cell sizing logic for different difficulties
  // Easy (5x5): ~48px
  // Medium (8x8): ~36px
  // Hard (10x10): ~32px (mobile friendly)
  const cellSize = n >= 10 ? 'min(8vw, 32px)' : (n >= 8 ? 'min(10vw, 40px)' : 'min(14vw, 55px)');
  const fontSize = n >= 10 ? '14px' : (n >= 8 ? '18px' : '22px');

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
            const isShaded = cell.state === 'SHADED';
            const isMarked = cell.state === 'MARKED'; // Circle mark (for guaranteed white)
            
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                className={`
                  flex items-center justify-center cursor-pointer transition-all duration-200 relative
                  ${isShaded ? 'hitori-shaded' : 'bg-slate-200 hover:bg-white'}
                  ${cell.isError ? '!bg-red-900/60 !border-red-500' : ''}
                `}
                style={{ fontSize }}
              >
                <div 
                    className={`
                        flex items-center justify-center w-full h-full font-bold z-10
                        ${isShaded ? 'opacity-20 scale-90' : 'text-slate-800'}
                        transition-all duration-300
                    `}
                >
                    {cell.value}
                </div>

                {isMarked && !isShaded && (
                     <div className="absolute inset-0 m-1 rounded-full border-2 border-emerald-500 bg-emerald-500/10 pointer-events-none animate-[popIn_0.2s_ease-out]" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HitoriBoard;