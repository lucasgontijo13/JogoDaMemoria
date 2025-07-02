import React from 'react'; // O useState não é mais necessário aqui
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

  // 2. Todos os useStates foram REMOVIDOS daqui

  const handlePlay = () => {
    // 3. Apenas chama a função onStartGame, sem passar parâmetros
    onStartGame();
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Jogo da Memória</h1>
      <input
        type="text"
        className="name-input"
        placeholder="DIGITE SEU NOME"
        // 4. O input é controlado pelas props do App
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <div className="options-grid">
        {/* Dificuldade: usa as props 'difficulty' e 'setDifficulty' */}
        <button
          onClick={() => setDifficulty('Fácil')}
          className={`btn btn-magenta ${difficulty === 'Fácil' ? 'active' : ''}`}
        >
          Fácil
        </button>
        <button
          onClick={() => setDifficulty('Médio')}
          className={`btn btn-cyan ${difficulty === 'Médio' ? 'active' : ''}`}
        >
          Médio
        </button>
        <button
          onClick={() => setDifficulty('Difícil')}
          className={`btn btn-yellow ${difficulty === 'Difícil' ? 'active' : ''}`}
        >
          Difícil
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
          SUPERHEROI
        </button>
        
        <button onClick={handlePlay} className="btn play-btn btn-yellow">
          Jogar
        </button>
      </div>
    </div>
  );
}

export default GameMenu;