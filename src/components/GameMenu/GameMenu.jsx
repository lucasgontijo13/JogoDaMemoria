import React from 'react';
import './GameMenu.css';

function GameMenu({ 
  playerName, 
  setPlayerName, 
  difficulty, 
  setDifficulty, 
  theme, 
  setTheme, 
  onStartGame,
  gameMode,
  setGameMode,
  onShowStats 
}) {

  const handlePlay = () => {
    onStartGame();
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Jogo da Memória</h1>
      
      <input
        type="text"
        className="name-input"
        placeholder="DIGITE SEU NOME"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

  
      <button
        onClick={() => setGameMode(gameMode === 'classic' ? 'challenge' : 'classic')}
        className={`btn challenge-btn ${gameMode === 'challenge' ? 'active' : ''}`}
      >
        Modo Desafio: {gameMode === 'challenge' ? 'ATIVADO' : 'DESATIVADO'}
      </button>


      <div className="options-grid">
        <button
          onClick={() => setDifficulty('Facil')}
          className={`btn btn-magenta ${difficulty === 'Facil' ? 'active' : ''}`}
        >
          Facil
        </button>
        <button
          onClick={() => setDifficulty('Medio')}
          className={`btn btn-cyan ${difficulty === 'Medio' ? 'active' : ''}`}
        >
          Medio
        </button>
        <button
          onClick={() => setDifficulty('Dificil')}
          className={`btn btn-yellow ${difficulty === 'Dificil' ? 'active' : ''}`}
        >
          Dificil
        </button>
        
        <button
          onClick={() => setTheme('ANIMAL')}
          className={`btn theme-btn btn-magenta ${theme === 'ANIMAL' ? 'active' : ''}`}
        >
          ANIMAL
        </button>
        <button
          onClick={() => setTheme('EMOJI')}
          className={`btn theme-btn btn-cyan ${theme === 'EMOJI' ? 'active' : ''}`}
        >
          EMOJI
        </button>
        <button
          onClick={() => setTheme('HEROI')}
          className={`btn theme-btn btn-yellow ${theme === 'HEROI' ? 'active' : ''}`}
        >
          HEROI
        </button>
      </div>
      
      <button onClick={handlePlay} className="btn play-btn btn-yellow">
        Jogar
      </button>

      <button onClick={onShowStats} className="btn stats-btn">
        Estatisticas
      </button>
    </div>
  );
}

export default GameMenu;
