const {
  findAll,
  save,
  findById,
  destroy,
} = require('../../models/launch.model');

const { getPagination } = require('../../configs/query');

async function fetchAll(req, res) {
  const {skip, limit} = getPagination(req.query);
  const launches = await findAll(skip, limit);
  return res.status(200).json(launches);
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

async function remove(req, res) {
  let launchId = +req.params.id;

  const isExist = await findById(launchId);
  if (!isExist) {
    return res.json(404).json({ error: 'launch not found.' });
  }
  const aborted = await destroy(launchId);
  if (!aborted) {
    return res.status(400).json({ error: `Launch not found!` });
  }
  return res.status(200).json({ ok: true });
}

module.exports = {
  fetchAll,
  add,
  remove,
};
