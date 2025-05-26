
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4/sports';

app.get('/api/arbs', async (req, res) => {
  try {
    const sport = 'soccer_epl'; // You can change this to other leagues
    const response = await axios.get(`${BASE_URL}/${sport}/odds`, {
      params: {
        apiKey: API_KEY,
        regions: 'eu,us',
        markets: 'h2h',
        oddsFormat: 'decimal'
      }
    });

    const data = response.data;

    const arbs = data.map(game => {
      const home = game.home_team;
      const away = game.away_team;
      const bookmakers = game.bookmakers;

      const bets = [];
      bookmakers.forEach(bm => {
        const market = bm.markets.find(m => m.key === 'h2h');
        if (market) {
          market.outcomes.forEach(outcome => {
            bets.push({
              outcome: outcome.name,
              odds: outcome.price,
              bookmaker: bm.title
            });
          });
        }
      });

      bets.sort((a, b) => b.odds - a.odds);
      const topTwo = bets.slice(0, 2);
      if (topTwo.length < 2) return null;

      const invSum = topTwo.reduce((sum, b) => sum + 1 / b.odds, 0);
      const margin = (1 - invSum) * 100;

      if (margin > 0) {
        return {
          sport: game.sport_title,
          match: `${home} vs ${away}`,
          market: 'Match Winner',
          margin: margin.toFixed(2),
          bets: topTwo
        };
      }

      return null;
    }).filter(Boolean);

    res.json(arbs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch odds' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
