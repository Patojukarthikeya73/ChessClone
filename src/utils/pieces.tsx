import React from 'react';

export function getPieceComponent(piece: string): React.ReactNode {
  const lightWood = '#C19A6B'; // Light wood color
  const darkWood = '#8B5A2B'; // Dark wood color
  const color = piece[0] === 'w' ? lightWood : darkWood;

  switch (piece[1]) {
    case 'K': // King
      return (
        <svg width="40" height="40" viewBox="0 0 45 45">
          <g fill="none" fillRule="evenodd" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 11.63V6M20 8h5" strokeLinejoin="miter"/>
            <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill={color} strokeLinecap="butt" strokeLinejoin="miter"/>
            <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill={color}/>
            <path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0"/>
          </g>
        </svg>
      );
    case 'Q': // Queen
      return (
        <svg width="40" height="40" viewBox="0 0 45 45">
          <g fill={color} fillRule="evenodd" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12z" strokeLinecap="butt"/>
            <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt"/>
          </g>
        </svg>
      );
    case 'R': // Rook
      return (
        <svg width="40" height="40" viewBox="0 0 45 45">
          <g fill={color} fillRule="evenodd" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt"/>
            <path d="M34 14l-3 3H14l-3-3"/>
            <path d="M31 17v12.5H14V17" strokeLinecap="butt" strokeLinejoin="miter"/>
          </g>
        </svg>
      );
    case 'B': // Bishop
      return (
        <svg width="40" height="40" viewBox="0 0 45 45">
          <g fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
          </g>
        </svg>
      );
    case 'N': // Knight
      return (
        <svg width="40" height="40" viewBox="0 0 45 45">
          <g fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
            <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/>
          </g>
        </svg>
      );
    case 'P': // Pawn
      return (
        <svg width="40" height="40" viewBox="0 0 45 45">
          <path d="M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    default:
      return null;
  }
}
