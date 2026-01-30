
import React from 'react';
import { KakuroGrid } from '../types';

interface Props {
  grid: KakuroGrid;
  selectedCell: { r: number; c: number } | null;
  onCellClick: (r: number, c: number) => void;
}

const KakuroBoard: React.FC<Props> = ({ grid, selectedCell, onCellClick }) => {
  if (!grid || !grid[0]) return null;

  const rows = grid.length;
  const cols = grid[0].length;
  
  // Dark Mode Colors
  const COLORS = { 
      WALL: '#0f172a', // Slate 900
      CLUE_BG: '#1e293b', // Slate 800
      STROKE: '#475569', // Slate 600
      EMPTY_BG: '#334155', // Slate 700
      TEXT: '#e2e8f0', // Slate 200
      SELECTED: 'rgba(99, 102, 241, 0.5)', // Indigo
      ERROR_BG: 'rgba(239, 68, 68, 0.3)', 
      ERROR_TEXT: '#fca5a5' 
  };

  return (
    <div className="flex justify-center items-center p-2 select-none touch-manipulation w-full">
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: '1px',
          backgroundColor: '#475569',
          border: '2px solid #475569',
          width: 'min(92vw, 50vh)',
          maxWidth: '420px', 
          aspectRatio: `${cols}/${rows}`,
          borderRadius: '6px',
          overflow: 'hidden'
        }}
      >
        {grid.map((row, rIndex) => (
          row.map((cell, cIndex) => {
            const isSelected = selectedCell?.r === rIndex && selectedCell?.c === cIndex;
            const key = `${rIndex}-${cIndex}`;

            if (cell.type === 'WALL') return <div key={key} style={{ backgroundColor: COLORS.WALL }} className="w-full h-full"/>;

            if (cell.type === 'CLUE') {
              // @ts-ignore
              const rightSum = cell.rightSum || cell.clues?.right;
              // @ts-ignore
              const downSum = cell.downSum || cell.clues?.down;

              return (
                <div key={key} style={{ backgroundColor: COLORS.CLUE_BG }} className="relative w-full h-full overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" stroke={COLORS.STROKE} strokeWidth="1.5" />
                  </svg>
                  {!!rightSum && (
                    <span 
                      style={{ 
                        color: '#94a3b8', 
                        fontSize: cols > 8 ? 'min(2.8vmin, 11px)' : 'min(3.5vmin, 13px)',
                        lineHeight: '1'
                      }} 
                      className="absolute top-[6%] right-[8%] font-black"
                    >
                      {rightSum}
                    </span>
                  )}
                  {!!downSum && (
                    <span 
                      style={{ 
                        color: '#94a3b8', 
                        fontSize: cols > 8 ? 'min(2.8vmin, 11px)' : 'min(3.5vmin, 13px)',
                        lineHeight: '1'
                      }} 
                      className="absolute bottom-[8%] left-[6%] font-black"
                    >
                      {downSum}
                    </span>
                  )}
                </div>
              );
            }

            return (
              <div
                key={key}
                onClick={() => onCellClick(rIndex, cIndex)}
                style={{ 
                  backgroundColor: cell.isError ? COLORS.ERROR_BG : (isSelected ? COLORS.SELECTED : COLORS.EMPTY_BG),
                  color: cell.isError ? COLORS.ERROR_TEXT : COLORS.TEXT,
                  fontSize: cols > 8 ? 'min(3.8vmin, 18px)' : 'min(4.5vmin, 22px)'
                }}
                className="flex items-center justify-center font-bold cursor-pointer transition-colors duration-100"
              >
                {cell.value !== 0 ? cell.value : ''}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default KakuroBoard;
