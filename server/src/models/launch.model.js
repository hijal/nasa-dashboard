const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 0;

async function findAll() {
  return await launches.find({}, { _id: 0, __v: 0 });
}

async function getFlightNumber() {
  const latestData = await launches.findOne().sort('-flightNumber');
  if (!latestData) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestData.flightNumber;
}

async function findById(launchId) {
  return await launches.findOne({
    flightNumber: launchId,
  });
}

async function save(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    return new Error('Planet not found');
  }
  const latestFlightNumber = (await getFlightNumber()) + 1;
  const launchData = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['NASA'],
    flightNumber: latestFlightNumber,
  });
  await launches.findOneAndUpdate(
    {
      flightNumber: launchData.flightNumber,
    },
    launchData,
    { upsert: true }
  );
}

async function destroy(launchId) {
  const aborted = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    { upcoming: false, success: false }
  );
  return aborted.modifiedCount === 1 && aborted.matchedCount === 1;
}

module.exports = {
  findAll,
  findById,
  save,
  destroy,
};
