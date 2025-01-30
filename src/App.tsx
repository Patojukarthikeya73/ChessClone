import React, { useState, useCallback, useEffect } from 'react';
import { Chessboard } from './components/Chessboard';
import { INITIAL_POSITION, isValidMove, makeMove } from './utils/game';
import { getComputerMove } from './utils/chess-api';
import { Clock, Users, RotateCcw } from 'lucide-react';

function App() {
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState(true);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [gameMode, setGameMode] = useState<'computer' | 'twoPlayer'>('computer');
  const [computerPlaysWhite, setComputerPlaysWhite] = useState(false);

  const makeComputerMove = useCallback(async () => {
    if (gameMode === 'computer' && isWhiteTurn === computerPlaysWhite) {
      setIsThinking(true);
      try {
        const [from, to] = await getComputerMove(position);
        const newPosition = makeMove(from, to, position);
        setPosition(newPosition);
        setMoveHistory([...moveHistory, `${from}-${to}`]);
        setIsWhiteTurn(!isWhiteTurn);
      } catch (error) {
        console.error('Failed to make computer move:', error);
      } finally {
        setIsThinking(false);
      }
    }
  }, [position, isWhiteTurn, gameMode, moveHistory, computerPlaysWhite]);

  useEffect(() => {
    makeComputerMove();
  }, [isWhiteTurn, makeComputerMove]);

  const handleSquareClick = (square: string) => {
    if (isThinking || (gameMode === 'computer' && isWhiteTurn === computerPlaysWhite)) {
      return;
    }

    if (selectedSquare === null) {
      // First click - select the piece
      const [file, rank] = square.split('');
      const fileIndex = 'abcdefgh'.indexOf(file);
      const rankIndex = 8 - parseInt(rank);
      const piece = position[rankIndex][fileIndex];
      
      if (piece && ((isWhiteTurn && piece[0] === 'w') || (!isWhiteTurn && piece[0] === 'b'))) {
        setSelectedSquare(square);
      }
    } else {
      // Second click - attempt to move the piece
      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }

      if (isValidMove(selectedSquare, square, position, isWhiteTurn)) {
        const newPosition = makeMove(selectedSquare, square, position);
        setPosition(newPosition);
        setMoveHistory([...moveHistory, `${selectedSquare}-${square}`]);
        setIsWhiteTurn(!isWhiteTurn);
      }
      
      setSelectedSquare(null);
    }
  };

  const resetGame = () => {
    setPosition(INITIAL_POSITION);
    setSelectedSquare(null);
    setIsWhiteTurn(true);
    setMoveHistory([]);
  };

  const toggleGameMode = () => {
    setGameMode(current => current === 'computer' ? 'twoPlayer' : 'computer');
    resetGame();
  };

  const toggleComputerColor = () => {
    setComputerPlaysWhite(!computerPlaysWhite);
    resetGame();
  };

  const getPlayerName = (isWhite: boolean) => {
    if (gameMode === 'twoPlayer') {
      return isWhite ? 'White Player' : 'Black Player';
    }
    const isComputer = isWhite === computerPlaysWhite;
    return isComputer ? 'Computer' : 'You';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Chess Clone</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleGameMode}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <Users className="mr-2" size={20} />
              {gameMode === 'computer' ? 'Switch to 2 Players' : 'Switch to Computer'}
            </button>
            {gameMode === 'computer' && (
              <button 
                onClick={toggleComputerColor}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Computer plays as {computerPlaysWhite ? 'Black' : 'White'}
              </button>
            )}
            <button 
              onClick={resetGame}
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <RotateCcw className="mr-2" size={20} />
              New Game
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="bg-gray-800 p-6 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
                    alt="Black Player"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold">{getPlayerName(false)}</span>
                  {!isWhiteTurn && <span className="ml-2 text-yellow-400">●</span>}
                </div>
                {isThinking && <span className="text-blue-400">Thinking...</span>}
              </div>

              <Chessboard
                position={position}
                selectedSquare={selectedSquare}
                onSquareClick={handleSquareClick}
              />

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop"
                    alt="White Player"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="font-semibold">{getPlayerName(true)}</span>
                  {isWhiteTurn && <span className="ml-2 text-yellow-400">●</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="w-80">
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold mb-4">Game Info</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users className="mr-2" size={20} />
                  <span>
                    {gameMode === 'computer' 
                      ? `Playing vs Computer (${computerPlaysWhite ? 'White' : 'Black'})` 
                      : 'Local 2-Player Game'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2" size={20} />
                  <span>{isWhiteTurn ? "White" : "Black"}'s turn</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Move History</h2>
              <div className="space-y-2 text-sm max-h-60 overflow-y-auto">
                {moveHistory.map((move, index) => (
                  <div key={index} className="flex">
                    <span className="w-8 text-gray-400">{Math.floor(index / 2) + 1}.</span>
                    <span className="w-20">{move}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;