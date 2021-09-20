const launches = require('./launches.mongo');

let latestFlightNumber = 100;

function findAll() {
  return Array.from(launches.values());
}

function findById(launchId) {
  return launches.has(launchId);
}

async function saveLaunch(launch) {
  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

function save(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ['NASA BD'],
      flightNumber: latestFlightNumber,
    })
  );
}

function destroy(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  findAll,
  findById,
  save,
  destroy,
};
