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
    const { year } = req.query;
    const apiUrl = `https://ftc-api.firstinspires.org/v2.0/${year}/teams`;
    const headers = {
      Authorization: `Basic ${Buffer.from(`woflydev:6C7100E7-CFF1-47FC-ABD1-0B687D7665E0`).toString('base64')}`,
    };

    const response = await axios.get(apiUrl, { headers });
    const pageTotal = response.data.pageTotal;

    if (pageTotal > 1) {
      const lastPageUrl = `https://ftc-api.firstinspires.org/v2.0/${year}/teams?page=${pageTotal}`;
      const lastPageResponse = await axios.get(lastPageUrl, { headers });
      res.json(lastPageResponse.data);
    } else {
      res.json(response.data);
    }
  } catch (error) {
    console.error('Error proxying API request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/hello', (_, res) => res.send('Hello from the FTC TeamSniper API!'));
app.get('/healthy', (_, res) => res.status(200).send('OK'));

module.exports = app;
