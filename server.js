const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/api/arbs', (req, res) => {
  const fakeData = [
    {
      sport: "Football",
      match: "Team A vs Team B",
      market: "Match Winner",
      margin: 5.4,
      bets: [
        { outcome: "Team A", odds: 2.1, bookmaker: "BookieOne" },
        { outcome: "Team B", odds: 2.1, bookmaker: "BookieTwo" }
      ]
    }
  ];
  res.json(fakeData);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
