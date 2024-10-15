import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverProps {
  players: string[];
  scores: number[];
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ players, scores, onRestart }) => {
  const maxScore = Math.max(...scores);
  const winners = players.filter((_, index) => scores[index] === maxScore);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-blue-900 p-6 rounded-lg max-w-2xl w-full text-center">
        <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
        <div className="flex justify-center items-center mb-6">
          <Trophy size={48} className="text-yellow-500 mr-2" />
          <p className="text-2xl">
            {winners.length === 1
              ? `${winners[0]} wins with $${maxScore}!`
              : `It's a tie! ${winners.join(' and ')} win with $${maxScore}!`}
          </p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Final Scores:</h3>
          {players.map((player, index) => (
            <p key={player} className="text-lg">
              {player}: ${scores[index]}
            </p>
          ))}
        </div>
        <button
          onClick={onRestart}
          className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-full text-xl font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center mx-auto"
        >
          <RotateCcw className="mr-2" /> Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOver;