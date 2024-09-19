// src/Coin.js
import React from 'react';
import './Coin.css';
import { Link } from 'react-router-dom';

const Coin = ({
  id,
  name,
  image,
  symbol,
  current_price,
  mktcap,
  dayPercent,
}) => {
  return (
    <Link to={`/coin/${id}`} className="coin_link">
      <div className="coin_container">
        <div className="coin_row">
          <div className="coin">
            <img src={image} alt="crypto" />
            <h1>{name}</h1>
            <p className="coin_symbol">{symbol.toUpperCase()}</p>
          </div>
          <div className="coin_data">
            <p className="coin_price">
              ${current_price ? current_price.toLocaleString() : 'N/A'}
            </p>

            <p className="coin_mkt_cap">
              ${mktcap ? mktcap.toLocaleString() : 'N/A'}
            </p>
            {dayPercent !== undefined ? (
              dayPercent < 0 ? (
                <p className="coin_percent_red">{dayPercent.toFixed(2)}%</p>
              ) : (
                <p className="coin_percent_green">{dayPercent.toFixed(2)}%</p>
              )
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Coin;
