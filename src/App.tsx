import React, { useState, useEffect } from 'react';
import JeopardyBoard from './components/JeopardyBoard';
import Modal from './components/Modal';
import SplashScreen from './components/SplashScreen';
import ScoreBoard from './components/ScoreBoard';
import GameOver from './components/GameOver';
import AdminPanel from './components/AdminPanel';
import { Trophy } from 'lucide-react';
import { getRandomCategories, initDatabase, dbInitialized, getQuestionsByCategory } from './db/database';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [modalData, setModalData] = useState<{ question: string; answer: string; value: number } | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tiebreaker, setTiebreaker] = useState<{ question: string; answer: string; value: number } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const totalQuestions = 25;

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    const initGame = async () => {
      try {
        await initDatabase();
        const randomCategories = getRandomCategories(5);
        setCategories(randomCategories);
        addLog("Game initialized with random categories");
      } catch (error) {
        console.error("Failed to initialize the game:", error);
        addLog(`Error initializing game: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    initGame();
  }, []);

  useEffect(() => {
    addLog(`Answered questions: ${answeredQuestions}, Total questions: ${totalQuestions}`);
    addLog(`Current scores: ${JSON.stringify(scores)}`);
    addLog(`Game over status: ${gameOver}`);

    if (answeredQuestions === totalQuestions) {
      const maxScore = Math.max(...scores);
      const leadersCount = scores.filter(score => score === maxScore).length;
      
      addLog(`Max score: ${maxScore}, Leaders count: ${leadersCount}`);

      if (leadersCount > 1) {
        addLog("Tie detected, setting up tiebreaker");
        const tiebreakerCategory = getRandomCategories(1)[0];
        const tiebreakerQuestions = getQuestionsByCategory(tiebreakerCategory.id);
        setTiebreaker(tiebreakerQuestions[Math.floor(Math.random() * tiebreakerQuestions.length)]);
      } else {
        addLog("Setting game over to true");
        setGameOver(true);
      }
    }
  }, [answeredQuestions, scores]);

  const startGame = (playerNames: string[]) => {
    setPlayers(playerNames);
    setScores(new Array(playerNames.length).fill(0));
    setGameStarted(true);
    setAnsweredQuestions(0);
    setGameOver(false);
    setTiebreaker(null);
    addLog(`Game started with players: ${playerNames.join(', ')}`);
  };

  const closeModal = () => setModalData(null);

  const updateScore = (points: number, playerIndex: number) => {
    setScores(prevScores => {
      const newScores = [...prevScores];
      newScores[playerIndex] += points;
      addLog(`Updated score for player ${playerIndex}: ${newScores[playerIndex]}`);
      return newScores;
    });
    setAnsweredQuestions(prev => {
      const newAnsweredQuestions = prev + 1;
      addLog(`Answered questions updated: ${newAnsweredQuestions}`);
      return newAnsweredQuestions;
    });
  };

  const nextPlayer = () => {
    setCurrentPlayer((currentPlayer + 1) % players.length);
    addLog(`Next player: ${(currentPlayer + 1) % players.length}`);
  };

  const handleTiebreakerAnswer = (correct: boolean, playerIndex: number) => {
    if (correct) {
      updateScore(tiebreaker!.value, playerIndex);
    }
    setTiebreaker(null);
    addLog("Tiebreaker completed, setting game over to true");
    setGameOver(true);
  };

  const restartGame = () => {
    setGameStarted(false);
    setModalData(null);
    setPlayers([]);
    setScores([]);
    setCurrentPlayer(0);
    setAnsweredQuestions(0);
    setGameOver(false);
    setTiebreaker(null);
    const randomCategories = getRandomCategories(5);
    setCategories(randomCategories);
    addLog("Game restarted");
  };

  if (loading) {
    return <div className="min-h-screen bg-blue-900 text-white flex items-center justify-center">
      <p className="text-2xl">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white">
      {!gameStarted ? (
        <SplashScreen onStart={startGame} />
      ) : (
        <>
          <header className="text-center py-4">
            <h1 className="text-4xl font-bold flex items-center justify-center">
              <Trophy className="mr-2" /> JRMS Jeopardy
            </h1>
          </header>
          <ScoreBoard players={players} scores={scores} currentPlayer={currentPlayer} />
          <JeopardyBoard setModalData={setModalData} categories={categories} />
          {modalData && (
            <Modal
              question={modalData.question}
              answer={modalData.answer}
              value={modalData.value}
              onClose={closeModal}
              onAnswer={updateScore}
              players={players}
              currentPlayer={currentPlayer}
              nextPlayer={nextPlayer}
            />
          )}
          {tiebreaker && (
            <Modal
              question={tiebreaker.question}
              answer={tiebreaker.answer}
              value={tiebreaker.value}
              onClose={() => setTiebreaker(null)}
              onAnswer={handleTiebreakerAnswer}
              players={players}
              currentPlayer={currentPlayer}
              nextPlayer={nextPlayer}
              isTiebreaker={true}
            />
          )}
          {gameOver && (
            <GameOver players={players} scores={scores} onRestart={restartGame} />
          )}
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="fixed bottom-4 right-4 bg-yellow-500 text-blue-900 px-4 py-2 rounded"
          >
            {showAdminPanel ? 'Hide Admin Panel' : 'Show Admin Panel'}
          </button>
          {showAdminPanel && <AdminPanel onSimulateGame={startGame} logs={logs} />}
        </>
      )}
    </div>
  );
}

export default App;