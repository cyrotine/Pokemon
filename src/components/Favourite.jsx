import React, { useEffect, useState } from "react";
import "../styles/Pokemon.css";

const Favourite = ({ favorites, setFavorites }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);

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
    <div className="pokemon-grid">
      {pokemonList.map((poke) => (
        <div key={poke.id} className="pokemon-card favorite">
          <img src={poke.sprites.front_default} alt={poke.name} />
          <h2>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h2>
          <div className="types">
            {poke.types.map((t) => (
              <span
                key={t.type.name}
                className="type"
                style={{
                  backgroundColor: typeColors[t.type.name] || "#777",
                }}
              >
                {t.type.name}
              </span>
            ))}
          </div>
          <button onClick={() => toggleFavorite(poke.id)} className="fav-btn">
            ★ Remove Favourite
          </button>
        </div>
      ))}
    </div>
  );
};

export default Favourite;