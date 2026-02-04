
import React from 'react';
import { NonogramGrid, NonogramClues } from '../types';
import { Icons } from '../constants';

interface Props {
  grid: NonogramGrid;
  clues: NonogramClues;
  onCellClick: (r: number, c: number) => void;
}

const NonogramBoard: React.FC<Props> = ({ grid, clues, onCellClick }) => {
  if (!grid || !grid[0]) return null;

  const rows = grid.length;
  const cols = grid[0].length;
  const isSmall = cols <= 6;
  const isLarge = cols > 12;

  let cellSize = 'min(8.5vw, 32px)';
  let fontSize = '10px';

  if (isSmall) {
      cellSize = 'min(12vw, 45px)';
      fontSize = '14px';
  } else if (isLarge) {
      cellSize = 'min(5.5vw, 24px)'; 
      fontSize = '9px';
  }

  return (
    <div className="flex flex-col items-center justify-center select-none touch-manipulation p-2 w-full overflow-x-auto no-scrollbar">
      <div 
        className="grid gap-[1px] bg-slate-700 rounded p-1 mx-auto"
        style={{
          gridTemplateColumns: `auto repeat(${cols}, ${cellSize})`,
          gridTemplateRows: `auto repeat(${rows}, ${cellSize})`,
        }}
      >
        <div className="bg-transparent"></div>

        {/* Top Clues */}
        {clues.cols.map((colClues, cIndex) => (
          <div key={`col-clue-${cIndex}`} className="flex flex-col justify-end items-center pb-1 gap-0.5 bg-slate-800 border-b border-slate-600">
             {colClues.map((num, i) => (
               <span key={i} className="font-bold text-slate-400 leading-none" style={{fontSize}}>{num}</span>
             ))}
          </div>
        ))}

        {/* Rows */}
        {grid.map((row, rIndex) => (
          <React.Fragment key={`row-${rIndex}`}>
            {/* Left Clues */}
            <div className="flex justify-end items-center pr-2 gap-1 bg-slate-800 border-r border-slate-600">
               {clues.rows[rIndex].map((num, i) => (
                 <span key={i} className="font-bold text-slate-400 leading-none" style={{fontSize}}>{num}</span>
               ))}
            </div>

            {/* Cells */}
            {row.map((cell, cIndex) => {
              const borderRight = (cIndex + 1) % 5 === 0 && cIndex !== cols - 1 ? 'border-r border-slate-500' : '';
              const borderBottom = (rIndex + 1) % 5 === 0 && rIndex !== rows - 1 ? 'border-b border-slate-500' : '';
              
              return (
                <div
                  key={`${rIndex}-${cIndex}`}
                  onClick={() => onCellClick(rIndex, cIndex)}
                  className={`
                    relative flex items-center justify-center cursor-pointer
                    border border-slate-600
                    ${borderRight} ${borderBottom}
                    ${cell.state === 'FILLED' ? 'bg-indigo-500' : 'bg-slate-900 hover:bg-slate-800'}
                    ${cell.isError ? '!bg-red-900/50' : ''}
                  `}
                >
                  {cell.state === 'MARKED' && (
                    <div className="text-slate-600 w-2/3 h-2/3"><Icons.XMark /></div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default NonogramBoard;
