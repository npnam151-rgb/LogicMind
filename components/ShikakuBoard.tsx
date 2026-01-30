
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
  
  // Mobile-friendly drag start logic using DOM element detection
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); 
    
    // Find the cell under the pointer/finger
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const cellElement = element?.closest('[data-shikaku-cell="true"]');
    
    if (!cellElement) return;

    const r = parseInt(cellElement.getAttribute('data-r') || '-1');
    const c = parseInt(cellElement.getAttribute('data-c') || '-1');

    if (r === -1 || c === -1) return;

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

    // Important for touch: Capture pointer to the board container so we keep receiving events
    // even if the finger moves slightly outside initially
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStart) return;

    // Optimization: Use requestAnimationFrame to prevent lag
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
        // Look up element under cursor (works for both touch and mouse)
        const element = document.elementFromPoint(e.clientX, e.clientY);
        const cellElement = element?.closest('[data-shikaku-cell="true"]');

        if (cellElement) {
            const r = parseInt(cellElement.getAttribute('data-r') || '-1');
            const c = parseInt(cellElement.getAttribute('data-c') || '-1');
            
            if (r !== -1 && c !== -1) {
                setCurrentDrag({ r, c });
            }
        }
        rafRef.current = null;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    }

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
    (e.currentTarget as Element).releasePointerCapture(e.pointerId);
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
    >
      <div 
        ref={boardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative bg-slate-800 border-2 border-slate-600 shadow-soft touch-none"
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
                    data-shikaku-cell="true"
                    data-r={r}
                    data-c={c}
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
