const { find } = require('../../models/planets.model');

async function findAll(req, res, next) {
  return res.status(200).json(await find());
}

module.exports = {
  findAll,
};
