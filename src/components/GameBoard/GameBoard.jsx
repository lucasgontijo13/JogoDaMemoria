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

// Este componente não precisa mais saber sobre pontos ou jogadas, apenas avisar o App
function GameBoard({ difficulty, theme, onBackToMenu, setMoveCount, setPoints, onGameOver, gameMode}) {
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
    // Cria as cartas já viradas para a exibição inicial
    const initialCards = cardImages.map((image, index) => ({ id: index, image, isFlipped: true, isMatched: false }));
    setCards(initialCards);
    setIsGameOverSent(false);
    // Bloqueia o tabuleiro para cliques
    setIsChecking(true);
    // Define um temporizador para virar as cartas de volta após 0,5 segundos
    const timer = setTimeout(() => {
      setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
      // Libera o tabuleiro para o jogador começar
      setIsChecking(false);
    }, 500);

    // Limpa o temporizador se o componente for desmontado
    return () => clearTimeout(timer);
  }, [difficulty, theme, config.cardCount]);

  useEffect(() => {
    // A condição de vitória permanece a mesma
    if (!isGameOverSent && cards.length > 0 && cards.every(card => card.isMatched)) {
      // 4. Imediatamente levantamos a bandeira para que este bloco não execute mais.
      setIsGameOverSent(true);
      setTimeout(() => {
        onGameOver();
      }, 1200);
      return; // Paramos a execução do useEffect aqui.
    }

    if (flippedIndexes.length === 2 && !isChecking) {
      
      if (gameMode === 'challenge') {
        setMoveCount(prev => prev - 1); // Diminui no desafio
      } else {
        setMoveCount(prev => prev + 1); // Aumenta no clássico
      }
      
      setIsChecking(true);
      
      const [firstIndex, secondIndex] = flippedIndexes;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.image === secondCard.image) {
        // Lógica de acerto
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
        // 3. Destrava para a próxima jogada
        setIsChecking(false);

      } else {
        // Lógica de erro
        setTimeout(() => {
          setCards(prev => prev.map((card, index) => 
            (index === firstIndex || index === secondIndex) 
            ? { ...card, isFlipped: false } 
            : card
          ));
          setFlippedIndexes([]);
          // 4. Destrava para a próxima jogada
          setIsChecking(false);
        }, 500);
      }
    }
    // Adicionamos 'isChecking' às dependências para que o hook reaja à trava
  }, [flippedIndexes, cards, isChecking, setMoveCount, setPoints, onGameOver, isGameOverSent]);
  const handleCardClick = (index) => {
    const card = cards[index];
    if (isChecking || card.isFlipped || card.isMatched) return;
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