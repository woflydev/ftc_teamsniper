const express = require('express');
const axios = require('axios');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/search', async (req, res) => {
  try {
    const { limit, q, region } = req.query;
    const apiUrl = `https://anytrip.com.au/api/v3/region/${region}/search?limit=${limit}&q=${q}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying API request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/departures', async (req, res) => {
  try {
    const { region, query } = req.query; // Assuming you'll pass the region code and station ID as query parameters
    const random = Math.floor(Math.random() * 1000); // prevent api from caching
    const apiUrl = `https://anytrip.com.au/api/v3/region/${region}/departures/${query}?limit=25&offset=0&useRedis=true&cache=${random}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching departures:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/hello', (_, res) => res.send('Hello from the ZeroTrip API!'));
app.get('/healthy', (_, res) => res.status(200).send('OK'));

module.exports = app; // Export the 'app' object
