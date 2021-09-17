const launches = new Map();

let latestFlightNumber = 100;

function findAll() {
  return Array.from(launches.values());
}

function findById(launchId) {
  return launches.has(launchId);
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
