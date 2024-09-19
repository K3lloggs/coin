// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Coin from './coin'; // Corrected import (from './coin' to './Coin')
import axios from 'axios';
import CoinDetail from './CoinDetail';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');

  // Use default values if environment variables are undefined
  const API_URL =
    process.env.REACT_APP_API_URL ||
    'https://api.coingecko.com/api/v3/coins/markets';
  const PARAMS =
    process.env.REACT_APP_PARAMS ||
    '?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24';

  useEffect(() => {
    axios
      .get(`${API_URL}${PARAMS}`)
      .then((res) => {
        setCoins(res.data);
      })
      .catch((error) => console.log('Error fetching coins:', error));
  }, [API_URL, PARAMS]);

  // Handle search input
  const handle_search = (e) => {
    setSearch(e.target.value);
  };

  // Filter coins based on search query
  const filtered_coins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Router>
      <Routes>
        { }
        <Route
          path="/"
          element={
            <div className="coin_tracker">
              <div className="coin_search">
                <h1 className="coin_text">Find a Coin</h1>
                <form>
                  <input
                    type="text"
                    placeholder="Search"
                    className="coin_input"
                    onChange={handle_search}
                  />
                </form>
              </div>

              {filtered_coins.map((coin) => (
                <Coin
                  key={coin.id}
                  id={coin.id} // Pass the id for routing
                  name={coin.name}
                  image={coin.image}
                  symbol={coin.symbol}
                  current_price={coin.current_price}
                  mktcap={coin.market_cap}
                  dayPercent={coin.price_change_percentage_24h}
                />
              ))}
            </div>
          }
        />

        {}
        <Route path="/coin/:id" element={<CoinDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
