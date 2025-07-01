import React, { useState } from 'react';
import GameMenu from './components/GameMenu/GameMenu';
import GameBoard from './components/GameBoard/GameBoard';
import './App.css'; 

function App() {
  const [gameState, setGameState] = useState('menu'); // 'menu' ou 'playing'
  const [difficulty, setDifficulty] = useState('Fácil');
  // const [theme, setTheme] = useState('PETS'); // Podemos usar o tema depois

  // Função para iniciar o jogo, que será passada para o GameMenu
  const startGame = (selectedDifficulty, selectedTheme) => {
    setDifficulty(selectedDifficulty);
    // setTheme(selectedTheme);
    setGameState('playing');
  };

  // Função para voltar ao menu
  const backToMenu = () => {
    setGameState('menu');
  };

  return (
    <div className="App">
      {/* Renderização condicional: mostra uma tela ou outra */}
      {gameState === 'menu' ? (
        <GameMenu onStartGame={startGame} />
      ) : (
        <GameBoard difficulty={difficulty} onBackToMenu={backToMenu} />
      )}
    </div>
  );
}

export default App;