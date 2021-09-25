const axios = require('axios');
const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
const DEFAULT_FLIGHT_NUMBER = 0;

async function populateLaunch() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        { path: 'rocket', select: { name: 1 } },
        { path: 'payloads', select: { customers: 1 } },
      ],
    },
  });

  if (response.status !== 200) {
    throw new Error('Launches data download failed');
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };
    await create(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Data already loaded.');
  } else {
    await populateLaunch();
  }
}

async function findAll(skip, limit) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function getFlightNumber() {
  const latestData = await launches.findOne().sort('-flightNumber');
  if (!latestData) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestData.flightNumber;
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function findById(launchId) {
  return await findLaunch({
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
  await create(launchData);
}

async function create(launch) {
  await launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
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
  loadLaunchesData,
  findAll,
  findById,
  save,
  destroy,
};
