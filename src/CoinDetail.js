// CoinDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './CoinDetail.css';

// Custom Tooltip Component (unchanged)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom_tooltip">
        <p className="label">{`${label}`}</p>
        <p className="price">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }

  return null;
};

const CoinDetail = () => {
  const { id } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [marketData, setMarketData] = useState(null);
  const [timeInterval, setTimeInterval] = useState('30'); // Default to 30 days

  // Hardcoded API URLs for testing
  const COIN_DETAIL_API_URL = `https://api.coingecko.com/api/v3/coins/${id}`;
  const COIN_CHART_API_URL = `https://api.coingecko.com/api/v3/coins/${id}/market_chart`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch detailed coin data (current data)
        const coinResponse = await axios.get(COIN_DETAIL_API_URL, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
          },
        });
        setCoinData(coinResponse.data);

        // Fetch market chart data based on selected interval
        const chartResponse = await axios.get(COIN_CHART_API_URL, {
          params: {
            vs_currency: 'usd',
            days: timeInterval,
          },
        });

        // Extract data arrays
        const prices = chartResponse.data.prices;
        const marketCaps = chartResponse.data.market_caps;
        const totalVolumes = chartResponse.data.total_volumes;

        // Transform the chart data for the graph
        const transformedChartData = prices.map((price, index) => {
          const date = new Date(price[0]);
          let formattedDate;

          if (timeInterval === '1') {
            formattedDate = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
          } else if (timeInterval === '7' || timeInterval === '30') {
            formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
          } else if (timeInterval === '365') {
            formattedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
          } else {
            formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
          }

          return {
            date: formattedDate,
            price: parseFloat(price[1]),
          };
        });
        setChartData(transformedChartData);

        // Extract market data for the selected interval
        // We'll use the first and last entries of the arrays
        const firstIndex = 0;
        const lastIndex = prices.length - 1;

        // Market data at the start of the interval
        const startPrice = prices[firstIndex][1];
        const startMarketCap = marketCaps[firstIndex][1];
        const startTotalVolume = totalVolumes[firstIndex][1];

        // Market data at the end of the interval (current data)
        const endPrice = prices[lastIndex][1];
        const endMarketCap = marketCaps[lastIndex][1];
        const endTotalVolume = totalVolumes[lastIndex][1];

        // Calculate percentage changes
        const priceChange = ((endPrice - startPrice) / startPrice) * 100;
        const marketCapChange = ((endMarketCap - startMarketCap) / startMarketCap) * 100;
        const volumeChange = ((endTotalVolume - startTotalVolume) / startTotalVolume) * 100;

        // Set market data state
        setMarketData({
          currentPrice: endPrice,
          marketCap: endMarketCap,
          totalVolume: endTotalVolume,
          priceChangePercentage: priceChange,
          marketCapChangePercentage: marketCapChange,
          volumeChangePercentage: volumeChange,
          high24h: coinResponse.data.market_data.high_24h.usd,
          low24h: coinResponse.data.market_data.low_24h.usd,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, timeInterval]);

  const handleTimeIntervalChange = (interval) => {
    setTimeInterval(interval);
  };

  if (!coinData) return <div>Loading...</div>;

  return (
    <div className="coin_detail">
      <Link to="/" className="back_link">
        ← Back to List
      </Link>
      <div className="detail_header">
        <img src={coinData.image.large} alt={coinData.name} />
        <h1>
          {coinData.name} ({coinData.symbol.toUpperCase()})
        </h1>
      </div>
      <div className="time_interval_buttons">
        <button
          className={timeInterval === '1' ? 'active' : ''}
          onClick={() => handleTimeIntervalChange('1')}
        >
          1 Day
        </button>
        <button
          className={timeInterval === '7' ? 'active' : ''}
          onClick={() => handleTimeIntervalChange('7')}
        >
          1 Week
        </button>
        <button
          className={timeInterval === '30' ? 'active' : ''}
          onClick={() => handleTimeIntervalChange('30')}
        >
          1 Month
        </button>
        <button
          className={timeInterval === '365' ? 'active' : ''}
          onClick={() => handleTimeIntervalChange('365')}
        >
          1 Year
        </button>
      </div>
      <div className="chart_container">
        <h2>Price Chart</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
      <div className="market_data">
  <h2>Market Data</h2>
  {marketData ? (
    <>
      <p>
        <span>Current Price:</span>
        <span>${marketData.currentPrice.toLocaleString()}</span>
      </p>
      <p>
        <span>Market Cap:</span>
        <span>${marketData.marketCap.toLocaleString()}</span>
      </p>
      <p>
        <span>Total Volume:</span>
        <span>${marketData.totalVolume.toLocaleString()}</span>
      </p>
      <p>
        <span>High:</span>
        <span>${marketData.high24h.toLocaleString()}</span>
      </p>
      <p>
        <span>Low:</span>
        <span>${marketData.low24h.toLocaleString()}</span>
      </p>
      <p>
        <span>Price Change:</span>
        <span
          className={
            marketData.priceChangePercentage < 0
              ? 'coin_percent_red'
              : 'coin_percent_green'
          }
        >
          {marketData.priceChangePercentage.toFixed(2)}%
        </span>
      </p>
      <p>
        <span>Market Cap Change:</span>
        <span
          className={
            marketData.marketCapChangePercentage < 0
              ? 'coin_percent_red'
              : 'coin_percent_green'
          }
        >
          {marketData.marketCapChangePercentage.toFixed(2)}%
        </span>
      </p>
      <p>
        <span>Volume Change:</span>
        <span
          className={
            marketData.volumeChangePercentage < 0
              ? 'coin_percent_red'
              : 'coin_percent_green'
          }
        >
          {marketData.volumeChangePercentage.toFixed(2)}%
        </span>
      </p>
    </>
  ) : (
    <p>Loading market data...</p>
  )}
</div>

    </div>
  );
};

export default CoinDetail;
