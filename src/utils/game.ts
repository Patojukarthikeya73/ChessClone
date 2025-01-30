export type Position = string[][];
export type CastlingRights = { [key: string]: boolean };

export const INITIAL_POSITION: Position = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

export const DEFAULT_CASTLING_RIGHTS: CastlingRights = {
  wK: true,
  wQ: true,
  bK: true,
  bQ: true,
};

function isPawnFirstMove(fromRank: number, piece: string): boolean {
  return (piece[0] === 'w' && fromRank === 6) || (piece[0] === 'b' && fromRank === 1);
}

function isPathClear(fromFile: number, fromRank: number, toFile: number, toRank: number, position: Position): boolean {
  const fileStep = fromFile < toFile ? 1 : fromFile > toFile ? -1 : 0;
  const rankStep = fromRank < toRank ? 1 : fromRank > toRank ? -1 : 0;
  
  let f = fromFile + fileStep;
  let r = fromRank + rankStep;
  
  while (f !== toFile || r !== toRank) {
    if (position[r][f] !== '') return false;
    f += fileStep;
    r += rankStep;
  }
  return true;
}

function isValidPawnMove(fromFile: number, fromRank: number, toFile: number, toRank: number, piece: string, position: Position): boolean {
  const direction = piece[0] === 'w' ? -1 : 1;
  const isFirstMove = isPawnFirstMove(fromRank, piece);
  const targetPiece = position[toRank][toFile];

  if (fromFile === toFile && !targetPiece) {
    if (toRank === fromRank + direction) return true;
    if (isFirstMove && toRank === fromRank + 2 * direction && isPathClear(fromFile, fromRank, toFile, toRank, position)) return true;
  }

  if (Math.abs(fromFile - toFile) === 1 && toRank === fromRank + direction && targetPiece && targetPiece[0] !== piece[0]) {
    return true;
  }

  return false;
}

function isValidRookMove(fromFile: number, fromRank: number, toFile: number, toRank: number, position: Position): boolean {
  return (fromFile === toFile || fromRank === toRank) && isPathClear(fromFile, fromRank, toFile, toRank, position);
}

function isValidKnightMove(fromFile: number, fromRank: number, toFile: number, toRank: number): boolean {
  const fileDiff = Math.abs(toFile - fromFile);
  const rankDiff = Math.abs(toRank - fromRank);
  return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2);
}

function isValidBishopMove(fromFile: number, fromRank: number, toFile: number, toRank: number, position: Position): boolean {
  return Math.abs(toFile - fromFile) === Math.abs(toRank - fromRank) && isPathClear(fromFile, fromRank, toFile, toRank, position);
}

function isValidQueenMove(fromFile: number, fromRank: number, toFile: number, toRank: number, position: Position): boolean {
  return isValidRookMove(fromFile, fromRank, toFile, toRank, position) || isValidBishopMove(fromFile, fromRank, toFile, toRank, position);
}

export function isValidKingMove(
  fromFile: number, 
  fromRank: number, 
  toFile: number, 
  toRank: number, 
  position: Position, 
  piece: string, 
  castlingRights: CastlingRights
): boolean {
  if (Math.abs(toFile - fromFile) <= 1 && Math.abs(toRank - fromRank) <= 1) {
    return true; // Normal king move
  }

  // Castling logic
  const isWhite = piece[0] === 'w';
  const homeRank = isWhite ? 7 : 0;

  if (fromRank === homeRank && fromFile === 4 && toRank === homeRank) {
    if (toFile === 6 && castlingRights[piece[0] + 'K']) {  // Kingside castling
      if (position[homeRank][5] === '' && position[homeRank][6] === '' && position[homeRank][7] === piece[0] + 'R') {
        return true;
      }
    }
    if (toFile === 2 && castlingRights[piece[0] + 'Q']) {  // Queenside castling
      if (position[homeRank][1] === '' && position[homeRank][2] === '' && position[homeRank][3] === '' && position[homeRank][0] === piece[0] + 'R') {
        return true;
      }
    }
  }
  return false;
}


