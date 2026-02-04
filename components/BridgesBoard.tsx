
import React, { useState, useRef } from 'react';
import { BridgesIsland, BridgesLine } from '../types';

interface Props {
  size: number;
  islands: BridgesIsland[];
  lines: BridgesLine[];
  onInteract: (fromId: string, toId: string) => void;
}

const BridgesBoard: React.FC<Props> = ({ size, islands, lines, onInteract }) => {
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{x: number, y: number} | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const CELL_SIZE = 40;
  const PADDING = 20;
  const ISLAND_RADIUS = 14;
  
  // Calculate internal coordinate system dimensions
  const width = size * CELL_SIZE + PADDING * 2;
  const height = size * CELL_SIZE + PADDING * 2;

  const getCoord = (idx: number) => PADDING + idx * CELL_SIZE + CELL_SIZE / 2;

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      setDragStart(id);
      const pt = getSVGPoint(e);
      setDragCurrent(pt);
      (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
      if (dragStart) {
          const pt = getSVGPoint(e);
          setDragCurrent(pt);
      }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      if (dragStart) {
          const pt = getSVGPoint(e);
          let foundTargetId = null;
          for (const isl of islands) {
              if (isl.id === dragStart) continue;
              const cx = getCoord(isl.c);
              const cy = getCoord(isl.r);
              const dist = Math.sqrt(Math.pow(pt.x - cx, 2) + Math.pow(pt.y - cy, 2));
              if (dist < ISLAND_RADIUS * 2.5) {
                  foundTargetId = isl.id;
                  break;
              }
          }
          if (foundTargetId) {
              onInteract(dragStart, foundTargetId);
          }
          setDragStart(null);
          setDragCurrent(null);
      }
  };

  const getSVGPoint = (e: React.PointerEvent) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const CTM = svgRef.current.getScreenCTM();
      if (!CTM) return { x: 0, y: 0 };
      return {
          x: (e.clientX - CTM.e) / CTM.a,
          y: (e.clientY - CTM.f) / CTM.d
      };
  };

  return (
    <div className="flex justify-center items-center w-full select-none touch-none py-2">
      <div 
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-soft overflow-hidden"
        style={{
            // Constrain container width to viewport (92% of screen width) or max 480px
            // Aspect ratio ensures height adjusts automatically
            width: 'min(92vw, 480px)',
            aspectRatio: '1/1' 
        }}
      >
        <svg 
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ touchAction: 'none' }}
        >
            {/* Grid Dots */}
            {Array.from({length: size}).map((_, r) => 
                Array.from({length: size}).map((__, c) => (
                    <circle key={`dot-${r}-${c}`} cx={getCoord(c)} cy={getCoord(r)} r={1} fill="#475569" />
                ))
            )}

            {/* Bridges Lines */}
            {lines.map(line => {
                const i1 = islands.find(i => i.id === line.fromId);
                const i2 = islands.find(i => i.id === line.toId);
                if (!i1 || !i2) return null;

                const x1 = getCoord(i1.c);
                const y1 = getCoord(i1.r);
                const x2 = getCoord(i2.c);
                const y2 = getCoord(i2.r);

                if (line.value === 1) {
                    return <line key={line.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="3" />;
                } else {
                    const offset = 3;
                    if (Math.abs(x1 - x2) < 1) { // Vertical double bridge
                        return (
                            <g key={line.id}>
                                <line x1={x1-offset} y1={y1} x2={x2-offset} y2={y2} stroke="#94a3b8" strokeWidth="3" />
                                <line x1={x1+offset} y1={y1} x2={x2+offset} y2={y2} stroke="#94a3b8" strokeWidth="3" />
                            </g>
                        );
                    } else { // Horizontal double bridge
                        return (
                            <g key={line.id}>
                                <line x1={x1} y1={y1-offset} x2={x2} y2={y2-offset} stroke="#94a3b8" strokeWidth="3" />
                                <line x1={x1} y1={y1+offset} x2={x2} y2={y2+offset} stroke="#94a3b8" strokeWidth="3" />
                            </g>
                        );
                    }
                }
            })}

            {/* Drag Preview Line */}
            {dragStart && dragCurrent && (
                <line 
                    x1={getCoord(islands.find(i => i.id === dragStart)!.c)}
                    y1={getCoord(islands.find(i => i.id === dragStart)!.r)}
                    x2={dragCurrent.x}
                    y2={dragCurrent.y}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    pointerEvents="none"
                />
            )}

            {/* Islands */}
            {islands.map(island => {
                const x = getCoord(island.c);
                const y = getCoord(island.r);
                const isSatisfied = island.currentCount === island.value;
                const isOver = (island.currentCount || 0) > island.value;
                
                return (
                    <g 
                        key={island.id} 
                        onPointerDown={(e) => handlePointerDown(e, island.id)}
                        className="cursor-pointer"
                    >
                        <circle 
                            cx={x} cy={y} r={ISLAND_RADIUS} 
                            fill={isSatisfied ? '#1e293b' : '#334155'} 
                            stroke={isOver ? '#ef4444' : (isSatisfied ? '#94a3b8' : '#3b82f6')}
                            strokeWidth={isSatisfied ? 2 : 2.5}
                            className="transition-colors duration-200"
                        />
                        <text 
                            x={x} y={y} dy=".35em" textAnchor="middle" 
                            fontSize="14" fontWeight="bold" 
                            fill={isOver ? '#ef4444' : (isSatisfied ? '#94a3b8' : '#e2e8f0')}
                            pointerEvents="none"
                        >
                            {island.value}
                        </text>
                    </g>
                );
            })}
        </svg>
      </div>
    </div>
  );
};

export default BridgesBoard;
