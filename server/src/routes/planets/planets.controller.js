const { planets } = require('../../models/planets.model');

function findAll(req, res, next) {
  return res.status(200).json(planets());
}

module.exports = {
  findAll,
};
