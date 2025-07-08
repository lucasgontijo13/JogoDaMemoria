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

  if (lastGame) {
    const allRecords = JSON.parse(localStorage.getItem('allPlayersRecords')) || {};
    const playerRecords = allRecords[lastGame.playerName] || {};
    const gameModeKey = `${lastGame.theme}-${lastGame.difficulty}`;
    const personalBest = playerRecords[gameModeKey] || null;

    return {
      playerName: lastGame.playerName,
      lastGameResult: lastGame,
      personalBest: personalBest
    };
  }

  return { playerName: '', lastGameResult: null, personalBest: null };
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
      const allPlayersRecords = JSON.parse(localStorage.getItem('allPlayersRecords')) || {};
      const currentPlayerRecords = allPlayersRecords[playerName] || {};
      const gameModeKey = `${theme}-${difficulty}`;
      const existingPersonalRecord = currentPlayerRecords[gameModeKey];
      const newScore = { ...gameResult };

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
    localStorage.removeItem('allPlayersRecords');
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
          currentPlayerName={playerName}
          onClearData={handleClearAllData}
        />
      )}
    </div>
  );
}

export default App;