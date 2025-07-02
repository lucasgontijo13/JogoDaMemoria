import React from 'react';
import './GameInfoBar.css';

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Recebe a nova prop 'points'
function GameInfoBar({ playerName, moveCount, timer, points }) {
  return (
    <div className="game-info-bar">
      <div className="player-name">
        {/* Separamos o título do dado em spans com classes diferentes */}
        <span className="info-label">JOGADOR: </span>
        <span className="info-value">{playerName || 'ANONIMO'}</span>
      </div>
      <div className="game-stats">
        {/* Novo item para os pontos */}
        <div className="stats-item">
          <span className="info-label">PONTOS: </span>
          <span className="info-value">{points}</span>
        </div>
        <div className="stats-item">
          <span className="info-label">JOGADAS: </span>
          <span className="info-value">{moveCount}</span>
        </div>
        <div className="stats-item">
          <span className="info-label">TEMPO: </span>
          <span className="info-value">{formatTime(timer)}</span>
        </div>
      </div>
    </div>
  );
}

export default GameInfoBar;