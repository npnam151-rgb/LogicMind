
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

  // Sizing logic matched to AkariBoard
  const isLarge = size >= 10;
  const cellSize = isLarge ? 'min(8.5vw, 32px)' : 'min(12vw, 45px)';
  const fontSize = isLarge ? '16px' : '20px';
  
  // Helper to calculate cell coordinates mathematically instead of relying on DOM hit-testing.
  // This is much more robust on iOS Safari.
  const getCellFromPoint = (clientX: number, clientY: number) => {
      if (!boardRef.current) return null;
      const rect = boardRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Check if interaction is outside the board bounds
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return null;

      // Calculate approximate column/row width based on current container size
      const colWidth = rect.width / size;
      const rowHeight = rect.height / size;

      const c = Math.floor(x / colWidth);
      const r = Math.floor(y / rowHeight);

      // Clamp values to ensure they stay within grid limits
      const safeC = Math.max(0, Math.min(size - 1, c));
      const safeR = Math.max(0, Math.min(size - 1, r));

      return { r: safeR, c: safeC };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); 
    
    // Capture pointer immediately to handle dragging outside the initial cell
    if (boardRef.current) {
        boardRef.current.setPointerCapture(e.pointerId);
    }

    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    const { r, c } = cell;

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

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStart) return;
    // e.preventDefault() is crucial on iOS to prevent scrolling while dragging
    e.preventDefault();

    // Optimization: Use requestAnimationFrame to prevent lag
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
        const cell = getCellFromPoint(e.clientX, e.clientY);
        if (cell) {
            setCurrentDrag(cell);
        }
        rafRef.current = null;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    }

    if (boardRef.current) {
        boardRef.current.releasePointerCapture(e.pointerId);
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
             <span className="text-white font-bold drop-shadow-md bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm" style={{ fontSize: fontSize }}>
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
        // Ensure touch-action is strictly none to prevent scrolling on iOS
        className="relative bg-slate-800 border-2 border-slate-600 shadow-soft touch-none"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${cellSize})`,
          gridTemplateRows: `repeat(${size}, ${cellSize})`,
          gap: '1px',
          touchAction: 'none'
        }}
      >
        {Array.from({ length: size * size }).map((_, i) => {
            const r = Math.floor(i / size);
            const c = i % size;
            const clue = clues.find(cl => cl.r === r && cl.c === c);

            return (
                <div
                    key={i}
                    className="bg-slate-700 flex items-center justify-center pointer-events-none"
                    style={{ width: '100%', height: '100%' }}
                >
                    {clue && <span className="font-bold text-white relative z-10 drop-shadow-sm" style={{ fontSize: fontSize }}>{clue.value}</span>}
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
