import React, { useState, useEffect, useCallback } from 'react';
import GameMenu from './components/GameMenu/GameMenu';
import GameBoard from './components/GameBoard/GameBoard';
import GameInfoBar from './components/GameInfoBar/GameInfoBar';
import GameOverScreen from './components/GameOverScreen/GameOverScreen';
import StatsScreen from './components/StatsScreen/StatsScreen';
import './App.css';

const CHALLENGE_CONFIG = {
  Facil: { timeLimit: 90, moveLimit: 40 },
  Medio: { timeLimit: 120, moveLimit: 60 },
  Dificil: { timeLimit: 150, moveLimit: 75 },
};

const getInitialState = () => {
  const history = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
  const lastGame = history.length > 0 ? history[history.length - 1] : null;
  const globalRecords = JSON.parse(localStorage.getItem('memoryGameRecords')) || {};

  let personalBest = null;
  if (lastGame) {
    const gameModeKey = `${lastGame.theme}-${lastGame.difficulty}`;
    personalBest = globalRecords[gameModeKey] || null;
  }

  return {
    playerName: lastGame ? lastGame.playerName : '',
    lastGameResult: lastGame,
    personalBest: personalBest
  };
};

function App() {
  const initialState = getInitialState();

  const [gameState, setGameState] = useState('menu');
  const [gameMode, setGameMode] = useState('classic');
  const [difficulty, setDifficulty] = useState('Facil');
  const [theme, setTheme] = useState('ANIMAL');
  const [playerName, setPlayerName] = useState(initialState.playerName);
  const [moveCount, setMoveCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(0);
  const [lastGameResult, setLastGameResult] = useState(initialState.lastGameResult);
  const [personalBest, setPersonalBest] = useState(initialState.personalBest);

  const handleGameOver = useCallback((status = 'win') => {
    if (gameState === 'gameOver') return;

    let finalMoveCount, finalTimer;

    if (gameMode === 'challenge') {
      const config = CHALLENGE_CONFIG[difficulty];
      const realMovesLeft = moveCount > 0 ? moveCount - 1 : 0;
      finalMoveCount = config.moveLimit - realMovesLeft;
      const realTimeLeft = timer > 0 ? timer - 1 : 0;
      finalTimer = config.timeLimit - realTimeLeft;
    } else {
      finalMoveCount = moveCount + 1;
      finalTimer = timer + 1;
    }

    const finalPoints = status === 'win' ? points + 1 : points;

    const gameResult = {
      playerName, difficulty, theme,
      points: finalPoints,
      timer: finalTimer,
      moveCount: finalMoveCount,
      date: new Date().toISOString(),
      status,
    };
    setLastGameResult(gameResult);

    const history = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
    history.push(gameResult);
    localStorage.setItem('memoryGameHistory', JSON.stringify(history));

    if (status === 'win') {
      // Lógica de Recorde Global
      const globalRecords = JSON.parse(localStorage.getItem('memoryGameRecords')) || {};
      const gameModeKey = `${theme}-${difficulty}`;
      const existingRecord = globalRecords[gameModeKey];
      const newScore = { ...gameResult };

      if (!existingRecord || newScore.moveCount < existingRecord.moveCount || (newScore.moveCount === existingRecord.moveCount && newScore.timer < existingRecord.timer)) {
        globalRecords[gameModeKey] = newScore;
        localStorage.setItem('memoryGameRecords', JSON.stringify(globalRecords));
        setPersonalBest(newScore); // O novo recorde é o melhor
      } else {
        setPersonalBest(existingRecord); // Mantém o recorde antigo como o melhor
      }
    } else {
      setPersonalBest(null);
    }

    setGameState('gameOver');
  }, [gameState, gameMode, moveCount, timer, points, playerName, difficulty, theme]);

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
  }, [gameState, gameMode, handleGameOver]);

  const startGame = () => {
    if (playerName.trim() === '') {
      setPlayerName('ANONIMO');
    }
    if (gameMode === 'challenge') {
      const limits = CHALLENGE_CONFIG[difficulty];
      setMoveCount(limits.moveLimit);
      setTimer(limits.timeLimit);
    } else {
      setMoveCount(0);
      setTimer(0);
    }
    setPoints(0);
    setGameState('playing');
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  const showStats = () => {
    setGameState('stats');
  };

  const handleClearAllData = () => {
    localStorage.removeItem('memoryGameRecords'); // Limpa os recordes globais
    localStorage.removeItem('memoryGameHistory');
    setPersonalBest(null);
    setLastGameResult(null);
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
          gameResult={lastGameResult}
          onBackToMenu={backToMenu}
          onShowStats={showStats}
          personalBest={personalBest}
        />
      ) : (
        <StatsScreen
          onBackToMenu={backToMenu}
          lastGame={lastGameResult}
          onClearData={handleClearAllData}
        />
      )}
    </div>
  );
}

export default App;