const router = require('express').Router();

const planetsRouter = require('./planets/planets.router');
const launchesRouter = require('./launches/launches.router');

router.use('/planets', planetsRouter);
router.use('/launches', launchesRouter);

module.exports = router;
