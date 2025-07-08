import React, { useState, useEffect } from 'react';
import './StatsScreen.css';

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function StatsScreen({ onBackToMenu, lastGame, onClearData }) {
  const [records, setRecords] = useState([]);
  const [history, setHistory] = useState([]);
  const [isViewingHistory, setIsViewingHistory] = useState(false);

  useEffect(() => {
    const globalRecords = JSON.parse(localStorage.getItem('memoryGameRecords')) || {};
    setRecords(Object.values(globalRecords));

    const savedHistory = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja apagar TODOS os dados salvos no navegador (histórico e recordes)?')) {
      onClearData();
      setRecords([]);
      setHistory([]);
    }
  };

  const hasData = records.length > 0 || history.length > 0;

  if (!hasData) {
    return (
      <div className="stats-container">
        <h1 className="stats-title">Estatísticas</h1>
        <p className="no-stats-message">Jogue pelo menos uma partida para ver suas estatísticas!</p>
        <div className="stats-buttons">
          <button className="btn btn-magenta" onClick={onBackToMenu}>
            Voltar ao Menu
          </button>
        </div>
      </div>
    );
  }

  if (isViewingHistory) {
    return (
      <div className="stats-container">
        <h1 className="stats-title">Histórico de Partidas</h1>
        <div className="stats-table-wrapper history-table">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Jogador</th>
                <th>Tema</th>
                <th>Dificuldade</th>
                <th>Jogadas</th>
                <th>Tempo</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              {history.slice().reverse().map((game, index) => (
                <tr key={index}>
                  <td>{game.playerName}</td>
                  <td>{game.theme}</td>
                  <td>{game.difficulty}</td>
                  <td>{game.moveCount}</td>
                  <td>{formatTime(game.timer)}</td>
                  <td>{game.status === 'win' ? 'Vitória' : 'Derrota'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="stats-buttons">
          <button className="btn btn-cyan" onClick={() => setIsViewingHistory(false)}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <h1 className="stats-title">Estatísticas</h1>

      {lastGame && (
        <div className="summary-section">
          <h2 className="section-title">Última Partida</h2>
          <div className="stats-table-wrapper summary-table-wrapper">
            <table className="stats-table summary-table">
              <tbody>
                <tr><td>Jogador:</td><td>{lastGame.playerName}</td></tr>
                <tr><td>Tema:</td><td>{lastGame.theme}</td></tr>
                <tr><td>Dificuldade:</td><td>{lastGame.difficulty}</td></tr>
                <tr><td>Jogadas:</td><td>{lastGame.moveCount}</td></tr>
                <tr><td>Tempo:</td><td>{formatTime(lastGame.timer)}</td></tr>
                <tr><td>Resultado:</td><td>{lastGame.status === 'win' ? 'Vitória' : 'Derrota'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="records-section">
        <h2 className="section-title">Recordes Globais</h2>
        {records.length > 0 ? (
          <div className="stats-table-wrapper records-table">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Jogador</th>
                  <th>Tema</th>
                  <th>Dificuldade</th>
                  <th>Jogadas</th>
                  <th>Tempo</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {records.sort((a, b) => a.theme.localeCompare(b.theme) || a.difficulty.localeCompare(b.difficulty)).map((record, index) => (
                  <tr key={index}>
                    <td>{record.playerName}</td>
                    <td>{record.theme}</td>
                    <td>{record.difficulty}</td>
                    <td>{record.moveCount}</td>
                    <td>{formatTime(record.timer)}</td>
                    <td>{new Date(record.date).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-stats-message">Nenhum recorde registrado.</p>
        )}
      </div>

      <div className="stats-buttons">
        <button className="btn btn-magenta" onClick={onBackToMenu}>
          Voltar ao Menu
        </button>
        {history.length > 0 && (
          <button className="btn btn-cyan" onClick={() => setIsViewingHistory(true)}>
            Ver Histórico
          </button>
        )}
        {hasData && (
          <button className="btn btn-yellow" onClick={handleClearData}>
            Limpar Dados
          </button>
        )}
      </div>
    </div>
  );
}

export default StatsScreen;