import React, { useState, useEffect } from 'react';
import Card from '../Card/Card';
import './GameBoard.css';

// A importação do GameInfoBar FOI REMOVIDA daqui
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

function GameBoard({ difficulty, theme, onBackToMenu, setMoveCount, setPoints }) {
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  
  const config = getGridConfig(difficulty);

  // Efeito para criar o baralho e fazer a pré-visualização
  useEffect(() => {
    const imageArray = THEME_IMAGES[theme] || THEME_IMAGES.ANIMAL;
    const neededPairs = config.cardCount / 2;
    const imagesForGame = imageArray.slice(0, neededPairs);
    const cardImages = [...imagesForGame, ...imagesForGame];

    for (let i = cardImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardImages[i], cardImages[j]] = [cardImages[j], cardImages[i]];
    }

    // ✨ 1. CRIA AS CARTAS JÁ VIRADAS PARA CIMA ✨
    const initialCards = cardImages.map((image, index) => ({
      id: index,
      image: image,
      isFlipped: true, // Começam viradas
      isMatched: false,
    }));
    
    setCards(initialCards);

    // ✨ 2. BLOQUEIA OS CLIQUES DURANTE A PRÉ-VISUALIZAÇÃO ✨
    setIsChecking(true);

    // ✨ 3. AGENDA PARA ESCONDER AS CARTAS DEPOIS DE 0.5 SEGUNDOS ✨
    const hideTimeout = setTimeout(() => {
      setCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
      setIsChecking(false); // Libera os cliques
    }, 500); // 500ms = 0.5 segundos

    // Função de limpeza para evitar erros caso o jogador saia da tela durante o timeout
    return () => clearTimeout(hideTimeout);

  }, [difficulty, theme, config.cardCount]);

  // O useEffect de verificação de pares continua o mesmo
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
    if (isChecking || card.isFlipped || card.isMatched) {
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