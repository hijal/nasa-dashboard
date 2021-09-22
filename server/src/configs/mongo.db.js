const mongoose = require('mongoose');

const MONGO_URL = `mongodb+srv://nasa-api:EteHafbdR2jZpGIf@cluster0.kqj5a.mongodb.net/nasa?retryWrites=true&w=majority`;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!!!!!');
});

mongoose.connection.on('error', (err) => {
  console.error('Error: ', err);
});

async function mongoConnection() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnection,
  mongoDisconnect
};
