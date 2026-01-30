import React from 'react';
import { SkyscrapersGrid, SkyscrapersClues } from '../types';

interface Props {
  grid: SkyscrapersGrid;
  clues?: SkyscrapersClues;
  selectedCell: { r: number; c: number } | null;
  onCellClick: (r: number, c: number) => void;
}

const SkyscrapersBoard: React.FC<Props> = ({ grid, clues, selectedCell, onCellClick }) => {
  if (!grid || !grid[0]) return null;

  const n = grid.length - 2;
  const totalRows = grid.length;
  const totalCols = grid[0].length;
  
  const isSmall = n <= 4;
  const cellSize = isSmall ? 'min(14vw, 55px)' : 'min(10vw, 40px)';
  const fontSize = isSmall ? '24px' : '18px';

  const renderClueCell = (r: number, c: number) => {
    let content = null;
    let isCorner = false;
    if ((r === 0 && c === 0) || (r === 0 && c === totalCols - 1) || 
        (r === totalRows - 1 && c === 0) || (r === totalRows - 1 && c === totalCols - 1)) {
        isCorner = true;
    } else {
        if (clues) {
            if (r === 0 && c > 0) content = clues.top[c - 1];
            else if (r === totalRows - 1 && c > 0) content = clues.bottom[c - 1];
            else if (c === 0 && r > 0) content = clues.left[r - 1];
            else if (c === totalCols - 1 && r > 0) content = clues.right[r - 1];
        } else {
            content = grid[r][c].value;
        }
    }

    return (
      <div 
        key={`${r}-${c}`} 
        className={`flex items-center justify-center font-bold text-slate-400 select-none ${isCorner ? 'opacity-0' : ''}`}
        style={{ fontSize: '14px' }}
      >
        {content}
      </div>
    );
  };

  const renderPlayableCell = (r: number, c: number) => {
    const cell = grid[r][c];
    const isSelected = selectedCell?.r === r && selectedCell?.c === c;
    const isRelated = selectedCell && (selectedCell.r === r || selectedCell.c === c);
    
    return (
      <div
        key={`${r}-${c}`}
        onClick={() => onCellClick(r, c)}
        className={`
          flex items-center justify-center cursor-pointer transition-colors duration-75
          border border-slate-600 rounded-sm
          ${cell.isFixed ? 'text-slate-400 font-bold bg-slate-800' : 'text-indigo-300 font-semibold bg-slate-700'}
          ${isSelected ? '!bg-indigo-600/50 !text-white z-10 ring-2 ring-indigo-400' : ''}
          ${!isSelected && isRelated ? '!bg-slate-600' : ''}
          ${cell.isError ? '!bg-red-900/50 !text-red-400' : ''}
        `}
        style={{ fontSize }}
      >
        {cell.value !== 0 ? cell.value : ''}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center w-full select-none touch-manipulation">
      <div 
        className="grid gap-1 bg-slate-800 p-2 rounded-xl"
        style={{
          gridTemplateColumns: `repeat(${totalCols}, ${cellSize})`,
          gridTemplateRows: `repeat(${totalRows}, ${cellSize})`,
        }}
      >
        {Array.from({ length: totalRows }).map((_, r) => 
          Array.from({ length: totalCols }).map((__, c) => {
            const isBorder = r === 0 || r === totalRows - 1 || c === 0 || c === totalCols - 1;
            if (isBorder) return renderClueCell(r, c);
            else return renderPlayableCell(r, c);
          })
        )}
      </div>
    </div>
  );
};

export default SkyscrapersBoard;