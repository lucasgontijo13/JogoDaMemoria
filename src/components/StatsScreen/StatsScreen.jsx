import React, { useState, useEffect } from 'react';
import './StatsScreen.css';

// Função auxiliar para formatar o tempo
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

function StatsScreen({ onBackToMenu, lastGame, currentPlayerName }) {
  const [view, setView] = useState('personal'); 
  const [records, setRecords] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const allPlayersRecords = JSON.parse(localStorage.getItem('allPlayersRecords')) || {};

    if (view === 'personal') {
      const personalRecords = allPlayersRecords[currentPlayerName] || {};
      setRecords(Object.values(personalRecords));
    } else if (view === 'overall') {
      const overallRecords = {};
      for (const playerName in allPlayersRecords) {
        for (const gameModeKey in allPlayersRecords[playerName]) {
          const record = allPlayersRecords[playerName][gameModeKey];
          const existingOverall = overallRecords[gameModeKey];
          if (!existingOverall || record.moveCount < existingOverall.moveCount || (record.moveCount === existingOverall.moveCount && record.timer < existingOverall.timer)) {
            overallRecords[gameModeKey] = record;
          }
        }
      }
      setRecords(Object.values(overallRecords));
    }

    const savedHistory = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
    setHistory(savedHistory);
  }, [view, currentPlayerName]);

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja apagar TODOS os dados (histórico e recordes)?')) {
      localStorage.removeItem('memoryGameRecords');
      localStorage.removeItem('memoryGameHistory');
      setRecords([]);
      setHistory([]);
    }
  };

  if (view === 'history') {
    return (
      <div className="stats-container">
        <h1 className="stats-title">
          {view === 'personal' ? 'Meus Recordes' : 'Recordes Gerais'}
        </h1>
        <div className="stats-table-wrapper">
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
              {history.slice().reverse().map((game, index) => (
                <tr key={index}>
                  <td>{game.playerName}</td>
                  <td>{game.theme}</td>
                  <td>{game.difficulty}</td>
                  <td>{game.moveCount}</td>
                  <td>{formatTime(game.timer)}</td>
                  <td>{new Date(game.date).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="stats-buttons">
          <button className="btn btn-magenta" onClick={() => setView('summary')}>
            Voltar para Recordes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <h1 className="stats-title">Resumo e Recordes</h1>

      {lastGame && (
        <div className="summary-section">
          <h2 className="section-title">Última Partida</h2>
          {/* AQUI ESTÁ A MUDANÇA: Usamos uma tabela para o resumo */}
          <div className="stats-table-wrapper summary-table-wrapper">
            <table className="stats-table summary-table">
              <tbody>
                <tr>
                  <td>Jogador:</td>
                  <td>{lastGame.playerName}</td>
                </tr>
                <tr>
                  <td>Tema:</td>
                  <td>{lastGame.theme}</td>
                </tr>
                <tr>
                  <td>Dificuldade:</td>
                  <td>{lastGame.difficulty}</td>
                </tr>
                <tr>
                  <td>Jogadas:</td>
                  <td>{lastGame.moveCount}</td>
                </tr>
                <tr>
                  <td>Tempo:</td>
                  <td>{formatTime(lastGame.timer)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="records-section">
        {/* O título da seção muda dinamicamente agora */}
        <h2 className="section-title">
          {view === 'personal' ? 'Meus Recordes' : 'Recordes Gerais'}
        </h2>

        {records.length > 0 ? (
          <div className="stats-table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  {/* ADICIONADO O CABEÇALHO QUE FALTAVA */}
                  <th>Jogador</th>
                  <th>Tema</th>
                  <th>Dificuldade</th>
                  <th>Jogadas</th>
                  <th>Tempo</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={index}>
                    {/* DADOS AGORA NA ORDEM CORRETA */}
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
          <p className="no-stats-message">Nenhum recorde registrado para esta visualização.</p>
        )}
      </div>

      <div className="stats-buttons">
        <button className="btn btn-magenta" onClick={onBackToMenu}>
          Voltar ao Menu
        </button>
        {view === 'personal' ? (
          <button className="btn btn-cyan" onClick={() => setView('overall')}>Ver Recordes Gerais</button>
        ) : (
          <button className="btn btn-cyan" onClick={() => setView('personal')}>Ver Meus Recordes</button>
        )}
        {history.length > 0 && (
           <button className="btn btn-cyan" onClick={() => setView('history')}>
             Ver Histórico
           </button>
        )}
        {(history.length > 0 || records.length > 0) && (
          <button className="btn btn-yellow" onClick={handleClearData}>
            Limpar Dados
          </button>
        )}
      </div>
    </div>
  );
}

export default StatsScreen;
