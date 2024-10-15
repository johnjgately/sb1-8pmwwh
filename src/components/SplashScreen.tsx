import React, { useState } from 'react';
import { Play, UserPlus, UserMinus } from 'lucide-react';

interface SplashScreenProps {
  onStart: (players: string[]) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2']);

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, `Player ${players.length + 1}`]);
    }
  };

  const removePlayer = () => {
    if (players.length > 2) {
      setPlayers(players.slice(0, -1));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900 text-white">
      <h1 className="text-6xl font-bold mb-8">Welcome to JRMS Jeopardy!</h1>
      <div className="mb-8">
        {players.map((player, index) => (
          <input
            key={index}
            type="text"
            value={player}
            onChange={(e) => updatePlayerName(index, e.target.value)}
            className="bg-blue-800 text-white px-4 py-2 rounded mb-2 w-full"
            placeholder={`Player ${index + 1}`}
          />
        ))}
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={addPlayer}
            disabled={players.length >= 4}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <UserPlus />
          </button>
          <button
            onClick={removePlayer}
            disabled={players.length <= 2}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <UserMinus />
          </button>
        </div>
      </div>
      <button
        onClick={() => onStart(players)}
        className="bg-yellow-500 text-blue-900 px-6 py-3 rounded-full text-xl font-bold hover:bg-yellow-400 transition-colors flex items-center"
      >
        <Play className="mr-2" /> Start Game
      </button>
    </div>
  );
};

export default SplashScreen;