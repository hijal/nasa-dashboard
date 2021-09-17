const launchesRouter = require('express').Router();
const { fetchAll, add, remove } = require('./launches.controller');

launchesRouter.get('/', fetchAll);
launchesRouter.post('/', add);
launchesRouter.delete('/:id', remove);

module.exports = launchesRouter;
