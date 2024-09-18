import React, { useState, useEffect } from 'react';
import './App.css';
import Coin from './coin';
import axios from 'axios';

function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;
  const PARAMS = process.env.REACT_APP_PARAMS;


  useEffect(() => {
    axios.get(`${API_URL}${PARAMS}`)
      .then(res => {
        setCoins(res.data);
      })
      .catch(error => console.log(error));
  }, [API_URL, PARAMS]);

  // updating search bar
  const handle_search = (e) => {
    setSearch(e.target.value);
  };

  const filtered_coins = coins.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='coin_tracker'>
      <div className='coin_search'>
        <h1 className='coin_text'>Find a Coin</h1>
        <form>
          <input
            type='text'
            placeholder='Search'
            className='coin_input'
            onChange={handle_search}
          />
        </form>
      </div>
      {filtered_coins.map(coin => {
        return (
          <Coin
            key={coin.id}
            name={coin.name}
            image={coin.image}
            symbol={coin.symbol}
            current_price={coin.current_price}
            mktcap={coin.market_cap}
            dayPercent={coin.price_change_percentage_24h}
          />
        );
      })}
    </div>
  );
}

export default App;
