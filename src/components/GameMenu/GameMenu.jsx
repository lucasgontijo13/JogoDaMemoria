import React from 'react';
import './GameMenu.css';

// 1. Recebe todos os valores e funções como props
function GameMenu({ 
  playerName, 
  setPlayerName, 
  difficulty, 
  setDifficulty, 
  theme, 
  setTheme, 
  onStartGame 
}) {

  const handlePlay = () => {
    onStartGame();
  };

  // Função placeholder para o novo botão
  const handleStatsClick = () => {
    alert('A tela de estatísticas será implementada em breve!');
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
      <div className="options-grid">
        {/* Dificuldade: usa as props 'difficulty' e 'setDifficulty' */}
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
        
        {/* Temas: usa as props 'theme' e 'setTheme' */}
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
          onClick={() => setTheme('SUPERHEROI')}
          className={`btn theme-btn btn-yellow ${theme === 'SUPERHEROI' ? 'active' : ''}`}
        >
          HEROI
        </button>
        
        <button onClick={handlePlay} className="btn play-btn btn-yellow">
          Jogar
        </button>

        {/* ✨ BOTÃO DE ESTATÍSTICAS ADICIONADO AQUI ✨ */}
        <button onClick={handleStatsClick} className="btn play-btn btn-cyan">
          Estatísticas
        </button>
      </div>
    </div>
  );
}

export default GameMenu;