import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pokemon from "./components/Pokemon";
import Favourite from "./components/Favourite";
import Navbar from "./components/Navbar";
import "./styles/App.css";

const App = () => {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on first mount
  useEffect(() => {
    const storedFavs = localStorage.getItem("favorites");
    if (storedFavs) {
      setFavorites(JSON.parse(storedFavs));
    }
  }, []);

  // Save to localStorage every time favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <input
                  type="text"
                  placeholder="Search Pokémon..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
                <Pokemon search={search} favorites={favorites} setFavorites={setFavorites} />
              </>
            }
          />
          <Route
            path="/favourites"
            element={<Favourite favorites={favorites} setFavorites={setFavorites} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
