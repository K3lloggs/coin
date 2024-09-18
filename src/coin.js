import React from 'react'
import './Coin.css'
const coin = ({ name, image, symbol, current_price, mktcap, dayPercent }) => {
  return (
    <div className='coin_container'>
      <div className='coin_row'>
        <div className='coin'>
          <img src={image} alt='crypto' />
          <h1>{name}</h1>
          <p className='coin symbol'>{symbol}</p>
        </div>
        <div className='coin_data'>
          <p className='coin_price'>${current_price.toLocaleString()}</p>
          <p className='coin_mkt_cap'>${mktcap}</p>
          {dayPercent < 0 ? (
            <p className='coin_percent_red' >{dayPercent.toFixed(2)}% </p>
          ) : (
            <p className='coin_percent_green'>{dayPercent.toFixed(2)}%</p>
          )}
          <p className='coin_market_cap'>Mkt cap: ${mktcap.toLocaleString()}</p>


        </div>
      </div>
    </div>
  );
}

export default coin
