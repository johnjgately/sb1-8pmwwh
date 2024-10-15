import React from 'react';

interface ScoreBoardProps {
  players: string[];
  scores: number[];
  currentPlayer: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ players, scores, currentPlayer }) => {
  return (
    <div className="bg-blue-800 p-4 mb-4">
      <div className="max-w-6xl mx-auto flex justify-around">
        {players.map((player, index) => (
          <div
            key={player}
            className={`text-center ${index === currentPlayer ? 'border-b-2 border-yellow-500' : ''}`}
          >
            <h3 className={`text-lg font-bold ${index === currentPlayer ? 'text-yellow-500' : ''}`}>{player}</h3>
            <p className="text-2xl">${scores[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreBoard;