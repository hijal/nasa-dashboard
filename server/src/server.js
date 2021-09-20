const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const { loadPlanets } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;

const MONGO_URL = `mongodb+srv://nasa-api:EteHafbdR2jZpGIf@cluster0.kqj5a.mongodb.net/nasa?retryWrites=true&w=majority`;

const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!!!!!');
});

mongoose.connection.on('error', (err) => {
  console.error('Error: ', err);
});

async function loadServer() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await loadPlanets();
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

loadServer();
