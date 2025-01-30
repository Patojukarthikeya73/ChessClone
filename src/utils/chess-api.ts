// Convert our board position to FEN notation
export function boardToFen(position: string[][], isWhiteTurn: boolean): string {
  let fen = '';
  
  for (let rank = 0; rank < 8; rank++) {
    let emptySquares = 0;
    
    for (let file = 0; file < 8; file++) {
      const piece = position[rank][file];
      
      if (piece === '') {
        emptySquares++;
      } else {
        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }
        const fenPiece = piece[0] === 'w' 
          ? piece[1].toUpperCase() 
          : piece[1].toLowerCase();
        fen += fenPiece;
      }
    }
    
    if (emptySquares > 0) {
      fen += emptySquares;
    }
    
    if (rank < 7) {
      fen += '/';
    }
  }
  
  // Use the correct turn indicator
  fen += isWhiteTurn ? ' w ' : ' b ';

  // Proper placeholders for castling, en passant, and move counters (will be improved later)
  fen += '- - 0 1';
  
  return fen;
}
  

// Convert a chess.com API move to our move format
export function apiMoveToSquares(move: string): [string, string] {
  const from = move.substring(0, 2);
  const to = move.substring(2, 4);
  return [from, to];
}

// Make an API request to get the computer's move
export async function getComputerMove(position: string[][], isWhiteTurn: boolean): Promise<[string, string]> {
  try {
    const fen = boardToFen(position, isWhiteTurn); // Now correctly passes the turn state
    const response = await fetch('https://chess-api.com/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fen,
        depth: 12,
        maxThinkingTime: 50
      })
    });
    
    const data = await response.json();
    if (data.move) {
      return apiMoveToSquares(data.move);
    }
    throw new Error('No move received from API');
  } catch (error) {
    console.error('Error getting computer move:', error);
    throw error;
  }
}

