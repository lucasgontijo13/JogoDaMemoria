import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './GameBoard.css';

// A importação do GameInfoBar FOI REMOVIDA daqui

const THEME_IMAGES = {
  ANIMAL: Array.from({ length: 25 }, (_, i) => `/images/animal/animal (${i + 1}).png`),
  EMOJI: Array.from({ length: 25 }, (_, i) => `/images/emoji/emoji (${i + 1}).png`),
  SUPERHEROI: Array.from({ length: 25 }, (_, i) => `/images/superheroi/heroi (${i + 1}).png`),
};

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

// Este componente não precisa mais saber sobre pontos ou jogadas, apenas avisar o App
function GameBoard({ difficulty, theme, onBackToMenu, setMoveCount, setPoints }) {
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  const config = getGridConfig(difficulty);

  useEffect(() => {
    const imageArray = THEME_IMAGES[theme] || THEME_IMAGES.ANIMAL;
    const neededPairs = config.cardCount / 2;
    const imagesForGame = imageArray.slice(0, neededPairs);
    const cardImages = [...imagesForGame, ...imagesForGame];
    for (let i = cardImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardImages[i], cardImages[j]] = [cardImages[j], cardImages[i]];
    }
    const initialCards = cardImages.map((image, index) => ({ id: index, image, isFlipped: false, isMatched: false }));
    setCards(initialCards);
  }, [difficulty, theme, config.cardCount]);

  useEffect(() => {
    if (flippedIndexes.length !== 2) return;
    setMoveCount(prev => prev + 1);
    setIsChecking(true);
    const [firstIndex, secondIndex] = flippedIndexes;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];
    if (firstCard.image === secondCard.image) {
      setPoints(prev => prev + 1);
      setCards(prev => prev.map(card => card.image === firstCard.image ? { ...card, isMatched: true } : card));
      setFlippedIndexes([]);
      setIsChecking(false);
    } else {
      setTimeout(() => {
        setCards(prev => prev.map((card, index) => index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card));
        setFlippedIndexes([]);
        setIsChecking(false);
      }, 700);
    }
  }, [flippedIndexes, cards, setMoveCount, setPoints]);

  const handleCardClick = (index) => {
    const card = cards[index];
    if (isChecking || card.isFlipped || card.isMatched) return;
    setCards(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c));
    setFlippedIndexes(prev => [...prev, index]);
  };

  // ✨ O RETURN AGORA É APENAS O TABULEIRO, SEM A BARRA DE INFORMAÇÕES ✨
  return (
    <div className="game-board-container">
      <div className="game-board" style={{ gridTemplateColumns: `repeat(${config.columns}, 1fr)` }}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onCardClick={() => handleCardClick(index)}
          />
        ))}
      </div>
      <button className="btn-back" onClick={onBackToMenu}>Voltar ao Menu</button>
    </div>
  );
}

export default GameBoard;