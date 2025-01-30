import React from 'react';
import { Square } from './Square';
import { getPieceComponent } from '../utils/pieces';

interface ChessboardProps {
  position: string[][];
  selectedSquare: string | null;
  onSquareClick: (square: string) => void;
}

export function Chessboard({ position, selectedSquare, onSquareClick }: ChessboardProps) {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="grid grid-cols-8 w-[600px] h-[600px] border-2 border-gray-700 shadow-xl">
      {ranks.map((rank, rankIndex) =>
        files.map((file, fileIndex) => {
          const square = `${file}${rank}`;
          const piece = position[rankIndex][fileIndex];
          const isLight = (rankIndex + fileIndex) % 2 === 0;
          const isSelected = selectedSquare === square;

          return (
            <Square
              key={square}
              isLight={isLight}
              isSelected={isSelected}
              onClick={() => onSquareClick(square)}
            >
              {piece && getPieceComponent(piece)}
            </Square>
          );
        })
      )}
    </div>
  );
}