const {
  findAll,
  save,
  findById,
  destroy,
} = require('../../models/launch.model');

async function fetchAll(req, res) {
  return res.status(200).json(await findAll());
}

async function add(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.launchDate ||
    !launch.rocket ||
    !launch.target
  ) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: 'Invalid launch date.' });
  }
  await save(launch);
  return res.status(201).json(launch);
}

function remove(req, res) {
  let launchId = +req.params.id;
  if (!findById(launchId)) {
    return res.json(404).json({ error: 'launch not found.' });
  }
  const abortLaunch = destroy(launchId);

  return res.status(200).json(abortLaunch);
}

module.exports = {
  fetchAll,
  add,
  remove,
};
