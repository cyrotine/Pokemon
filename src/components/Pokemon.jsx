import React, { useEffect, useState } from "react";
import "../styles/Pokemon.css";

const typeColors = {
  grass: "#78C850",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  bug: "#A8B820",
  normal: "#A8A878",
  poison: "#A040A0",
  ground: "#E0C068",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  ghost: "#705898",
  ice: "#98D8D8",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  flying: "#A890F0",
};

const Pokemon = ({ search, favorites, setFavorites }) => {
  const [allNames, setAllNames] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchAllNames = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
      const data = await res.json();
      setAllNames(data.results.map((p) => p.name));
    };
    fetchAllNames();
  }, []);

  const fetchPokemonData = async (names) => {
    setLoading(true);
    try {
      const data = await Promise.all(
        names.map(async (name) => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          return res.json();
        })
      );
      setPokemonList(data);
      setNotFound(data.length === 0);
    } catch (err) {
      console.error("Fetch error:", err);
      setPokemonList([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!search.trim()) {
        fetchPokemonData(allNames.slice(0, 50));
      } else {
        const matched = allNames.filter((name) =>
          name.startsWith(search.toLowerCase())
        );
        if (matched.length > 0) {
          fetchPokemonData(matched.slice(0, 20));
        } else {
          setPokemonList([]);
          setNotFound(true);
        }
      }
    };

    const debounce = setTimeout(fetchData, 300);
    return () => clearTimeout(debounce);
  }, [search, allNames]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleCardClick = (poke) => {
    setSelectedPokemon(poke);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
  };

  if (loading) return <div className="loading">Loading Pokémon...</div>;
  if (notFound) return <div className="loading">No Pokémon found.</div>;

  return (
    <>
      <div className={`pokemon-grid ${selectedPokemon ? "blurred" : ""}`}>
        {pokemonList.map((poke) => (
          <div
            key={poke.id}
            className={`pokemon-card ${favorites.includes(poke.id) ? "favorite" : ""}`}
            onClick={() => handleCardClick(poke)}
          >
            <img src={poke.sprites.front_default} alt={poke.name} />
            <h2>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h2>
            <div className="types">
              {poke.types.map((t) => (
                <span
                  key={t.type.name}
                  className="type"
                  style={{ backgroundColor: typeColors[t.type.name] || "#777" }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent modal open
                toggleFavorite(poke.id);
              }}
              className="fav-btn"
            >
              {favorites.includes(poke.id) ? "★" : "☆"} Favorite
            </button>
          </div>
        ))}
      </div>

      {selectedPokemon && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            <img src={selectedPokemon.sprites.other["official-artwork"].front_default} alt={selectedPokemon.name} />
            <h2>{selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}</h2>
            <p><strong>Height:</strong> {selectedPokemon.height}</p>
            <p><strong>Weight:</strong> {selectedPokemon.weight}</p>
            <p><strong>Base Experience:</strong> {selectedPokemon.base_experience}</p>
            <p><strong>Types:</strong> {selectedPokemon.types.map(t => t.type.name).join(", ")}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Pokemon;
