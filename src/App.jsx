import React, { useState, useEffect } from 'react';
import GameMenu from './components/GameMenu/GameMenu';
import GameBoard from './components/GameBoard/GameBoard';
import GameInfoBar from './components/GameInfoBar/GameInfoBar';
import GameOverScreen from './components/GameOverScreen/GameOverScreen';
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

  const handleGameOver = () => {
    setGameState('gameOver');
  }

  const showStats = () => {
    alert('A tela de estatísticas será implementada em breve!');
  };
  
  return (
    <div className="App">
      {gameState === 'menu' ? (
        // Se o estado for 'menu', mostra o Menu
        <GameMenu 
          playerName={playerName}
          setPlayerName={setPlayerName}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          theme={theme}
          setTheme={setTheme}
          onStartGame={startGame} 
        />
      ) : gameState === 'gameOver' ? (
        // Se não for 'menu', verifica se é 'gameOver'. Se for, mostra a tela de Vitória
        <GameOverScreen
          playerName={playerName}
          points={points}
          timer={timer}
          moveCount={moveCount}
          onBackToMenu={backToMenu}
          onShowStats={showStats}
        />
      ) : (
        // Se não for nem 'menu' nem 'gameOver', então só pode ser 'playing'. Mostra o jogo.
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
            onGameOver={handleGameOver} // Não se esqueça de passar a prop!
          />
        </>
      )}
    </div>
  );
}

export default App;