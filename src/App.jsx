import React, { useState, useEffect } from 'react';
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

function App() {
  const [gameState, setGameState] = useState('menu');

  const [gameMode, setGameMode] = useState('classic');

  const [difficulty, setDifficulty] = useState('Facil');
  const [theme, setTheme] = useState('ANIMAL');
  const [playerName, setPlayerName] = useState('');
  
  const [moveCount, setMoveCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(0);

  const [lastGameResult, setLastGameResult] = useState(null);
  const [personalBest, setPersonalBest] = useState(null);


  useEffect(() => {
    let intervalId;
    if (gameState === 'playing') {
      intervalId = setInterval(() => {
        if (gameMode === 'challenge') {
          // No modo desafio, o tempo diminui
          setTimer(prevTimer => (prevTimer > 0 ? prevTimer - 1 : 0));
        } else {
          // No modo clássico, o tempo aumenta
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

  const handleGameOver = () => {
    if (gameState === 'gameOver') return;

    const gameResult = {
      playerName, difficulty, theme, points, timer, moveCount,
      date: new Date().toISOString(),
    };
    setLastGameResult(gameResult);

    // Salva no histórico geral
    const history = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
    history.push(gameResult);
    localStorage.setItem('memoryGameHistory', JSON.stringify(history));

    // 2. Lógica de Recordes Pessoais
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
      setPersonalBest(newScore); // É um novo recorde pessoal
    } else {
      setPersonalBest(existingPersonalRecord); // Não é um novo recorde, mostra o antigo
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
            setMoveCount={setMoveCount}
            setPoints={setPoints}
            onGameOver={handleGameOver}
            gameMode={gameMode}
          />
        </>
      ) : gameState === 'gameOver' ? (
        <GameOverScreen
          playerName={playerName}
          points={points}
          timer={timer}
          moveCount={moveCount}
          onBackToMenu={backToMenu}
          onShowStats={showStats}
          personalBest={personalBest} 
        />
      ) : ( // O último estado só pode ser 'stats'
        <StatsScreen 
        onBackToMenu={backToMenu} 
        lastGame={lastGameResult}
        currentPlayerName={playerName}  />
      )}
    </div>
  );
}

export default App;