const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const dataFilePath = path.join(__dirname, 'latest.json');

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


// Initialize the latest data file if it doesn't exist
const initializeLatestDataFile = () => {
  if (!fs.existsSync(dataFilePath)) {
    const defaultData = { latestTeamNumber: 0, pageNumber: 1 };
    fs.writeFileSync(dataFilePath, JSON.stringify(defaultData));
  }
};

// Read the latest data (team number and page number) from the file
const readLatestData = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading latest data:', error);
  }
  return { latestTeamNumber: 0, pageNumber: 1 };
};

// Write the latest data (team number and page number) to the file
const writeLatestData = (latestTeamNumber, pageNumber) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify({ latestTeamNumber, pageNumber }));
  } catch (error) {
    console.error('Error writing latest data:', error);
  }
};

const isValidTeamNumber = (number) => /^\d{1,5}$/.test(number);
// Check if a team number starts with 9, 99, or 999
const startsWithNines = (number) => /^9{1,3}/.test(number.toString());

app.get('/api/latest', async (req, res) => {
  try {
    const { year } = req.query;
    const headers = {
      Authorization: `Basic ${Buffer.from('woflydev:6C7100E7-CFF1-47FC-ABD1-0B687D7665E0').toString('base64')}`,
    };

    console.info("Initializing data file!")
    initializeLatestDataFile();

    console.info("Reading data file...")
    const latestData = readLatestData();
    let { latestTeamNumber, pageNumber } = latestData;
    console.info("Data loaded!")

    let page = pageNumber;
    let stopIteration = false;

    console.info("Starting from page", page)
    while (!stopIteration) {
      const apiUrl = `https://ftc-api.firstinspires.org/v2.0/${year}/teams?page=${page}`;
      console.log("Fetching data from page", page)
      try {
        const response = await axios.get(apiUrl, { headers });
        const data = response.data;

        if (data.teamCountTotal === 0 || !data.teams || data.teams.length === 0) {
          stopIteration = true;
          break;
        }

        const validTeams = data.teams.filter(team => isValidTeamNumber(team.teamNumber) && !startsWithNines(team.teamNumber));
        if (validTeams.length > 0) {
          latestTeamNumber = Math.max(latestTeamNumber, ...validTeams.map(team => team.teamNumber));
        }

        if (data.pageTotal <= page) {
          stopIteration = true;
          console.log("Highest valid team found!")
          break;
        }

        page++;
      } catch (error) {
        console.error(`Error fetching data from page ${page}:`, error);
        stopIteration = true;
      }
    }

    console.info("\nFinishing up...")
    console.info("Writing data to file...")
    writeLatestData(latestTeamNumber, page - 1);

    res.json({ latestTeamNumber });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  console.info("\n=============Run complete!=============\n")
});

app.get('/hello', (_, res) => res.send('Hello from the FTC TeamSniper API!'));
app.get('/healthy', (_, res) => res.status(200).send('OK'));

module.exports = app;
