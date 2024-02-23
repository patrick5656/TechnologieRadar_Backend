const request = require('supertest');
const createApp = require('../app');
const mySqlDatabaseInterface = require('../MySqlDatabaseInterface');

// Create DB-Connection
const mysqlConnectionParams = {
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'dbuser',
    password: process.env.PASSWORD || 'weblab24',
    database: process.env.DATABASE || 'technology_radar',
};
const db = new mySqlDatabaseInterface(mysqlConnectionParams);
const app = createApp(db);


describe('GET /api/test', () => {
    it('responds with 200', (done) => {
        request(app).get('/api/test').expect(200, done);
    });
});