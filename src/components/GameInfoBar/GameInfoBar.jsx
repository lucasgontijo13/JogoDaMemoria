import React from 'react';
import './GameInfoBar.css';

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// 1. Recebe as novas props
function GameInfoBar({ 
  playerName, 
  moveCount, 
  timer, 
  points, 
  gameMode, 
  difficulty, 
  challengeConfig 
}) {
  const isChallenge = gameMode === 'challenge';
  
  // 2. Determina o limite de jogadas se estiver no modo desafio
  const moveLimit = isChallenge ? challengeConfig[difficulty].moveLimit : null;

  // 3. Adiciona uma classe CSS quando o tempo ou as jogadas estiverem baixos
  const timerClass = isChallenge && timer <= 10 ? 'low-time' : '';
  const movesClass = isChallenge && moveCount <= 5 ? 'low-moves' : '';

  return (
    <div className="game-info-bar">
      <div className="player-name">
        <span className="info-label">JOGADOR: </span>
        <span className="info-value">{playerName || 'ANONIMO'}</span>
      </div>
      <div className="game-stats">
        <div className="stats-item">
          <span className="info-label">PONTOS: </span>
          <span className="info-value">{points}</span>
        </div>
        <div className={`stats-item ${movesClass}`}>
          <span className="info-label">JOGADAS: </span>
          <span className="info-value">
     
            {isChallenge ? `${moveCount}/${moveLimit}` : moveCount}
          </span>
        </div>
        <div className={`stats-item ${timerClass}`}>
          <span className="info-label">TEMPO: </span>
          <span className="info-value">{formatTime(timer)}</span>
        </div>
      </div>
    </div>
  );
}

export default GameInfoBar;