export function isValidMove(
  fromSquare: string,
  toSquare: string,
  position: Position,
  isWhiteTurn: boolean,
  castlingRights: CastlingRights = { ...DEFAULT_CASTLING_RIGHTS }
): boolean {

  const [fromFile, fromRank] = fromSquare.split('');
  const [toFile, toRank] = toSquare.split('');
  
  const fromFileIndex = 'abcdefgh'.indexOf(fromFile);
  const fromRankIndex = 8 - parseInt(fromRank);
  const toFileIndex = 'abcdefgh'.indexOf(toFile);
  const toRankIndex = 8 - parseInt(toRank);
  
  const piece = position[fromRankIndex][fromFileIndex];
  
  if (!piece || (isWhiteTurn && piece[0] !== 'w') || (!isWhiteTurn && piece[0] !== 'b')) return false;
  if (position[toRankIndex][toFileIndex]?.[0] === piece[0]) return false;

  switch (piece[1]) {
    case 'P': return isValidPawnMove(fromFileIndex, fromRankIndex, toFileIndex, toRankIndex, piece, position);
    case 'R': return isValidRookMove(fromFileIndex, fromRankIndex, toFileIndex, toRankIndex, position);
    case 'N': return isValidKnightMove(fromFileIndex, fromRankIndex, toFileIndex, toRankIndex);
    case 'B': return isValidBishopMove(fromFileIndex, fromRankIndex, toFileIndex, toRankIndex, position);
    case 'Q': return isValidQueenMove(fromFileIndex, fromRankIndex, toFileIndex, toRankIndex, position);
    case 'K': return isValidKingMove(fromFileIndex, fromRankIndex, toFileIndex, toRankIndex, position, piece, castlingRights);
    default: return false;
  }
}

export function makeMove(
  fromSquare: string,
  toSquare: string,
  position: Position,
  castlingRights: CastlingRights = { wK: true, wQ: true, bK: true, bQ: true } // Ensure default value
): Position {
  const newPosition = position.map(row => [...row]); // Deep copy
  const [fromFile, fromRank] = fromSquare.split('');
  const [toFile, toRank] = toSquare.split('');
  
  const fromFileIndex = 'abcdefgh'.indexOf(fromFile);
  const fromRankIndex = 8 - parseInt(fromRank);
  const toFileIndex = 'abcdefgh'.indexOf(toFile);
  const toRankIndex = 8 - parseInt(toRank);
  
  const piece = newPosition[fromRankIndex][fromFileIndex];

  // Ensure castlingRights is not undefined
  if (!castlingRights) {
    console.error("castlingRights is undefined!");
    return newPosition; // Prevent crash
  }

  // Castling logic
  if (piece[1] === 'K' && Math.abs(toFileIndex - fromFileIndex) === 2) {
    const isWhite = piece[0] === 'w';
    const homeRank = isWhite ? 7 : 0;

    if (toFileIndex === 6 && castlingRights[piece[0] + 'K']) {  // Kingside castling
      newPosition[homeRank][4] = '';  // Remove King from e1/e8
      newPosition[homeRank][6] = piece;  // Move King to g1/g8
      newPosition[homeRank][7] = '';  // Remove Rook from h1/h8
      newPosition[homeRank][5] = piece[0] + 'R';  // Move Rook to f1/f8
    } else if (toFileIndex === 2 && castlingRights[piece[0] + 'Q']) {  // Queenside castling
      newPosition[homeRank][4] = '';  // Remove King from e1/e8
      newPosition[homeRank][2] = piece;  // Move King to c1/c8
      newPosition[homeRank][0] = '';  // Remove Rook from a1/a8
      newPosition[homeRank][3] = piece[0] + 'R';  // Move Rook to d1/d8
    }

    // Ensure castlingRights object exists before modifying it
    if (castlingRights) {
      castlingRights[piece[0] + 'K'] = false;
      castlingRights[piece[0] + 'Q'] = false;
    }
  } else {
    // Regular move
    newPosition[toRankIndex][toFileIndex] = piece;
    newPosition[fromRankIndex][fromFileIndex] = '';
  }

  return newPosition;
}
