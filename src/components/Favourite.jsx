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

const Favourite = ({ favorites, setFavorites }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchFavPokemon = async () => {
      setLoading(true);
      try {
        const data = await Promise.all(
          favorites.map(async (id) => {
            try {
              const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
              if (!res.ok) throw new Error(`Failed to fetch Pokémon ${id}`);
              return await res.json();
            } catch (err) {
              console.error(`Error fetching Pokémon ${id}:`, err);
              return null;
            }
          })
        );
        setPokemonList(data.filter((poke) => poke !== null));
      } catch (err) {
        console.error("Error fetching favourite Pokémon:", err);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchFavPokemon();
    } else {
      setPokemonList([]);
    }
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f !== id));
  };

  if (loading) return <div className="loading">Loading Favourites...</div>;
  if (!loading && favorites.length === 0)
    return <div className="loading">No favourite Pokémon added.</div>;

  return (
    <>
      <div className="pokemon-grid">
        {pokemonList.map((poke) => (
          <div
            key={poke.id}
            className="pokemon-card favorite"
            onClick={() => setSelectedPokemon(poke)}
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
                e.stopPropagation();
                toggleFavorite(poke.id);
              }}
              className="fav-btn"
            >
              ★ Remove Favourite
            </button>
          </div>
        ))}
      </div>

      {selectedPokemon && (
        <div className="modal-overlay" onClick={() => setSelectedPokemon(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPokemon(null)}>
              &times;
            </button>
            <img
              src={selectedPokemon.sprites.front_default}
              alt={selectedPokemon.name}
            />
            <h2>
              {selectedPokemon.name.charAt(0).toUpperCase() +
                selectedPokemon.name.slice(1)}
            </h2>
            <div className="types" style={{ marginBottom: "10px" }}>
              {selectedPokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className="type"
                  style={{
                    backgroundColor: typeColors[t.type.name] || "#777",
                    margin: "0 4px",
                  }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
            <p>Height: {selectedPokemon.height}</p>
            <p>Weight: {selectedPokemon.weight}</p>
            <p>
              Base Experience:{" "}
              {selectedPokemon.base_experience}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Favourite;
