import React from 'react';
import './Card.css';

function Card({ card, onCardClick }) {
  const handleClick = () => {
    onCardClick();
  };

  return (
    <div 
      className={`card-container ${card.isNewlyMatched ? 'newly-matched' : ''}`} 
      onClick={handleClick}
    >
      <div className={`card-inner ${card.isFlipped || card.isMatched ? 'is-flipped' : ''}`}>
        <div className="card-face card-back">
        </div>
        <div className="card-face card-front">
          <img src={card.image} alt="Conteúdo da Carta" />
        </div>

      </div>
    </div>
  );
}

export default Card;