import React from 'react';
import { SudokuGrid } from '../types';

interface Props {
  grid: SudokuGrid;
  selectedCell: { r: number; c: number } | null;
  onCellClick: (r: number, c: number) => void;
}

const SudokuBoard: React.FC<Props> = ({ grid, selectedCell, onCellClick }) => {
  return (
    <div className="select-none touch-manipulation flex justify-center items-center w-full">
      <div 
        className="grid grid-cols-9 grid-rows-[repeat(9,minmax(0,1fr))] gap-[1px] bg-slate-600 border-2 border-slate-600 rounded-lg overflow-hidden"
        style={{ 
          width: 'min(75vw, 50vh)',
          aspectRatio: '1 / 1',
          maxWidth: '380px',
        }}
      >
        {grid.map((row, rIndex) => (
          row.map((cell, cIndex) => {
            const isSelected = selectedCell?.r === rIndex && selectedCell?.c === cIndex;
            const isRelated = selectedCell && (selectedCell.r === rIndex || selectedCell.c === cIndex);
            
            const borderRight = (cIndex + 1) % 3 === 0 && cIndex !== 8 ? 'border-r-[2px] border-r-slate-600' : '';
            const borderBottom = (rIndex + 1) % 3 === 0 && rIndex !== 8 ? 'border-b-[2px] border-b-slate-600' : '';

            return (
              <div
                key={`${rIndex}-${cIndex}`}
                onClick={() => onCellClick(rIndex, cIndex)}
                className={`
                  relative flex items-center justify-center cursor-pointer transition-colors duration-75
                  ${borderRight} ${borderBottom}
                  ${cell.isFixed ? 'bg-slate-800 text-slate-300 font-bold' : 'bg-slate-900 text-indigo-400 font-semibold'}
                  ${isSelected ? '!bg-indigo-600/50 !text-white z-10' : ''}
                  ${!isSelected && isRelated ? '!bg-slate-700/50' : ''}
                  ${cell.isError ? '!bg-red-900/50 !text-red-400' : ''}
                `}
                style={{ fontSize: 'min(4vmin, 20px)' }}
              >
                {cell.value !== 0 ? (
                    cell.value
                ) : (
                    <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-[2px]">
                        {[1,2,3,4,5,6,7,8,9].map(n => (
                            <div key={n} className="flex items-center justify-center text-[min(2.5vmin,10px)] text-slate-400 leading-none">
                                {cell.notes && cell.notes.includes(n) ? n : ''}
                            </div>
                        ))}
                    </div>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default SudokuBoard;