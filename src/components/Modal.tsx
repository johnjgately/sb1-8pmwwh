import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  question: string;
  answer: string;
  value: number;
  onClose: () => void;
  onAnswer: (points: number, playerIndex: number) => void;
  players: string[];
  currentPlayer: number;
  nextPlayer: () => void;
  isTiebreaker?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  question, 
  answer, 
  value, 
  onClose, 
  onAnswer, 
  players, 
  currentPlayer, 
  nextPlayer,
  isTiebreaker = false
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(currentPlayer);

  const handleAnswer = (correct: boolean) => {
    onAnswer(correct ? value : 0, selectedPlayer);
    if (!isTiebreaker) {
      nextPlayer();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-blue-900 p-6 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isTiebreaker ? "Tiebreaker Question" : `Question for $${value}`}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        <p className="text-xl mb-6">{question}</p>
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="bg-yellow-500 text-blue-900 px-4 py-2 rounded hover:bg-yellow-400 transition-colors"
          >
            Show Answer
          </button>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-2">Answer:</h3>
            <p className="text-lg mb-4">{answer}</p>
            <div className="mb-4">
              <label htmlFor="playerSelect" className="block text-sm font-medium text-gray-300 mb-2">
                Select answering player:
              </label>
              <select
                id="playerSelect"
                value={selectedPlayer}
                onChange={(e) => setSelectedPlayer(Number(e.target.value))}
                className="bg-blue-800 text-white px-3 py-2 rounded w-full"
              >
                {players.map((player, index) => (
                  <option key={player} value={index}>
                    {player}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleAnswer(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Correct
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Incorrect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;