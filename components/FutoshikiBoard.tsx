import React from 'react';
import { FutoshikiGrid, FutoshikiConstraint } from '../types';

interface Props {
  grid: FutoshikiGrid;
  constraints: FutoshikiConstraint[];
  selectedCell: { r: number; c: number } | null;
  onCellClick: (r: number, c: number) => void;
}

const FutoshikiBoard: React.FC<Props> = ({ grid, constraints, selectedCell, onCellClick }) => {
  if (!grid || !grid[0]) return null;

  const n = grid.length;
  
  // Dynamic sizing based on N, similar to Skyscrapers approach
  let cellSize = 'min(12vw, 50px)';
  let fontSize = '20px';
  let signSize = '14px';
  let gapSize = '4px';

  if (n <= 4) { // Small
      cellSize = 'min(18vw, 65px)';
      fontSize = '28px';
      signSize = '20px';
      gapSize = '8px';
  } else if (n === 5) { // Medium
      cellSize = 'min(14vw, 55px)';
      fontSize = '22px';
      signSize = '16px';
      gapSize = '6px';
  } else { // Hard (6 or 7)
      cellSize = 'min(11vw, 42px)'; 
      fontSize = '18px';
      signSize = '12px';
      gapSize = '4px';
  }

  const getConstraint = (r: number, c: number, type: 'row' | 'col') => {
      return constraints.find(k => k.type === type && k.r === r && k.c === c);
  };

  return (
    <div className="flex justify-center items-center w-full select-none touch-manipulation py-2">
      <div 
        className="bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-xl"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n}, ${cellSize})`,
          gridTemplateRows: `repeat(${n}, ${cellSize})`,
          gap: gapSize,
        }}
      >
        {grid.map((row, r) => 
          row.map((cell, c) => {
            const isSelected = selectedCell?.r === r && selectedCell?.c === c;
            const isRelated = selectedCell && (selectedCell.r === r || selectedCell.c === c);
            const key = `${r}-${c}`;

            const rowConstraint = getConstraint(r, c, 'row');
            const colConstraint = getConstraint(r, c, 'col');

            return (
              <div
                key={key}
                onClick={() => onCellClick(r, c)}
                className={`
                  relative flex items-center justify-center cursor-pointer transition-colors duration-75
                  border border-slate-600 rounded-lg shadow-sm
                  ${cell.isFixed ? 'text-slate-400 font-bold bg-slate-900' : 'text-indigo-300 font-bold bg-slate-700'}
                  ${isSelected ? '!bg-indigo-600/50 ring-2 ring-indigo-400 z-10' : ''}
                  ${!isSelected && isRelated ? 'bg-slate-700/80' : ''}
                  ${cell.isError ? '!bg-red-900/50 !text-red-400' : ''}
                `}
                style={{ 
                    fontSize,
                    // Remove aspectRatio here as grid rows/cols handle size
                }}
              >
                {cell.value !== 0 ? cell.value : ''}

                {/* Horizontal Constraint (Between this cell and next column) */}
                {rowConstraint && (
                    <div 
                        className="absolute flex items-center justify-center text-slate-400 font-black z-20 pointer-events-none"
                        style={{
                            right: `calc(-1 * ${gapSize} / 0.7 - 8px)`, // Adjusted for gap size
                            top: '50%',
                            transform: 'translate(50%, -50%)',
                            width: '20px',
                            fontSize: signSize
                        }}
                    >
                        <span className="scale-110 drop-shadow-md bg-slate-800/80 rounded px-0.5">{rowConstraint.sign}</span>
                    </div>
                )}

                {/* Vertical Constraint (Between this cell and next row) */}
                {colConstraint && (
                    <div 
                        className="absolute flex items-center justify-center text-slate-400 font-black z-20 pointer-events-none"
                        style={{
                            bottom: `calc(-1 * ${gapSize} / 0.7 - 8px)`, // Adjusted for gap size
                            left: '50%',
                            transform: 'translate(-50%, 50%) rotate(90deg)', 
                            height: '20px',
                            width: '20px',
                            fontSize: signSize
                        }}
                    >
                       <span className="scale-110 drop-shadow-md bg-slate-800/80 rounded px-0.5">{colConstraint.sign}</span>
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

export default FutoshikiBoard;