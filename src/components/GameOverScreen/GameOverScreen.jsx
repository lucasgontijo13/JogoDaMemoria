import React from 'react';
import './GameOverScreen.css';

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function GameOverScreen({
    gameResult,
    onBackToMenu,
    onShowStats,
    onRestart, // Recebe a nova prop
    personalBest,
}) {
    if (!gameResult) return null;

    const { playerName, points, timer, moveCount, status } = gameResult;
    const isWin = status === 'win';

    const showPreviousBest = isWin && personalBest && personalBest.date !== gameResult.date;

    return (
        <div className={`game-over-container ${!isWin ? 'loss-style' : ''}`}>
            <h1 className="game-over-title">{isWin ? "FIM DE JOGO!" : "GAME OVER"}</h1>
            <p className="player-name-congrats">
                {isWin ? (
                    <>Parabéns, <span className="highlight">{playerName}</span>!</>
                ) : (
                    <>Não foi desta vez, <span className="highlight">{playerName}</span>!</>
                )}
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

            {showPreviousBest && (
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
                {/* Novo botão para jogar novamente */}
                <button className="btn btn-green" onClick={onRestart}>
                    Jogar Novamente
                </button>
                <button className="btn btn-cyan" onClick={onShowStats}>
                    Estatisticas
                </button>
            </div>
        </div>
    );
}

export default GameOverScreen;