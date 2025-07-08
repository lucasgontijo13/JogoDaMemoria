import React from 'react';
 import './GameOverScreen.css';

 const formatTime = (totalSeconds) => {
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;
   return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
 };

 function GameOverScreen({
   gameStatus,
   playerName,
   points,
   timer,
   moveCount,
   onBackToMenu,
   onShowStats,
   personalBest,
   gameMode,
   challengeInitialConfig
 }) {
   const isWin = gameStatus === 'win';
   const isChallengeWin = isWin && gameMode === 'challenge';

   const timeLabel = isChallengeWin ? "TEMPO RESTANTE" : "TEMPO";
   const timeValue = isChallengeWin ? formatTime(timer) : formatTime(challengeInitialConfig ? challengeInitialConfig.timeLimit - timer : timer);

   const movesLabel = isChallengeWin ? "JOGADAS RESTANTES" : "JOGADAS";
   const movesValue = isChallengeWin ? moveCount : (gameMode === 'challenge' ? challengeInitialConfig.moveLimit - moveCount : moveCount);

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
           <span className="stat-label">{timeLabel}</span>
           <span className="stat-value highlight">{timeValue}</span>
         </div>
         <div className="stat-item">
           <span className="stat-label">{movesLabel}</span>
           <span className="stat-value highlight">{movesValue}</span>
         </div>
       </div>

       {isWin && personalBest && (
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