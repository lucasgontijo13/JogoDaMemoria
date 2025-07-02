import React from 'react';
import './Card.css';

function Card({ card, onCardClick }) {
  // A função de clique é passada diretamente ao container.
  // A lógica de "pode clicar?" fica no GameBoard.
  const handleClick = () => {
    onCardClick();
  };

  return (
    <div className="card-container" onClick={handleClick}>
      <div className={`card-inner ${card.isFlipped || card.isMatched ? 'is-flipped' : ''}`}>
        
        {/* VERSO DA CARTA: O design que você gosta */}
        <div className="card-face card-back">
          {/* Este lado é estilizado 100% via CSS */}
        </div>
        
        {/* FRENTE DA CARTA: Onde a imagem do pet aparece */}
        <div className="card-face card-front">
          <img src={card.image} alt="Conteúdo da Carta" />
        </div>

      </div>
    </div>
  );
}

export default Card;