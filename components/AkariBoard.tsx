import React from 'react';
import { AkariGrid } from '../types';
import { Icons } from '../constants';

interface Props {
  grid: AkariGrid;
  onCellClick: (r: number, c: number) => void;
}

const AkariBoard: React.FC<Props> = ({ grid, onCellClick }) => {
  if (!grid || !grid[0]) return null;

  const n = grid.length;
  const isLarge = n >= 10;
  const cellSize = isLarge ? 'min(8.5vw, 32px)' : 'min(12vw, 45px)';
  const fontSize = isLarge ? '16px' : '20px';

  return (
    <div className="flex justify-center items-center w-full select-none touch-manipulation">
      <div 
        className="grid gap-[1px] bg-slate-700 border-2 border-slate-700 rounded p-1 shadow-2xl"
        style={{
          gridTemplateColumns: `repeat(${n}, ${cellSize})`,
          gridTemplateRows: `repeat(${n}, ${cellSize})`,
        }}
      >
        {grid.map((row, r) => 
          row.map((cell, c) => {
            
            // Wall Rendering
            if (cell.type === 'WALL') {
                return (
                  <div
                    key={`${r}-${c}`}
                    className="flex items-center justify-center bg-slate-900 text-white font-bold select-none relative"
                    style={{ fontSize }}
                  >
                    <div className="absolute inset-0 border border-white/5 opacity-50"></div>
                    {cell.value !== null ? (
                        <span className={cell.isError ? 'text-red-400' : 'text-slate-200'}>
                            {cell.value}
                        </span>
                    ) : ''}
                  </div>
                );
            }

            const isLit = cell.isLit;
            const hasBulb = cell.state === 'BULB';
            const isMarked = cell.state === 'MARKED';
            
            // Custom Glassmorphism Colors
            const baseColor = 'rgba(30, 41, 59, 1)'; // Slate 800
            const litColor = 'rgba(255, 255, 150, 0.15)'; // Soft Yellow Glass
            const errorColor = 'rgba(127, 29, 29, 0.5)'; // Red tint

            let backgroundColor = isLit ? litColor : baseColor;
            if (hasBulb && cell.isError) backgroundColor = errorColor;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                className="flex items-center justify-center cursor-pointer cell-transition relative overflow-hidden"
                style={{ 
                    fontSize,
                    backgroundColor: backgroundColor,
                }}
              >
                {/* Lit Highlight Overlay to enhance the glass feel */}
                {isLit && !hasBulb && (
                    <div className="absolute inset-0 bg-yellow-400/5 pointer-events-none" />
                )}

                {hasBulb && (
                    <div 
                        className={`
                            relative z-10 
                            animate-[popIn_0.25s_cubic-bezier(0.175,0.885,0.32,1.275)] 
                            will-change-transform
                            ${cell.isError ? 'animate-[shake_0.4s_ease-in-out_infinite]' : 'bulb-glow'}
                        `}
                    >
                        <div className={cell.isError ? 'text-red-500 drop-shadow-md' : 'text-yellow-300'}>
                            <Icons.Akari />
                        </div>
                    </div>
                )}
                
                {isMarked && (
                     <div className="text-slate-600 text-[10px] animate-[popIn_0.1s_ease-out]">
                        <Icons.XMark />
                     </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AkariBoard;