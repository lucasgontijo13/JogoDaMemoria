import React, { useState, useEffect } from 'react';
import './StatsScreen.css';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};


const RecordsDisplay = ({ title, records, onBack, tableClassName }) => (
    <div className="stats-container">
        <h1 className="stats-title">{title}</h1>
        {records.length > 0 ? (
            <div className={`stats-table-wrapper ${tableClassName || 'records-table'}`}>
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>Jogador</th>
                            <th>Tema</th>
                            <th>Dificuldade</th>
                            <th>Desafio</th>
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
                                <td>
                                    <div className={`challenge-indicator ${record.gameMode === 'challenge' ? 'active' : ''}`}></div>
                                </td>
                                <td>{record.moveCount}</td>
                                <td>{formatTime(record.timer)}</td>
                                <td>{new Date(record.date).toLocaleDateString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <p className="no-stats-message">Nenhum recorde registrado para este modo.</p>
        )}
        <div className="stats-buttons">
            <button className="btn btn-cyan" onClick={onBack}>
                Voltar
            </button>
        </div>
    </div>
);


function StatsScreen({ onBackToMenu, lastGame, onClearData }) {
  const [classicRecords, setClassicRecords] = useState([]);
  const [challengeRecords, setChallengeRecords] = useState([]);
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('summary');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const classic = Object.values(JSON.parse(localStorage.getItem('memoryGameRecords')) || {});
    setClassicRecords(classic);

    const challenge = Object.values(JSON.parse(localStorage.getItem('memoryGameChallengeRecords')) || {});
    setChallengeRecords(challenge);

    const savedHistory = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleClearDataClick = () => {
    setIsModalOpen(true);
  };

  const confirmClearData = () => {
    onClearData();
    setClassicRecords([]);
    setChallengeRecords([]);
    setHistory([]);
    setIsModalOpen(false);
  };

  const hasData = classicRecords.length > 0 || challengeRecords.length > 0 || history.length > 0;

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

  if (view === 'classic_records') {
    return <RecordsDisplay title="Recordes Gerais" records={classicRecords} onBack={() => setView('summary')} />;
  }
  
 
  if (view === 'challenge_records') {
    return <RecordsDisplay title="Recordes Desafio" records={challengeRecords} onBack={() => setView('summary')} tableClassName="challenge-records-table" />;
  }

  if (view === 'history') {
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
                <th>Desafio</th>
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
                  <td>
                    <div className={`challenge-indicator ${game.gameMode === 'challenge' ? 'active' : ''}`}></div>
                  </td>
                  <td>{game.moveCount}</td>
                  <td>{formatTime(game.timer)}</td>
                  <td>{game.status === 'win' ? 'Vitória' : 'Derrota'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="stats-buttons">
          <button className="btn btn-cyan" onClick={() => setView('summary')}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmClearData}
        message="Tem certeza que deseja apagar TODOS os dados (histórico e recordes)?"
      />
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
                  <tr><td>Desafio:</td><td><div className={`challenge-indicator ${lastGame.gameMode === 'challenge' ? 'active' : ''}`}></div></td></tr>
                  <tr><td>Jogadas:</td><td>{lastGame.moveCount}</td></tr>
                  <tr><td>Tempo:</td><td>{formatTime(lastGame.timer)}</td></tr>
                  <tr><td>Resultado:</td><td>{lastGame.status === 'win' ? 'Vitória' : 'Derrota'}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="records-section">
          <h2 className="section-title">Recordes Gerais</h2>
          {classicRecords.length > 0 ? (
            <div className="stats-table-wrapper records-table">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Jogador</th>
                    <th>Tema</th>
                    <th>Dificuldade</th>
                    <th>Desafio</th>
                    <th>Jogadas</th>
                    <th>Tempo</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {classicRecords.sort((a, b) => a.theme.localeCompare(b.theme) || a.difficulty.localeCompare(b.difficulty)).map((record, index) => (
                    <tr key={index}>
                      <td>{record.playerName}</td>
                      <td>{record.theme}</td>
                      <td>{record.difficulty}</td>
                      <td>
                        <div className={`challenge-indicator ${record.gameMode === 'challenge' ? 'active' : ''}`}></div>
                      </td>
                      <td>{record.moveCount}</td>
                      <td>{formatTime(record.timer)}</td>
                      <td>{new Date(record.date).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-stats-message">Nenhum recorde no modo geral.</p>
          )}
        </div>
        <div className="stats-buttons">
          <button className="btn btn-magenta" onClick={onBackToMenu}>
            Voltar ao Menu
          </button>
          <button className="btn btn-cyan" onClick={() => setView('history')}>
            Ver Histórico
          </button>
          <button className="btn btn-green" onClick={() => setView('challenge_records')}>
            Recordes Desafio
          </button>
          {hasData && (
            <button className="btn btn-yellow" onClick={handleClearDataClick}>
              Limpar Dados
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default StatsScreen;