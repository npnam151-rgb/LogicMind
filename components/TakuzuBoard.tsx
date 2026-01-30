import React from 'react';
import { TakuzuGrid } from '../types';

interface Props {
  grid: TakuzuGrid;
  selectedCell: { r: number; c: number } | null;
  onCellClick: (r: number, c: number) => void;
}

const TakuzuBoard: React.FC<Props> = ({ grid, selectedCell, onCellClick }) => {
  if (!grid || !grid[0]) return null;

  const n = grid.length;
  const isLarge = n >= 10;
  const cellSize = isLarge ? 'min(8.5vw, 32px)' : 'min(12vw, 45px)';
  const fontSize = isLarge ? '14px' : '20px';

  return (
    <div className="flex justify-center items-center w-full select-none touch-manipulation">
      <div 
        className="grid gap-[2px] bg-slate-600 border-2 border-slate-500 rounded p-1"
        style={{
          gridTemplateColumns: `repeat(${n}, ${cellSize})`,
          gridTemplateRows: `repeat(${n}, ${cellSize})`,
        }}
      >
        {grid.map((row, r) => 
          row.map((cell, c) => {
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            const isRelated = selectedCell && (selectedCell.r === r || selectedCell.c === c);
            
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => onCellClick(r, c)}
                className={`
                  flex items-center justify-center cursor-pointer transition-all duration-75 rounded-sm
                  ${cell.isFixed ? 'font-black' : 'font-medium'}
                  ${isSelected ? '!bg-indigo-600/60 ring-2 ring-indigo-400 z-10' : ''}
                  ${!isSelected && isRelated ? 'bg-slate-700' : 'bg-slate-800'}
                  ${cell.isError ? '!bg-red-900/50 !text-red-400' : ''}
                  ${cell.value === 0 ? 'text-rose-400' : (cell.value === 1 ? 'text-teal-400' : '')}
                  ${cell.isFixed ? 'bg-slate-700' : ''} 
                `}
                style={{ fontSize }}
              >
                {cell.value !== -1 ? cell.value : ''}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TakuzuBoard;