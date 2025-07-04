import React, { useState, useEffect } from 'react';
import GameMenu from './components/GameMenu/GameMenu';
import GameBoard from './components/GameBoard/GameBoard';
import GameInfoBar from './components/GameInfoBar/GameInfoBar';
import './App.css'; 

function App() {
  const [gameState, setGameState] = useState('menu');
  
  // Os estados do jogo agora são a única fonte da verdade
  const [difficulty, setDifficulty] = useState('Facil');
  const [theme, setTheme] = useState('ANIMAL');
  const [playerName, setPlayerName] = useState('');
  
  const [moveCount, setMoveCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let intervalId;
    if (gameState === 'playing') {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [gameState]);

  // A função startGame agora não precisa de parâmetros, pois o App já conhece os estados
  const startGame = () => {
    // A lógica de 'ANONIMO' é movida para cá
    if (playerName.trim() === '') {
      setPlayerName('ANONIMO');
    }
    setMoveCount(0);
    setPoints(0);
    setTimer(0);
    setGameState('playing');
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="App">
      {gameState === 'menu' ? (
        <GameMenu 
          // Passa todos os valores e as funções de atualização para o Menu
          playerName={playerName}
          setPlayerName={setPlayerName}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          theme={theme}
          setTheme={setTheme}
          onStartGame={startGame} 
        />
      ) : (
        <>
          <GameInfoBar
            playerName={playerName}
            moveCount={moveCount}
            timer={timer}
            points={points}
          />
          <GameBoard
            difficulty={difficulty}
            theme={theme}
            onBackToMenu={backToMenu}
            setMoveCount={setMoveCount}
            setPoints={setPoints}
          />
        </>
      )}
    </div>
  );
}

export default App;