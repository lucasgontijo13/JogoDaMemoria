import React, { useState } from 'react';
import './GameMenu.css';

/**
 * Componente do Menu Principal do Jogo.
 * @param {object} props - Propriedades do componente.
 * @param {function} props.onStartGame - Função a ser chamada quando o jogo deve começar.
 */
function GameMenu({ onStartGame }) {
  // Estado para armazenar a dificuldade selecionada. Padrão: 'Fácil'
  const [difficulty, setDifficulty] = useState('Fácil');
  
  // Estado para armazenar o tema selecionado. Padrão: 'PETS'
  const [theme, setTheme] = useState('PETS');

  // Função chamada quando o botão "Jogar" é clicado
  const handlePlay = () => {
    // Chama a função passada pelo componente pai (App.jsx)
    // com os valores atuais de dificuldade e tema.
    onStartGame(difficulty, theme);
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Jogo da Memória</h1>

      {/* Este input não está sendo usado na lógica ainda, mas faz parte do layout */}
      <input type="text" className="name-input" placeholder="DIGITE SEU NOME" />

      <div className="options-grid">
        {/* === SELEÇÃO DE DIFICULDADE === */}
        <button
          onClick={() => setDifficulty('Fácil')}
          // A classe 'active' é adicionada se a dificuldade atual for 'Fácil'
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
        
        {/* === SELEÇÃO DE TEMAS === */}
        <button
          onClick={() => setTheme('PETS')}
          // A classe 'active' é adicionada se o tema atual for 'PETS'
          className={`btn theme-btn btn-magenta ${theme === 'PETS' ? 'active' : ''}`}
        >
          PETS
        </button>

        <button
          onClick={() => setTheme('ALIENS')}
          className={`btn theme-btn btn-cyan ${theme === 'ALIENS' ? 'active' : ''}`}
        >
          ALIENS
        </button>

        <button
          onClick={() => setTheme('DEVS')}
          className={`btn theme-btn btn-yellow ${theme === 'DEVS' ? 'active' : ''}`}
        >
          DEVS
        </button>
        
        {/* === BOTÃO DE INICIAR O JOGO === */}
        <button onClick={handlePlay} className="btn play-btn btn-yellow">
          Jogar
        </button>
      </div>
    </div>
  );
}

export default GameMenu;