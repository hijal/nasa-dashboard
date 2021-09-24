const http = require('http');
require('dotenv').config();

const { mongoConnection } = require('./configs/mongo.db');
const app = require('./app');
const { loadPlanets } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launch.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function loadServer() {
  await mongoConnection();
  await loadPlanets();
  await loadLaunchesData();

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

loadServer();
