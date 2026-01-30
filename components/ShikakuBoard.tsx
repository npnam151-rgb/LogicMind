import React, { useState, useRef } from 'react';
import { ShikakuClue, ShikakuRect } from '../types';

interface Props {
  size: number;
  clues: ShikakuClue[];
  rects: ShikakuRect[];
  onAddRect: (rect: ShikakuRect) => void;
  onRemoveRect: (id: string) => void;
}

const COLORS = [
  'rgba(239, 68, 68, 0.4)',   
  'rgba(245, 158, 11, 0.4)',  
  'rgba(16, 185, 129, 0.4)', 
  'rgba(59, 130, 246, 0.4)', 
  'rgba(139, 92, 246, 0.4)',  
  'rgba(236, 72, 153, 0.4)', 
];

const BORDER_COLORS = [
  'rgb(239, 68, 68)',
  'rgb(245, 158, 11)',
  'rgb(16, 185, 129)',
  'rgb(59, 130, 246)',
  'rgb(139, 92, 246)',
  'rgb(236, 72, 153)',
];

const ShikakuBoard: React.FC<Props> = ({ size, clues, rects, onAddRect, onRemoveRect }) => {
  const [dragStart, setDragStart] = useState<{ r: number, c: number } | null>(null);
  const [currentDrag, setCurrentDrag] = useState<{ r: number, c: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const cellSize = 'min(9vw, 36px)';
  
  const handlePointerDown = (r: number, c: number, e: React.PointerEvent) => {
    e.preventDefault(); 
    
    // Check if clicking an existing rect to remove it
    const clickedRect = rects.find(rect => 
        r >= rect.r && r < rect.r + rect.h && c >= rect.c && c < rect.c + rect.w
    );

    if (clickedRect) {
        onRemoveRect(clickedRect.id);
        return;
    }

    setDragStart({ r, c });
    setCurrentDrag({ r, c });
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (dragStart) {
        // Optimization: Use requestAnimationFrame to prevent lag on larger grids
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(() => {
            setCurrentDrag({ r, c });
        });
    }
  };

  const handlePointerUp = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (dragStart && currentDrag) {
      const r = Math.min(dragStart.r, currentDrag.r);
      const c = Math.min(dragStart.c, currentDrag.c);
      const h = Math.abs(dragStart.r - currentDrag.r) + 1;
      const w = Math.abs(dragStart.c - currentDrag.c) + 1;

      const isOverlapping = rects.some(rect => {
          const rOverlap = r < rect.r + rect.h && r + h > rect.r;
          const cOverlap = c < rect.c + rect.w && c + w > rect.c;
          return rOverlap && cOverlap;
      });

      if (!isOverlapping) {
          onAddRect({
              id: Math.random().toString(36).substr(2, 9),
              r, c, w, h,
              colorIndex: Math.floor(Math.random() * COLORS.length)
          });
      }
    }
    setDragStart(null);
    setCurrentDrag(null);
  };

  const renderDragPreview = () => {
      if (!dragStart || !currentDrag) return null;
      const r = Math.min(dragStart.r, currentDrag.r);
      const c = Math.min(dragStart.c, currentDrag.c);
      const h = Math.abs(dragStart.r - currentDrag.r) + 1;
      const w = Math.abs(dragStart.c - currentDrag.c) + 1;
      const area = w * h;

      // Validation Logic for Visuals
      let statusClass = 'shikaku-ghost-neutral'; // Default dashed blue
      
      // 1. Check overlap with existing rects
      const isOverlapping = rects.some(rect => {
          const rOverlap = r < rect.r + rect.h && r + h > rect.r;
          const cOverlap = c < rect.c + rect.w && c + w > rect.c;
          return rOverlap && cOverlap;
      });

      // 2. Check enclosed clues
      const containedClues = clues.filter((cl) => 
          cl.r >= r && cl.r < r + h && cl.c >= c && cl.c < c + w
      );

      if (isOverlapping) {
          statusClass = 'shikaku-ghost-error';
      } else if (containedClues.length > 1) {
          // Error: Contains multiple numbers
          statusClass = 'shikaku-ghost-error';
      } else if (containedClues.length === 1) {
          const target = containedClues[0].value;
          if (area === target) {
              // Perfect Match
              statusClass = 'shikaku-ghost-valid'; 
          } else if (area > target) {
              // Error: Area too big for the number
              statusClass = 'shikaku-ghost-error';
          }
          // If area < target, keep neutral (still drawing)
      } else {
          // No clues inside yet, check if size is reasonable or keep neutral
          // We keep neutral unless it's obviously invalid logic, but neutral is fine for 'searching'
      }

      return (
          <div 
            className={`absolute shikaku-ghost ${statusClass} flex items-center justify-center`}
            style={{
                top: `calc(${r} * (${cellSize} + 1px))`,
                left: `calc(${c} * (${cellSize} + 1px))`,
                width: `calc(${w} * (${cellSize} + 1px) - 1px)`,
                height: `calc(${h} * (${cellSize} + 1px) - 1px)`,
            }}
          >
             <span className="text-white font-bold text-lg drop-shadow-md bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
                {area}
             </span>
          </div>
      );
  };

  return (
    <div 
        className="flex justify-center items-center w-full select-none touch-none py-4"
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
    >
      <div 
        ref={boardRef}
        className="relative bg-slate-800 border-2 border-slate-600 shadow-soft"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${cellSize})`,
          gridTemplateRows: `repeat(${size}, ${cellSize})`,
          gap: '1px',
        }}
      >
        {Array.from({ length: size * size }).map((_, i) => {
            const r = Math.floor(i / size);
            const c = i % size;
            const clue = clues.find(cl => cl.r === r && cl.c === c);

            return (
                <div
                    key={i}
                    onPointerDown={(e) => handlePointerDown(r, c, e)}
                    onPointerEnter={() => handlePointerEnter(r, c)}
                    className="bg-slate-700 flex items-center justify-center cursor-pointer"
                    style={{ width: '100%', height: '100%' }}
                >
                    {clue && <span className="font-bold text-white text-lg pointer-events-none relative z-10 drop-shadow-sm">{clue.value}</span>}
                </div>
            );
        })}

        {rects.map(rect => (
            <div
                key={rect.id}
                className={`absolute flex items-center justify-center pointer-events-none shikaku-block-confirmed ${rect.isError ? 'animate-pulse' : ''}`}
                style={{
                    top: `calc(${rect.r} * (${cellSize} + 1px))`,
                    left: `calc(${rect.c} * (${cellSize} + 1px))`,
                    width: `calc(${rect.w} * (${cellSize} + 1px) - 1px)`,
                    height: `calc(${rect.h} * (${cellSize} + 1px) - 1px)`,
                    backgroundColor: COLORS[rect.colorIndex],
                    border: `2px solid ${rect.isError ? 'red' : BORDER_COLORS[rect.colorIndex]}`,
                }}
            >
            </div>
        ))}

        {renderDragPreview()}

      </div>
    </div>
  );
};

export default ShikakuBoard;