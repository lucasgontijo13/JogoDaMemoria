import React, { useState, useEffect } from 'react';
import GameMenu from './components/GameMenu/GameMenu';
import GameBoard from './components/GameBoard/GameBoard';
import GameInfoBar from './components/GameInfoBar/GameInfoBar';
import GameOverScreen from './components/GameOverScreen/GameOverScreen';
import StatsScreen from './components/StatsScreen/StatsScreen';
import './App.css';

const CHALLENGE_CONFIG = {
  Facil: { timeLimit: 2, moveLimit: 40 },
  Medio: { timeLimit: 120, moveLimit: 60 },
  Dificil: { timeLimit: 150, moveLimit: 75 },
};

function App() {
  const [gameState, setGameState] = useState('menu');
  const [gameStatus, setGameStatus] = useState('win');
  const [gameMode, setGameMode] = useState('classic');
  const [difficulty, setDifficulty] = useState('Facil');
  const [theme, setTheme] = useState('ANIMAL');
  const [playerName, setPlayerName] = useState('');
  const [moveCount, setMoveCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(0);
  const [lastGameResult, setLastGameResult] = useState(null);
  const [personalBest, setPersonalBest] = useState(null);
  const [challengeInitialConfig, setChallengeInitialConfig] = useState(null); // Guarda a config inicial

  useEffect(() => {
    let intervalId;
    if (gameState === 'playing') {
      intervalId = setInterval(() => {
        if (gameMode === 'challenge') {
          setTimer(prevTimer => {
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              handleGameOver('lose');
              return 0;
            }
          });
        } else {
          setTimer(prevTimer => prevTimer + 1);
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameState, gameMode]);

  const startGame = () => {
    if (playerName.trim() === '') {
      setPlayerName('ANONIMO');
    }

    if (gameMode === 'challenge') {
      const limits = CHALLENGE_CONFIG[difficulty];
      setChallengeInitialConfig(limits); // Salva a config
      setMoveCount(limits.moveLimit);
      setTimer(limits.timeLimit);
    } else {
      setChallengeInitialConfig(null); // Limpa a config
      setMoveCount(0);
      setTimer(0);
    }

    setPoints(0);
    setGameState('playing');
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  const handleGameOver = (status = 'win') => {
    if (gameState === 'gameOver') return;

    setGameStatus(status);

    const gameResult = {
      playerName, difficulty, theme, points, timer, moveCount,
      date: new Date().toISOString(),
      status,
    };
    setLastGameResult(gameResult);

    const history = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
    history.push(gameResult);
    localStorage.setItem('memoryGameHistory', JSON.stringify(history));

    if (status === 'win') {
      const allPlayersRecords = JSON.parse(localStorage.getItem('allPlayersRecords')) || {};
      const currentPlayerRecords = allPlayersRecords[playerName] || {};
      const gameModeKey = `${theme}-${difficulty}`;
      const existingPersonalRecord = currentPlayerRecords[gameModeKey];

      const newScore = {
        playerName, theme, difficulty, moveCount, timer,
        date: gameResult.date,
      };

      if (!existingPersonalRecord || newScore.moveCount < existingPersonalRecord.moveCount || (newScore.moveCount === existingPersonalRecord.moveCount && newScore.timer < existingPersonalRecord.timer)) {
        currentPlayerRecords[gameModeKey] = newScore;
        allPlayersRecords[playerName] = currentPlayerRecords;
        localStorage.setItem('allPlayersRecords', JSON.stringify(allPlayersRecords));
        setPersonalBest(newScore);
      } else {
        setPersonalBest(existingPersonalRecord);
      }
    } else {
      setPersonalBest(null);
    }

    setGameState('gameOver');
  };

  const showStats = () => {
    setGameState('stats');
  };

  return (
    <div className="App">
      {gameState === 'menu' ? (
        <GameMenu
          playerName={playerName}
          setPlayerName={setPlayerName}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          theme={theme}
          setTheme={setTheme}
          onStartGame={startGame}
          gameMode={gameMode}
          setGameMode={setGameMode}
          onShowStats={showStats}
        />
      ) : gameState === 'playing' ? (
        <>
          <GameInfoBar
            playerName={playerName}
            moveCount={moveCount}
            timer={timer}
            points={points}
            gameMode={gameMode}
            difficulty={difficulty}
            challengeConfig={CHALLENGE_CONFIG}
          />
          <GameBoard
            difficulty={difficulty}
            theme={theme}
            onBackToMenu={backToMenu}
            moveCount={moveCount}
            setMoveCount={setMoveCount}
            setPoints={setPoints}
            onGameOver={handleGameOver}
            gameMode={gameMode}
          />
        </>
      ) : gameState === 'gameOver' ? (
        <GameOverScreen
          gameStatus={gameStatus}
          playerName={playerName}
          points={points}
          timer={timer}
          moveCount={moveCount}
          onBackToMenu={backToMenu}
          onShowStats={showStats}
          personalBest={personalBest}
          gameMode={gameMode} // Passa o modo de jogo
          challengeInitialConfig={challengeInitialConfig} // Passa a config
        />
      ) : (
        <StatsScreen
          onBackToMenu={backToMenu}
          lastGame={lastGameResult}
          currentPlayerName={playerName}
        />
      )}
    </div>
  );
}

export default App;