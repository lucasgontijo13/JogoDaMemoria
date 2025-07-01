import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './GameBoard.css';

const PET_SYMBOLS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊'];

const getGridConfig = (difficulty) => {
    switch (difficulty) {
      case 'Fácil':
        return { cardCount: 24, columns: 8 };
      case 'Médio':
        return { cardCount: 36, columns: 9 };
      case 'Difícil':
        return { cardCount: 50, columns: 10 };
      default:
        return { cardCount: 24, columns: 8 };
    }
};

function GameBoard({ difficulty, onBackToMenu }) {
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  
  const config = getGridConfig(difficulty);

  useEffect(() => {
    const neededSymbols = config.cardCount / 2;
    const symbolsForGame = PET_SYMBOLS.slice(0, neededSymbols);
    const cardPairs = [...symbolsForGame, ...symbolsForGame];

    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }

    const initialCards = cardPairs.map((symbol, index) => ({
      id: index,
      symbol: symbol,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(initialCards);
    setFlippedIndexes([]); // Reseta as cartas viradas ao criar um novo jogo
  }, [difficulty, config.cardCount]);

  useEffect(() => {
    if (flippedIndexes.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedIndexes;
      
      if (cards[firstIndex].symbol === cards[secondIndex].symbol) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.symbol === cards[firstIndex].symbol ? { ...card, isMatched: true, isFlipped: true } : card
          )
        );
        setFlippedIndexes([]);
        setIsChecking(false);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedIndexes([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedIndexes, cards]);

  const handleCardClick = (index) => {
    if (isChecking || flippedIndexes.includes(index) || cards[index].isMatched) {
      return;
    }
    
    setCards(prevCards =>
      prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedIndexes([...flippedIndexes, index]);
  };

  return (
    <div className="game-board-container">
      <h1 className="board-title">{difficulty.toUpperCase()}</h1>
      <div className="game-board" style={{ gridTemplateColumns: `repeat(${config.columns}, 1fr)` }}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
      <button className="btn-back" onClick={onBackToMenu}>Voltar ao Menu</button>
    </div>
  );
}

export default GameBoard;