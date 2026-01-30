import React from 'react';
import { GameMode, UnifiedGrid, NonogramClues, FutoshikiConstraint } from '../types';
import SudokuBoard from './SudokuBoard';
import KakuroBoard from './KakuroBoard';
import NonogramBoard from './NonogramBoard';
import SkyscrapersBoard from './SkyscrapersBoard';
import TakuzuBoard from './TakuzuBoard';
import AkariBoard from './AkariBoard';
import FutoshikiBoard from './FutoshikiBoard';
import TentsBoard from './TentsBoard';
import HitoriBoard from './HitoriBoard';
import NurikabeBoard from './NurikabeBoard';

interface Props {
  mode: GameMode;
  grid: UnifiedGrid;
  selectedCell: { r: number, c: number } | null;
  onCellClick: (r: number, c: number) => void;
  // Specific Game Props
  nonogramClues?: NonogramClues;
  futoshikiConstraints?: FutoshikiConstraint[];
}

const UnifiedGridBoard: React.FC<Props> = ({ 
  mode, grid, selectedCell, onCellClick, 
  nonogramClues, futoshikiConstraints 
}) => {
  if (!grid) return null;

  switch (mode) {
    case 'SUDOKU':
      return <SudokuBoard grid={grid as any} selectedCell={selectedCell} onCellClick={onCellClick} />;
    
    case 'KAKURO':
      return <KakuroBoard grid={grid as any} selectedCell={selectedCell} onCellClick={onCellClick} />;
    
    case 'NONOGRAM':
      // Nonogram needs clues. If missing, render nothing or error placeholder.
      if (!nonogramClues) return <div className="p-4 text-red-500">Missing Nonogram Clues</div>;
      return <NonogramBoard grid={grid as any} clues={nonogramClues} onCellClick={onCellClick} />;
    
    case 'SKYSCRAPERS':
      // Clues are embedded in the grid for UnifiedGrid system
      return <SkyscrapersBoard grid={grid as any} selectedCell={selectedCell} onCellClick={onCellClick} />;
    
    case 'TAKUZU':
      return <TakuzuBoard grid={grid as any} selectedCell={selectedCell} onCellClick={onCellClick} />;
    
    case 'AKARI':
      return <AkariBoard grid={grid as any} onCellClick={onCellClick} />;
    
    case 'FUTOSHIKI':
      return <FutoshikiBoard grid={grid as any} constraints={futoshikiConstraints || []} selectedCell={selectedCell} onCellClick={onCellClick} />;
    
    case 'TENTS':
      // Clues are embedded in the grid for UnifiedGrid system
      return <TentsBoard grid={grid as any} onCellClick={onCellClick} />;
    
    case 'HITORI':
      return <HitoriBoard grid={grid as any} onCellClick={onCellClick} />;
      
    case 'NURIKABE':
      return <NurikabeBoard grid={grid as any} onCellClick={onCellClick} />;

    default:
      return <div className="p-4">Game Board for {mode} not implemented yet.</div>;
  }
};

export default UnifiedGridBoard;