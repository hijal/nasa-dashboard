const request = require('supertest');
const app = require('../../app');
const { mongoConnection, mongoDisconnect } = require('../../configs/mongo.db');
const { loadPlanets } = require('../../models/planets.model');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnection();
    await loadPlanets();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 201 status code', async () => {
      await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const completedLaunchData = {
      mission: 'abc bd',
      rocket: 'abc-rocket bd',
      target: 'abc bd',
      launchDate: 'June 1, 2029',
    };
    const launchDataWithoutDate = {
      mission: 'abc bd',
      rocket: 'abc-rocket bd',
      target: 'abc bd',
    };

    const invalidLaunchDate = {
      mission: 'abc bd',
      rocket: 'abc-rocket bd',
      target: 'abc bd',
      launchDate: 'jun',
    };

    test('It should respond with 200 status code', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completedLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const reqLaunchDate = new Date(completedLaunchData.launchDate).valueOf();
      const resLaunchDate = new Date(response.body.launchDate).valueOf();

      expect(response.body).toMatchObject(launchDataWithoutDate);
      expect(resLaunchDate).toBe(reqLaunchDate);
    });
    test('It should catch missing required fields', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
      expect(response.body).toStrictEqual({
        error: 'Missing required fields.',
      });
    });
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(invalidLaunchDate)
        .expect('Content-Type', /json/)
        .expect(400);
      expect(response.body).toStrictEqual({ error: 'Invalid launch date.' });
    });
  });
});
