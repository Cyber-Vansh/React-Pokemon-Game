import React, { useState, useEffect } from "react";
import "./App.css";

const fetchPokemonImages = async (count = 14) => {
  const pokemonImages = [];
  const usedIds = new Set();
  while (pokemonImages.length < count) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    if (!usedIds.has(randomId)) {
      usedIds.add(randomId);
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();
        pokemonImages.push(data.sprites.other["official-artwork"].front_default);
      } catch (error) {
        console.error("Failed to fetch Pokémon image", error);
      }
    }
  }
  return [...pokemonImages, ...pokemonImages];
};

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const CardMatchingGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chances, setChances] = useState(50);
  const [gameOver, setGameOver] = useState(false);

  const loadPokemonImages = async () => {
    setLoading(true);
    setGameOver(false);
    const images = await fetchPokemonImages();
    setCards(shuffleArray(images));
    setLoading(false);
  };

  useEffect(() => {
    loadPokemonImages();
  }, []);

  useEffect(() => {
    if (chances === 0 && matched.length < cards.length) {
      setGameOver(true);
    }
  }, [chances, matched, cards]);

  const handleCardClick = (index) => {
    if (flipped.length < 2 && !flipped.includes(index) && !matched.includes(index) && chances > 0) {
      const newFlipped = [...flipped, index];
      setFlipped(newFlipped);
      setChances(chances - 1);
      
      if (newFlipped.length === 2) {
        const [firstIndex, secondIndex] = newFlipped;
        if (cards[firstIndex] === cards[secondIndex]) {
          setMatched((prevMatched) => [...prevMatched, firstIndex, secondIndex]);
          setScore((prevScore) => prevScore + 1);
        }
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const resetGame = () => {
    setCards([]);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setChances(50);
    setGameOver(false);
    loadPokemonImages();
  };

  return (
  <div className="game-container">
    {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    ) : (
      <>
        <button className="reset-button" onClick={resetGame} disabled={gameOver}>Restart</button>
        <div className="stats-container">
          <p className="score">Score: {score}</p>
          <p className="chances">Chances Left: {chances}</p>
        </div>

        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-popup">
              <p className="game-over-text">Game Over! You ran out of chances!</p>
              <button className="popup-reset-button" onClick={resetGame}>↻ Play Again</button>
            </div>
          </div>
        )}

        <div className="card-grid">
          {cards.map((image, index) => (
            <div
              key={index}
              className={`card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''}`}
              onClick={() => handleCardClick(index)}
            >
              {flipped.includes(index) || matched.includes(index) ? (
                <img src={image} alt="card" className="card-image" />
              ) : (
                <div className="card-back">
                  <img src="https://wallpapers.com/images/hd/pokeball-800-x-1421-background-qjqsrjp65gnz08bq.jpg"/>
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
)}

export default CardMatchingGame;
