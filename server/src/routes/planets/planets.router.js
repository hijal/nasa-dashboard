const planetsRouter = require('express').Router();
const { findAll } = require('./planets.controller');

planetsRouter.get('/', findAll);

module.exports = planetsRouter;
