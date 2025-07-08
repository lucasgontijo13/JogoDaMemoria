import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './GameBoard.css';

const BASE_URL = import.meta.env.BASE_URL;
const THEME_IMAGES = {
  ANIMAL: Array.from({ length: 25 }, (_, i) => `${BASE_URL}/images/animal/animal (${i + 1}).png`),
  EMOJI: Array.from({ length: 25 }, (_, i) => `${BASE_URL}/images/emoji/emoji (${i + 1}).png`),
  SUPERHEROI: Array.from({ length: 25 }, (_, i) => `${BASE_URL}/images/superheroi/heroi (${i + 1}).png`),
};

const getGridConfig = (difficulty) => {
    switch (difficulty) {
      case 'Facil':
        return { cardCount: 24, columns: 8 };
      case 'Medio':
        return { cardCount: 36, columns: 9 };
      case 'Dificil':
        return { cardCount: 50, columns: 10 };
      default:
        return { cardCount: 24, columns: 8 };
    }
};

function GameBoard({ difficulty, theme, onBackToMenu, moveCount, setMoveCount, setPoints, onGameOver, gameMode}) {
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isGameOverSent, setIsGameOverSent] = useState(false);

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
    const initialCards = cardImages.map((image, index) => ({ id: index, image, isFlipped: true, isMatched: false }));
    setCards(initialCards);
    setIsGameOverSent(false);
    setIsChecking(true);
    const timer = setTimeout(() => {
      setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [difficulty, theme, config.cardCount]);

  useEffect(() => {
    if (isGameOverSent || flippedIndexes.length < 2) return;

    if (!isChecking) {
      const currentMoveCount = gameMode === 'challenge' ? moveCount - 1 : moveCount + 1;
      setMoveCount(currentMoveCount);
      setIsChecking(true);

      const [firstIndex, secondIndex] = flippedIndexes;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.image === secondCard.image) {
        setPoints(prev => prev + 1);
        const newCards = cards.map(card =>
          card.image === firstCard.image
          ? { ...card, isMatched: true, isNewlyMatched: true }
          : card
        );
        setCards(newCards);

        // Checar vitória após o acerto
        const allMatched = newCards.every(card => card.isMatched);
        if (allMatched) {
            setIsGameOverSent(true);
            setTimeout(() => onGameOver('win'), 1200);
            return; // Encerra o useEffect aqui
        }

        setTimeout(() => {
          setCards(prev => prev.map(card =>
            card.isNewlyMatched ? { ...card, isNewlyMatched: false } : card
          ));
        }, 1000);

        setFlippedIndexes([]);
        setIsChecking(false);

      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card, index) =>
            (index === firstIndex || index === secondIndex)
            ? { ...card, isFlipped: false }
            : card
          ));
          setFlippedIndexes([]);
          setIsChecking(false);
        }, 500);
      }
      
      // Checar derrota por falta de jogadas (após o movimento)
      if (gameMode === 'challenge' && currentMoveCount <= 0 && !cards.every(c => c.isMatched)) {
          setIsGameOverSent(true);
          setTimeout(() => onGameOver('lose'), 500);
      }
    }
  }, [flippedIndexes, cards, isChecking, setMoveCount, setPoints, onGameOver, isGameOverSent, gameMode, moveCount]);

  const handleCardClick = (index) => {
    const card = cards[index];
    if (isChecking || card.isFlipped || card.isMatched || flippedIndexes.length >= 2) return;
    setCards(prev => prev.map((c, i) => i === index ? { ...c, isFlipped: true } : c));
    setFlippedIndexes(prev => [...prev, index]);
  };

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