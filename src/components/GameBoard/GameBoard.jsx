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

function GameBoard({ difficulty, theme, onBackToMenu, setMoveCount, setPoints, onGameOver }) {
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isInitialReveal, setIsInitialReveal] = useState(true); // Novo estado para controlar a exibição inicial

  const config = getGridConfig(difficulty);

  // Efeito para criar e exibir as cartas no início
  useEffect(() => {
    const imageArray = THEME_IMAGES[theme] || THEME_IMAGES.ANIMAL;
    const neededPairs = config.cardCount / 2;
    const imagesForGame = imageArray.slice(0, neededPairs);
    const cardImages = [...imagesForGame, ...imagesForGame];
    for (let i = cardImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardImages[i], cardImages[j]] = [cardImages[j], cardImages[i]];
    }
    
    // ✨ MUDANÇA: Inicia todas as cartas como viradas (isFlipped: true)
    const initialCards = cardImages.map((image, index) => ({ id: index, image, isFlipped: true, isMatched: false }));
    setCards(initialCards);
    setIsInitialReveal(true);

    // ✨ MUDANÇA: Temporizador para desvirar as cartas após 0.5 segundos
    const revealTimeout = setTimeout(() => {
      setCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
      setIsInitialReveal(false); // Termina a exibição inicial
    }, 500); // 500ms = 0,5 segundos

    // Limpa o temporizador se o componente for desmontado
    return () => clearTimeout(revealTimeout);
  }, [difficulty, theme, config.cardCount]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setTimeout(() => {
        onGameOver();
      }, 1200);
      return;
    }

    if (flippedIndexes.length === 2 && !isChecking) {
      setMoveCount(prev => prev + 1);
      setIsChecking(true);
      
      const [firstIndex, secondIndex] = flippedIndexes;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.image === secondCard.image) {
        setPoints(prev => prev + 1);
        setCards(prev => prev.map(card => 
          card.image === firstCard.image 
          ? { ...card, isMatched: true, isNewlyMatched: true } 
          : card
        ));
        
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
    }
  }, [flippedIndexes, cards, isChecking, setMoveCount, setPoints, onGameOver]);

  const handleCardClick = (index) => {
    // ✨ MUDANÇA: Impede o clique durante a exibição inicial
    if (isInitialReveal || isChecking || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }
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