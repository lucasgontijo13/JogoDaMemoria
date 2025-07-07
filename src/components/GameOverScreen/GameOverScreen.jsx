import React from 'react';
import './GameOverScreen.css';

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function GameOverScreen({
    playerName,
    points,
    timer,
    moveCount,
    onBackToMenu,
    onShowStats,
    personalBest
}) {
    return (
        <div className="game-over-container">
            <h1 className="game-over-title">FIM DE JOGO!</h1>
            <p className="player-name-congrats">
                Parabéns, <span className="highlight">{playerName}</span>!
            </p>

           <div className="stats-summary">
                <div className="stat-item">
                    <span className="stat-label">PONTOS</span>
                    <span className="stat-value highlight">{points}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">TEMPO</span>
                    <span className="stat-value highlight">{formatTime(timer)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">JOGADAS</span>
                    <span className="stat-value highlight">{moveCount}</span>
                </div>
            </div>
            {personalBest &&(
                <div className="personal-best-section">
                    <p>Seu recorde pessoal neste modo:</p>
                    <p>
                        <span className="highlight">{personalBest.moveCount}</span> Jogadas em <span className="highlight">{formatTime(personalBest.timer)}</span>
                    </p>
                </div>
            )}

            <div className="game-over-buttons">
                <button className="btn btn-magenta" onClick={onBackToMenu}>
                    Menu inicial
                </button>
                <button className="btn btn-cyan" onClick={onShowStats}>
                    Estatisticas
                </button>
            </div>
        </div>
    );
}

export default GameOverScreen;