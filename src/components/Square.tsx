import React from 'react';

interface SquareProps {
  isLight: boolean;
  isSelected: boolean;
  children?: React.ReactNode;
  onClick: () => void;
}

export function Square({ isLight, isSelected, children, onClick }: SquareProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full h-full flex items-center justify-center cursor-pointer relative
        ${isLight ? 'bg-[#eeeed2]' : 'bg-[#769656]'}
        ${isSelected ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
        ${isSelected ? 'bg-yellow-200' : ''}
        transition-colors duration-200
      `}
    >
      <div className="transform hover:scale-105 transition-transform duration-200">
        {children}
      </div>
    </div>
  );
}