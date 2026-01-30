import React from 'react';
import { Icons } from '../constants';
import { GameMode } from '../types';

interface Props {
  onNumberClick: (num: number) => void;
  onDelete: () => void;
  gameMode?: GameMode;
  maxNumber?: number;
}

const Controls: React.FC<Props> = ({ onNumberClick, onDelete, gameMode, maxNumber = 9 }) => {
  
  return (
    <div className="w-full max-w-[360px] z-30 px-2 flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-2 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const isValid = num <= maxNumber;
          return (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              disabled={!isValid}
              className={`
                h-12 flex items-center justify-center rounded-xl border-b-[3px] active:border-b-0 active:translate-y-[3px] text-2xl font-bold transition-all touch-manipulation font-inter backdrop-blur-sm shadow-sm
                ${isValid 
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                  : 'bg-white/5 border-transparent text-white/10 cursor-not-allowed'}
              `}
            >
              {num}
            </button>
          );
        })}
        
        <button
          onClick={onDelete}
          className="h-12 flex items-center justify-center bg-red-500/10 text-red-400 rounded-xl border-b-[3px] border-red-500/20 active:border-b-0 active:translate-y-[3px] transition-all touch-manipulation backdrop-blur-sm shadow-sm"
        >
          <Icons.Eraser />
        </button>
      </div>
    </div>
  );
};

export default Controls;